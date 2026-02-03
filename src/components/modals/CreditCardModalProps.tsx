import React, { useState } from 'react';
import { X, Plus, CreditCard, ShieldCheck, Lock, Save, Trash2 } from 'lucide-react';

interface Card {
    id: string;
    brand: string;
    lastFour: string;
    expiry: string;
}

interface CreditCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectCard: (card: Card) => void;
}

export default function CreditCardModal({ isOpen, onClose, onSelectCard }: CreditCardModalProps) {
    const [showNewCardForm, setShowNewCardForm] = useState(false);
    const [savedCards, setSavedCards] = useState<Card[]>([
        { id: '1', brand: 'Mastercard', lastFour: '4482', expiry: '08/29' },
        { id: '2', brand: 'Visa', lastFour: '1029', expiry: '12/27' },
    ]);

    // Estados do Formulário
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    // FORMATADOR: Número do Cartão (0000 0000 0000 0000)
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
        value = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Adiciona espaço a cada 4 dígitos
        setCardNumber(value.slice(0, 19)); // Limita a 16 números + 3 espaços
    };

    // FORMATADOR: Validade (MM/AA)
    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d)/, '$1/$2');
        }
        setExpiry(value.slice(0, 5));
    };

    // FORMATADOR: CVV (000 ou 0000)
    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setCvv(value.slice(0, 4));
    };

    // FORMATADOR: Nome (Apenas letras)
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Remove números e símbolos
        setCardName(value.toUpperCase());
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-zinc-200 overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Header Premium */}
                <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase italic tracking-tight text-zinc-900">Meus <span className="text-yellow-600">Cartões</span></h2>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">Pagamento 100% Seguro</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-zinc-200 rounded-2xl transition-colors text-zinc-400 hover:text-zinc-900">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {!showNewCardForm ? (
                        <>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                {savedCards.map((card) => (
                                    <div key={card.id} className="group relative">
                                        <button
                                            onClick={() => onSelectCard(card)}
                                            className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-zinc-100 hover:border-yellow-500 hover:bg-yellow-50/30 transition-all text-left"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-8 bg-zinc-100 rounded-md flex items-center justify-center text-[10px] font-black uppercase text-zinc-400 group-hover:text-zinc-900 transition-colors">
                                                    {card.brand}
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm text-zinc-900 uppercase italic">•••• {card.lastFour}</p>
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase italic tracking-widest">Validade {card.expiry}</p>
                                                </div>
                                            </div>
                                            <div className="w-6 h-6 rounded-full border-2 border-zinc-200 group-hover:border-yellow-500 flex items-center justify-center">
                                                <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => setShowNewCardForm(true)}
                                className="w-full flex items-center justify-center gap-2 p-5 rounded-2xl border-2 border-dashed border-zinc-200 text-zinc-400 font-black uppercase italic text-xs hover:border-zinc-900 hover:text-zinc-900 transition-all"
                            >
                                <Plus size={16} /> Adicionar Novo Cartão
                            </button>
                        </>
                    ) : (
                        <form className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 italic tracking-widest">Número do Cartão</label>
                                <input 
                                    type="text"
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    placeholder="0000 0000 0000 0000" 
                                    className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-xl font-bold focus:ring-2 ring-yellow-500/20 outline-none text-zinc-900" 
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 italic tracking-widest">Nome no Cartão</label>
                                <input 
                                    type="text"
                                    value={cardName}
                                    onChange={handleNameChange}
                                    placeholder="COMO ESTÁ ESCRITO NO CARTÃO" 
                                    className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-xl font-bold uppercase outline-none text-zinc-900" 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 italic tracking-widest">Validade</label>
                                    <input 
                                        type="text"
                                        value={expiry}
                                        onChange={handleExpiryChange}
                                        placeholder="MM/AA" 
                                        className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-xl font-bold outline-none text-center text-zinc-900" 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 italic tracking-widest">CVV</label>
                                    <input 
                                        type="text"
                                        value={cvv}
                                        onChange={handleCvvChange}
                                        placeholder="000" 
                                        className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-xl font-bold outline-none text-center text-zinc-900" 
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowNewCardForm(false)} className="flex-1 py-4 rounded-xl font-black uppercase italic text-xs border-2 border-zinc-100 hover:bg-zinc-50 transition-all text-zinc-600">Cancelar</button>
                                <button type="submit" className="flex-[2] bg-zinc-900 text-white px-8 py-4 rounded-xl font-black uppercase italic text-xs hover:bg-yellow-600 transition-all flex items-center justify-center gap-2">
                                    <Save size={16} /> Salvar Cartão
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-zinc-400 uppercase italic">
                        <ShieldCheck size={14} className="text-green-500" /> PCI Compliance
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-zinc-400 uppercase italic">
                        <Lock size={14} className="text-zinc-400" /> SSL 256-bit
                    </div>
                </div>
            </div>
        </div>
    );
}