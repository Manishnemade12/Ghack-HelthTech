import { useState, useEffect } from "react";
import { ExternalLink, Plus, X, MoreVertical } from "lucide-react";

// Helper to get domain from a URL
function getDomain(url) {
  try {
    const { hostname } = new URL(url);
    return hostname;
  } catch {
    return "";
  }
}

// Helper to build a Google S2 favicon URL for a domain
function getFaviconUrl(link) {
  const domain = getDomain(link);
  return `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
}

function PinnedLinks() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editItemId, setEditItemId] = useState(null); // if not null => editing
  const [title, setTitle] = useState("");
  const [mainLink, setMainLink] = useState("");

  const [pinnedLinks, setPinnedLinks] = useState([]);
  const [extraLinks, setExtraLinks] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedLinks = JSON.parse(localStorage.getItem("pinnedLinks") || "[]");
    setPinnedLinks(storedLinks);
  }, []);

  const saveToLocalStorage = (linksArray) => {
    localStorage.setItem("pinnedLinks", JSON.stringify(linksArray));
  };

  const handleSaveLink = () => {
    if (!title.trim() || !mainLink.trim()) return;

    if (editItemId) {
      const updated = pinnedLinks.map((item) => {
        if (item.id === editItemId) {
          return {
            ...item,
            title,
            links: [mainLink, ...extraLinks.filter((l) => l.trim())],
          };
        }
        return item;
      });
      setPinnedLinks(updated);
      saveToLocalStorage(updated);
    } else {
      const newItem = {
        id: Date.now(),
        title,
        links: [mainLink, ...extraLinks.filter((l) => l.trim())],
      };
      const updated = [...pinnedLinks, newItem];
      setPinnedLinks(updated);
      saveToLocalStorage(updated);
    }

    // Reset inputs and close modal
    setTitle("");
    setMainLink("");
    setExtraLinks([]);
    setEditItemId(null);
    setShowModal(false);
  };

  const handleAddNew = () => {
    setEditItemId(null);
    setTitle("");
    setMainLink("");
    setExtraLinks([]);
    setShowModal(true);
    setShowDropdown(false);
  };

  const handleEditLink = (id) => {
    const item = pinnedLinks.find((p) => p.id === id);
    if (!item) return;

    setEditItemId(id);
    setTitle(item.title);
    setMainLink(item.links[0] || "");
    setExtraLinks(item.links.slice(1));
    setShowModal(true);
    setOpenMenuId(null);
  };

  const handleDeleteLink = (id) => {
    const updated = pinnedLinks.filter((item) => item.id !== id);
    setPinnedLinks(updated);
    saveToLocalStorage(updated);
    setOpenMenuId(null);
  };

  const handleAddAnotherLink = () => {
    setExtraLinks([...extraLinks, ""]);
  };

  const handleExtraLinkChange = (index, value) => {
    const updated = [...extraLinks];
    updated[index] = value;
    setExtraLinks(updated);
  };

  const openWorkspace = (links) => {
    // Attempt to open them all in one synchronous user-initiated event
    links.forEach((lnk) => {
      window.open(lnk, "_blank");
    });
  };

  return (
    <div className="relative z-50">
      <button
        className="flex gap-3 font-bold text-lg items-center txt"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <ExternalLink />
        Links
      </button>

      {/* Dropdown of existing pinned links + add button */}
      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 bg-sec shadow-md rounded-lg p-2 z-10 min-w-[17rem]">
          {pinnedLinks.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-4 py-2 txt hover:bg-ter rounded"
            >
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => openWorkspace(item.links)}
              >
                {item.links.map((link, idx) => (
                  <img
                    key={idx}
                    src={getFaviconUrl(link)}
                    alt="icon"
                    className="w-4 h-4"
                  />
                ))}
                <span>{item.title}</span>
              </div>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Toggle the menu for this item
                    setOpenMenuId(openMenuId === item.id ? null : item.id);
                  }}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {openMenuId === item.id && (
                  <div className="absolute right-0 mt-1 bg-ter shadow-md rounded p-1 z-10 min-w-[5rem]">
                    <button
                      onClick={() => handleEditLink(item.id)}
                      className="block w-full text-left px-2 py-1 hover:bg-sec"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLink(item.id)}
                      className="block w-full text-left px-2 py-1 hover:bg-sec"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* "Add Link" button */}
          <button
            onClick={handleAddNew}
            className="block w-full px-4 py-2 txt hover:bg-ter rounded mt-1 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Link
          </button>
        </div>
      )}

      {/* Modal for adding/editing a workspace */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-sec p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold txt">
                {editItemId ? "Edit link" : "Create a link"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditItemId(null);
                }}
              >
                <X className="w-5 h-5 txt" />
              </button>
            </div>

            {/* Title */}
            <label className="block mb-2 txt">
              TITLE
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 p-2 border rounded bg-ter txt"
                style={{ border: "1px solid var(--txt-disabled)" }}
                placeholder="e.g. Amazon"
              />
            </label>

            {/* Main link */}
            <label className="block mb-2 txt">
              LINKS
              <input
                type="text"
                value={mainLink}
                onChange={(e) => setMainLink(e.target.value)}
                className="w-full mt-1 p-2 border rounded bg-ter txt"
                style={{ border: "1px solid var(--txt-disabled)" }}
                placeholder="e.g. https://amazon.com"
              />
            </label>

            {/* Additional tabs/links */}
            {extraLinks.map((linkVal, idx) => (
              <div key={idx} className="mb-2">
                <input
                  type="text"
                  value={linkVal}
                  onChange={(e) => handleExtraLinkChange(idx, e.target.value)}
                  className="w-full mt-1 p-2 border rounded bg-ter txt"
                  style={{ border: "1px solid var(--txt-disabled)" }}
                  placeholder="Another link..."
                />
              </div>
            ))}

            {/* "Add another tab" button */}
            <button
              type="button"
              onClick={handleAddAnotherLink}
              className="text-sm flex items-center gap-1 mt-1 txt"
            >
              <Plus className="w-4 h-4" />
              Add another tab
            </button>

            {/* Save (Add/Edit) button */}
            <div className="flex justify-end mt-4">
              <button onClick={handleSaveLink} className="btn px-4 py-2">
                {editItemId ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PinnedLinks;
