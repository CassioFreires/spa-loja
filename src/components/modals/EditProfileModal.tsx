import { useState } from "react";
import { X, Save, Lock, Loader2 } from "lucide-react";
import { updateUser } from "../../services/Users/cadastre-se";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: any;
  onSuccess: () => void;
}

export default function EditProfileModal({ isOpen, onClose, userData, onSuccess }: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone || "",
    password: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Criamos o objeto apenas com o que foi preenchido
      const dataToSend: any = { 
        name: formData.name, 
        email: formData.email, 
        phone: formData.phone 
      };
      if (formData.password) dataToSend.password = formData.password;

      await updateUser(userData.id, dataToSend);
      onSuccess(); // Chama a atualização na página pai
      onClose(); // Fecha o modal
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <h3 className="text-lg font-black uppercase italic tracking-tighter">Editar <span className="text-yellow-500">Informações</span></h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Nome Completo</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-yellow-500 outline-none transition-all text-sm font-medium"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">E-mail</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-yellow-500 outline-none transition-all text-sm font-medium"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Telefone</label>
            <input 
              type="text" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-yellow-500 outline-none transition-all text-sm font-medium"
            />
          </div>

          <div className="space-y-1 pt-2">
            <div className="flex items-center gap-1 mb-1">
              <Lock size={12} className="text-zinc-400" />
              <label className="text-[10px] font-black uppercase text-zinc-400">Alterar Senha (opcional)</label>
            </div>
            <input 
              type="password" 
              placeholder="Deixe em branco para não alterar"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-yellow-500 outline-none transition-all text-sm font-medium"
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-zinc-200 text-black font-black uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 mt-6 transition-all shadow-lg active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}