import { useState } from "react";

const ComboBox = ({ arr, searchQuery, onSelect }) => {
  const [query, setQuery] = useState(searchQuery || "");
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = arr.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-sm relative">
      {/* Search Input */}
      <div className="relative">
        <span className="icon-[tabler--search] text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 size-4" />
        <input
          className="input ps-8 w-full border border-gray-300 rounded-md py-2 px-3"
          type="text"
          placeholder="Search or type a command"
          role="combobox"
          aria-expanded={isOpen}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
      </div>

      {/* Search Results */}
      {isOpen && filteredItems.length > 0 && (
        <div className="bg-white shadow-lg rounded-md absolute z-50 max-h-56 w-full overflow-auto mt-1 p-2">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded"
              onClick={() => {
                onSelect(item);
                setQuery(item.name);
                setIsOpen(false);
              }}
            >
              {/* Image */}
              <div className="flex items-center justify-center rounded-full bg-gray-200 size-6 overflow-hidden me-2.5">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full"
                  />
                )}
              </div>
              {/* Text */}
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComboBox;
