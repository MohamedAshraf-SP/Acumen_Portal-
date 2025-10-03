import { useState } from "react";
import { IoIosSearch, IoIosArrowDown } from "react-icons/io";
import Contentloader from "./Contentloader";

const ComboBox = ({ arr, searchQuery, onSelect, title, loading }) => {
  const [query, setQuery] = useState(searchQuery || "");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item

  const filteredItems = arr
    ?.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
    ?.map((item) => ({ name: item.name, id: item._id }));

  return (
    <div className="max-w-sm relative">
      {/* Search Input */}
      <div
        className="relative flex flex-row items-center gap-1 w-full border border-gray-300 rounded-md px-1 py-2 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <span className="text-gray-500">
          <IoIosSearch />
        </span>
        <input
          className="outline-none text-sm text-gray-800 w-full"
          type="text"
          placeholder={title}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="comboBoxList"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedItem(null);  
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Delay to allow click
        />
        <span
          className="text-gray-500 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <IoIosArrowDown />
        </span>
      </div>

      {/* Search Results */}
      {isOpen && (
        <div
          id="comboBoxList"
          className="bg-white shadow-lg rounded-md absolute z-50 max-h-56 w-full overflow-auto mt-1 p-2"
        >
          {/* Show loader while loading */}
          {loading === "loading" ? (
            <Contentloader />
          ) : filteredItems?.length > 0 ? (
            filteredItems?.map((item, index) => (
              <div
                key={index}
                className="flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded"
                onMouseDown={() => {
                  setQuery(item.name);
                  setSelectedItem(item.name);
                  if (onSelect) onSelect(item.name);
                  setTimeout(() => setIsOpen(false), 200);
                }}
              >
                <span className="text-sm text-gray-800">{item.name}</span>
              </div>
            ))
          ) : (
            // Show "No clients found" if no results exist after loading
            <p className="text-sm text-center p-2 text-gray-600">
              No clients found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ComboBox;
