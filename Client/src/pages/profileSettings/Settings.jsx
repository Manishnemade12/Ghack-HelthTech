const Settings = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4 txt">
        Appearance & Preferences
      </h1>
      <form className="space-y-4">
        <div>
          <label className="block mb-1 txt-dim">Theme</label>
          <select className="w-full border border-txt-dim rounded px-3 py-2 bg-sec txt">
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 txt-dim">Clock Format</label>
          <select className="w-full border border-txt-dim rounded px-3 py-2 bg-sec txt">
            <option>12-hour</option>
            <option>24-hour</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 txt-dim">Language</label>
          <select className="w-full border border-txt-dim rounded px-3 py-2 bg-sec txt">
            <option>English</option>
            <option>Spanish</option>
            {/* Add more languages as needed */}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 btn txt rounded hover:bg-[var(--btn-hover)]"
        >
          Save Preferences
        </button>
      </form>
    </div>
  );
};

export default Settings;
