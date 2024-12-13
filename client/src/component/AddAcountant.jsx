import { LuDot } from "react-icons/lu";

export default function AddAcountant() {
  const routes = ["Accountants", "Add Accountant"];
  return (
    <div className="md:first:p-6 p-4 bg-[#F4F5F7] dark:bg-secondary-dark-bg rounded-md h-full">
      <div>
        <h1 className="text-xl font-semibold leading-[1.5] dark:text-white">
          Create new Accountant
        </h1>
        <ul className="flex flex-row items-center space-x-2 text-sm py-2">
          {routes.map((route, index) => (
            <li
              key={index}
              className={`flex flex-row items-center ${
                index === routes.length - 1
                  ? "text-gray-400"
                  : "text-slate-900 dark:text-gray-200"
              }`}
            >
              {index > 0 && (
                <LuDot className="text-lg text-gray-400 font-bold mx-1" />
              )}
              {route}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 md:p-2 p-4 overflow-hidden bg-white dark:bg-gray-800 rounded-lg   flex flex-col items-center justify-center max-w-[400px] h-[500px] mx-auto shadow-md">
        <h2 className="text-lg font-semibold dark:text-gray-200">
          Add Accountant
        </h2>

        <form className="px-4 py-4 flex flex-col space-y-8 w-full ">
          {[
            { id: "Accountant Name", label: "Accountant Name", type: "text" },
            { id: "Email", label: "Email", type: "email" },
            { id: "Phone", label: "Phone", type: "number" },
          ].map(({ id, label, type }) => (
            <div key={id} className="w-full max-w-sm">
              <div className="relative">
                <input
                  id={id}
                  className="peer input border border-gray-300 rounded-md w-full p-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type={type}
                  placeholder=" " // Placeholder space for floating label
                />
                <label
                  htmlFor={id}
                  className="absolute text-sm text-gray-400 dark:text-gray-300 transition-all transform origin-left bg-white dark:bg-gray-800 px-2 left-3 top-2.5 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-blue-500 peer-focus:text-xs"
                >
                  {label}
                </label>
              </div>
            </div>
          ))}

          <div className="w-full  ">
            <select
              id="countries"
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2 outline-none cursor-pointer"
            >
              <option value="">Choose a country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
            </select>
          </div>

          <button className="blackbutton w-full max-w-sm !text-center">
            Add Accountant
          </button>
        </form>
      </div>
    </div>
  );
}
