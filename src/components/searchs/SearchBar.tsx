import { Search } from 'lucide-react';

export default function SearchBar({ className = "" }) {
  return (
    <div className={`relative group w-full ${className}`}>
      <input
        type="text"
        placeholder="Qual produto deseja?"
        className="w-full bg-white rounded-full py-2.5 md:py-3 px-6 pr-14 
                   text-gray-800 placeholder:text-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-yellow-500/50
                   transition-all duration-300 shadow-sm hover:shadow-md"
      />
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 
                      bg-black text-white p-2 md:p-2.5 rounded-full 
                      hover:bg-yellow-600 cursor-pointer 
                      transition-all duration-300 group-focus-within:bg-yellow-600">
        <Search className="w-4 h-4 md:w-5 md:h-5" />
      </div>
    </div>
  );
}