'use client';
import { useState  ,useRef , useEffect} from "react";
import { Box, TruckIcon, FileText, Utensils } from "lucide-react";

export default function DeliveryTypeDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const options = [
    { label: "Bulky Goods", icon: <TruckIcon className="w-5 h-5" /> },
    { label: "Small Parcel", icon: <Box className="w-5 h-5" /> },
    { label: "Documents", icon: <FileText className="w-5 h-5" /> },
    { label: "Food", icon: <Utensils className="w-5 h-5" /> },
  ];
 // ✅ Close menu when clicking outside
    useEffect(() => {
       const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  return (
    <div className="relative w-full text-black" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <span>{value || "Select delivery type"}</span>
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
                onChange(opt.label); // <-- Send selected value to parent
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
