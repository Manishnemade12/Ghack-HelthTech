import { useState } from "react";

function CreateRoomModal({ isOpen, onClose, onCreate }) {
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomName.trim() === "") return;
    onCreate(roomName);
    setRoomName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
    >
      <div className="p-8 rounded-2xl w-96 shadow-2xl transition-all bg-sec">
        <h2 className="text-2xl font-bold txt mb-6">Create a New Room</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            className="w-full px-4 py-3 mb-6 rounded-lg bg-sec txt placeholder:txt-dim border border-gray-500/50 focus:outline-none"
            style={{ "--tw-ring-color": "var(--btn)" }}
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-txt-dim txt-dim hover:bg-sec transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg btn hover:bg-[var(--btn-hover)] txt transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRoomModal;
