import axiosInstance from "../api";
// Helper para pegar o token (evita repetição)
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * 1. REGISTRAR ENVIO INICIAL (Admin)
 * Cria a remessa, vincula o código e a taxa.
 */
export const registerShipment = async (data: {
  order_id: number;
  tracking_code: string;
  shipping_cost: number;
  carrier: string;
}) => {
  const response = await axiosInstance.post('/shipments/register', data, {
    headers: getAuthHeader()
  });
  return response.data;
};

/**
 * 2. ADICIONAR EVENTO DE RASTREIO (Admin)
 * Adiciona um novo passo na timeline (ex: "Em trânsito", "Saiu para entrega")
 */
export const addTrackingEvent = async (data: {
  shipmentId: number;
  status: string;
  location: string;
  description: string;
}) => {
  // Destrinchamos o shipmentId para a URL e o resto para o body
  const { shipmentId, ...eventData } = data;
  const response = await axiosInstance.post(`/shipments/${shipmentId}/events`, eventData, {
    headers: getAuthHeader()
  });
  return response.data;
};

/**
 * 3. CONSULTAR RASTREIO COMPLETO (Cliente/Admin)
 * Busca os dados da remessa + array de histórico (tracking_history)
 */
export const getTrackingByOrder = async (orderId: number) => {
  const response = await axiosInstance.get(`/shipments/order/${orderId}`);
  return response.data;
};

/**
 * 4. ATUALIZAR STATUS PRINCIPAL (Admin)
 * Patch opcional para correções diretas na tabela de shipments.
 */
export const updateShipmentStatus = async (shipmentId: number, status: string) => {
  const response = await axiosInstance.patch(`/shipments/${shipmentId}`, { status }, {
    headers: getAuthHeader()
  });
  return response.data;
};
