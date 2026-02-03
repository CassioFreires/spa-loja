import { useEffect, useMemo, useState } from 'react';

interface Option {
    value: string;
    label: string;
}

interface SelectSearchProps {
    label: string;
    options: Option[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean; 
}

export function SelectSearch({
    label,
    options = [],
    value,
    onChange,
    placeholder = 'Selecione...',
    disabled = false
}: SelectSearchProps) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);

    const selectedOption = useMemo(
        () => options.find(opt => opt.value === value),
        [options, value]
    );

    const filteredOptions = useMemo(() => {
        return options.filter(opt => {
            if (!opt?.label) return false;
            return opt.label.toLowerCase().includes(search.toLowerCase());
        });
    }, [options, search]);

    useEffect(() => {
        if (!open) setSearch('');
    }, [open]);

    return (
        <div className={`relative w-full ${disabled ? 'opacity-50' : ''}`}>
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 italic">
                {label}
            </label>

            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen(!open)}
                className={`w-full bg-zinc-50 border p-4 rounded-2xl font-bold italic text-left ${disabled ? 'cursor-not-allowed' : ''}`}
            >
                {selectedOption?.label || placeholder}
            </button>

            {open && !disabled && (
                <div className="absolute z-50 mt-2 w-full bg-white border rounded-2xl shadow-xl max-h-64 overflow-hidden text-zinc-900">
                    <input
                        autoFocus
                        type="text"
                        placeholder="Buscar..."
                        className="w-full border-b p-3 text-sm outline-none"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />

                    <ul className="max-h-48 overflow-y-auto">
                        {filteredOptions.length === 0 && (
                            <li className="p-3 text-sm text-zinc-400">Nenhum resultado</li>
                        )}

                        {filteredOptions.map(opt => (
                            <li
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                                className={`p-3 cursor-pointer hover:bg-zinc-100 text-sm ${
                                    opt.value === value ? 'bg-zinc-100 font-bold' : ''
                                }`}
                            >
                                {opt.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}