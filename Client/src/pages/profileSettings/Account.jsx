const Account = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Account Settings</h1>
      <form className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            placeholder="Your email"
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            placeholder="New password"
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button type="submit" className="px-4 py-2 btn ">
          Update Account
        </button>
      </form>
      <div className="mt-6">
        <button className="px-4 py-2 bg-red-600 btn hover:bg-red-700">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Account;
