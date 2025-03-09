import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Trash,
  Plus,
  RefreshCcwDot,
} from "lucide-react";

function NotesComponent() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");

  const titleTimeoutRef = useRef(null);
  const contentTimeoutRef = useRef(null);
  const [isSynced, setIsSynced] = useState(true);
  const [rotate, setRotate] = useState(false); // used to rotate sync icon
  const [currentPage, setCurrentPage] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const textAreaRef = useRef(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchNotes();

    if (textAreaRef.current) {
      setScrollHeight(textAreaRef.current.scrollHeight);
    }
    return () => {
      clearTimeout(titleTimeoutRef.current);
      clearTimeout(contentTimeoutRef.current);
    };
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/note",
        getAuthHeader()
      );
      if (response.data.success) {
        if (!response.data.data || response.data.data.length === 0) {
          addNewPage(); // adding new is necessary cause we get err in posting data to db.
        } else {
          setNotes(response.data.data);
        }
      } else {
        setError("Something wrong at our end");
      }
    } catch (err) {
      setError(err?.response?.data?.error);
    }
  };

  // This function manages whether to update note or create new.
  const handleSync = () => {
    setRotate(true);
    setTimeout(() => setIsSynced(true), 700);
    if (notes[currentPage]._id === undefined) {
      handleAddNote();
      return;
    }
  };

  const addNewPage = () => {
    const newNote = { content: "", title: "", date: new Date() };
    setNotes((prevNotes) => [...prevNotes, newNote]);
    setCurrentPage(notes.length);
  };

  const goToNextPage = () => {
    if (currentPage < notes.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleAddNote = async () => {
    if (
      notes[currentPage]?.title.trim() === "" ||
      notes[currentPage]?.content.trim() === ""
    ) {
      setError("Title and content are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/note",
        {
          title: notes[currentPage].title,
          content: notes[currentPage].content,
        },
        getAuthHeader()
      );

      if (response.data.success) {
        fetchNotes();
        setError(""); // Clear errors
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to add note try refreshing page"
      );
      console.log(err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/note/${id}`,
        getAuthHeader()
      );
      if (response.data.success) {
        fetchNotes();
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to delete note try refreshinng page"
      );
    }
  };

  const handleNoteContentChange = async (event) => {
    const updatedText = event.target.value;
    isSynced === true ? (setIsSynced(false), setRotate(false)) : "";
    setNotes((prevNotes) =>
      prevNotes.map((note, index) =>
        index === currentPage ? { ...note, content: updatedText } : note
      )
    );

    clearTimeout(titleTimeoutRef.current);
    titleTimeoutRef.current = setTimeout(async () => {
      try {
        handleSync();
        const noteId = notes[currentPage]._id;
        await axios.put(
          `http://localhost:3000/note/${noteId}`,
          {
            content: updatedText,
          },
          getAuthHeader()
        );
      } catch (err) {
        console.error("Error updating note content:", err);
        setIsSynced(true); // hide sync if error occurs
      }
    }, 3000);
  };

  const handleTitleChange = async (event) => {
    const updatedTitle = event.target.value;
    isSynced === true ? (setIsSynced(false), setRotate(false)) : "";
    setNotes((prevNotes) =>
      prevNotes.map((note, index) =>
        index === currentPage ? { ...note, title: updatedTitle } : note
      )
    );

    clearTimeout(contentTimeoutRef.current);
    contentTimeoutRef.current = setTimeout(async () => {
      try {
        handleSync();
        const noteId = notes[currentPage]._id;
        await axios.put(
          `http://localhost:3000/note/${noteId}`,
          {
            title: updatedTitle,
          },
          getAuthHeader()
        );
      } catch (err) {
        console.error("Error updating note title:", err);
        setIsSynced(true);
      }
    }, 3000);
  };

  const handleScroll = () => {
    if (textAreaRef.current) {
      setScrollPosition(textAreaRef.current.scrollTop);
      setScrollHeight(textAreaRef.current.scrollHeight);
    }
  };

  return (
    <div className="bg-sec txt rounded-3xl py-6 px-3 w-full mx-auto relative shadow">
      {error && <p className="text-red-500">{error}</p>}

      {/* Navigation */}
      <div className="flex justify-between px-3">
        <div className="flex gap-4 items-center">
          <h3 className="text-2xl font-semibold">Notes</h3>
          <button
            className="p-1.5 rounded-full hover:bg-ter"
            onClick={addNewPage}
          >
            <Plus />
          </button>
        </div>
        <div className="flex space-x-2 items-center">
          <span className="text-yellow-300 opacity-90 text-lg">
            {notes.length > 0 ? `${currentPage + 1}/${notes.length}` : "1/1"}
          </span>
          <button
            onClick={goToPreviousPage}
            className={`p-1.5 rounded-full hover:bg-ter ${
              currentPage === 0 ? "txt-dim" : ""
            }`}
          >
            <ChevronLeft />
          </button>
          <button
            onClick={goToNextPage}
            className={`p-1.5 rounded-full hover:bg-ter ${
              currentPage === notes.length - 1 ? "txt-dim" : ""
            }`}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Title, Delete and Sync Button */}
      <div className="flex justify-between mt-5 items-center w-full px-3">
        <input
          type="text"
          value={notes[currentPage]?.title || ""}
          onChange={handleTitleChange}
          placeholder="Title"
          className="bg-transparent outline-none p-0.5 text-lg flex-1 w-28 font-semibold text-yellow-400 opacity-85"
        />
        {!isSynced && (
          <button
            className="text-black text-lg hover:bg-yellow-300 rounded-full mx-3 py-0.5 px-4 bg-yellow-400 flex items-center gap-2 transition-transform transform opacity-100"
          >
            sync
            <div
              className="h-4"
              style={{
                transform: rotate ? "rotate(-360deg)" : "rotate(0deg)",
                transition: "transform 0.7s ease-in-out",
              }}
            >
              <RefreshCcwDot className="h-4" />
            </div>
          </button>
        )}
        <button onClick={() => handleDeleteNote(notes[currentPage]?._id)}>
          <Trash className="h-5 txt-dim hover:text-red-500" />
        </button>
      </div>

      {/* Content */}
      <div className="relative w-full h-64 overflow-hidden">
        <div
          className="absolute w-full pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 30px, #6E6E6E 39px )`,
            backgroundSize: "100% 32px",
            transform: `translateY(-${scrollPosition}px)`,
            height: `${scrollHeight}px`,
            marginTop: "2px",
          }}
        ></div>
        <textarea
          ref={textAreaRef}
          id="area"
          className="relative w-full h-full bg-transparent txt-dim p-2 px-3 outline-none resize-none font-kalam font-light"
          style={{
            lineHeight: "32px",
            paddingTop: "8px",
          }}
          placeholder="Take a note..."
          onScroll={handleScroll}
          value={notes[currentPage]?.content}
          onChange={handleNoteContentChange}
        ></textarea>
      </div>

      {/* Date and Time */}
      <div className="absolute bottom-3 right-12 txt-dim bg-sec">
        {notes[currentPage]?.createdAt
          ? new Date(notes[currentPage].createdAt).toLocaleDateString() +
            "\u00A0\u00A0\u00A0" +
            new Date(notes[currentPage].createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "No date available"}
      </div>
    </div>
  );
}

export default NotesComponent;
