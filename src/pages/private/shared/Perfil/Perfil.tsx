import { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, Edit3, Shield, Loader2 } from "lucide-react";
import EditProfileModal from "../../../../components/modals/EditProfileModal";
import { getMe } from "../../../../services/Users/cadastre-se";

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const data = await getMe();
      setUser(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
      </div>
    );
  }

  if (!user) return <p>Usuário não encontrado.</p>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900 uppercase italic tracking-tighter">
          Meu <span className="text-yellow-500">Perfil</span>
        </h1>
        <p className="text-zinc-500 text-sm">Gerencie suas informações pessoais e segurança.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 overflow-hidden">
        <div className="h-32 bg-zinc-950 relative">
          <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-2xl shadow-lg">
            <div className="w-24 h-24 bg-yellow-500 rounded-xl flex items-center justify-center text-black">
              <User size={48} strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="pt-16 p-8">
          <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">{user.name}</h2>
              <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase mt-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Conta Ativa
              </span>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-yellow-500 hover:text-black transition-all shadow-lg active:scale-95"
            >
              <Edit3 size={18} />
              Editar Dados
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem icon={<Mail size={18}/>} label="E-mail" value={user.email} />
            <InfoItem icon={<Phone size={18}/>} label="Telefone" value={user.phone || "Não informado"} />
            <InfoItem icon={<Shield size={18}/>} label="Nível de Acesso" value={Number(user.role_id) === 1 ? "Admin" : "Cliente"} />
            <InfoItem icon={<Calendar size={18}/>} label="Membro desde" value={formatDate(user.created_at)} />
          </div>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userData={user}
        onSuccess={loadUserData} // Recarrega os dados após editar
      />
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-50 bg-zinc-50/50">
      <div className="text-yellow-600">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{label}</p>
        <p className="text-sm font-bold text-zinc-700">{value}</p>
      </div>
    </div>
  );
}