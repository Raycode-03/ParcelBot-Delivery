'use client'
import { useState } from "react";
import { Box, TruckIcon, FileText, Utensils } from "lucide-react";

export default function DeliveryTypeDropdown() {
  const [selected, setSelected] = useState("Select delivery type");
  const [open, setOpen] = useState(false);

  const options = [
    { label: "Bulky Goods", icon: <TruckIcon className="w-5 h-5" /> },
    { label: "Small Parcel", icon: <Box className="w-5 h-5" /> },
    { label: "Documents", icon: <FileText className="w-5 h-5" /> },
    { label: "Food", icon: <Utensils className="w-5 h-5" /> },
  ];

  return (
    <div className="relative w-full text-black">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <span>{selected}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-56 overflow-y-auto">
          {options.map((opt) => (
            <li
              key={opt.label}
              onClick={() => {
                setSelected(opt.label);
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2 hover:bg-green-100 cursor-pointer"
            >
              {opt.icon}
              <span>{opt.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
