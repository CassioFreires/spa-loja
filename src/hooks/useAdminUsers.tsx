import { useState, useEffect, useCallback } from 'react';
import { getUsers, getRoles, updateUser } from '../services/Users/users';
import type { User } from '../services/Users/users'; // Importação crucial do tipo
import toast from 'react-hot-toast';

export function useAdminUsers(page: number = 1, search: string = '') {
  // Tipamos explicitamente o estado para evitar o erro 'Property active does not exist'
  const [users, setUsers] = useState<User[]>([]); 
  const [roles, setRoles] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        getUsers(page, search),
        getRoles()
      ]);

      // O backend retorna os dados paginados dentro da propriedade .data
      setUsers(usersRes.data || []);
      setPagination(usersRes.pagination || null);
      setRoles(rolesRes || []);
    } catch (error: any) {
      console.error('Erro useAdminUsers:', error);
      toast.error("Erro ao carregar lista de membros.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const changeUserRole = async (userId: number, roleId: number) => {
    try {
      await updateUser(userId, { role_id: roleId });
      toast.success("Nível de acesso atualizado!");
      await loadData();
      return true;
    } catch (error) {
      toast.error("Erro ao alterar cargo.");
      return false;
    }
  };

  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await updateUser(userId, { active: !currentStatus });
      toast.success(currentStatus ? "Membro desativado!" : "Membro reativado!");
      await loadData();
      return true;
    } catch (error) {
      toast.error("Erro ao alterar status.");
      return false;
    }
  };

  return { users, roles, pagination, loading, changeUserRole, toggleUserStatus };
}