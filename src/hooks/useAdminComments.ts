import { useState, useEffect, useCallback } from 'react';
import { 
  getApprovedComments, 
  getPendingComments, 
  approveOrRejectComment, 
  deleteComment 
} from '../services/Comments/comments';
import toast from 'react-hot-toast';

export function useAdminComments(status: 'pending' | 'approved', page: number = 1) {
  const [comments, setComments] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = status === 'pending' 
        ? await getPendingComments(page, 10) 
        : await getApprovedComments(page, 10);
      
      setComments(response.data || []);
      setPagination(response.pagination || null);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar comentários.");
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (id: number, approved: boolean) => {
    try {
      await approveOrRejectComment(id, approved);
      toast.success(approved ? "Comentário aprovado!" : "Movido para pendentes");
      await loadData();
    } catch (error) {
      toast.error("Erro ao processar moderação.");
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await deleteComment(id);
      toast.success("Comentário excluído definitivamente.");
      await loadData();
    } catch (error) {
      toast.error("Erro ao remover comentário.");
    }
  };

  return { comments, pagination, loading, handleApprove, handleRemove };
}