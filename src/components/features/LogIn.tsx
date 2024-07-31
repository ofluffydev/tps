import { CircleUserIcon } from "lucide-react";

function LogIn() {
  return (
    <div className="container border-neutral-500 border-4 rounded-xl mx-auto p-4 w-72 text-center dark:bg-neutral-900">
      <h1 className="text-2xl font-bold mb-4">Log In</h1>
      <CircleUserIcon size={64} className="mx-auto" />
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full border border-gray-300 rounded p-2 dark:bg-neutral-900"
          />
        </div>
        <div>
          <label htmlFor="password" className="block">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full border border-gray-300 rounded p-2 dark:bg-neutral-900"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white rounded p-2">
          Log In
        </button>
      </form>
    </div>
  );
}

export default LogIn;
