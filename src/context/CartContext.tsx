import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface CartItem {
    id: string | number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
    color?: string;
    // Adicionado para suportar o banco de dados
    variation_id?: number | null; 
}

interface CartContextType {
    cart: CartItem[];
    // Atualizado para aceitar variationId
    addToCart: (product: any, selectedSize?: string, selectedColor?: string, variationId?: number) => void;
    removeFromCart: (id: string | number) => void;
    updateQuantity: (id: string | number, delta: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    orders: any[];
    completeOrder: (paymentData: any) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    // Estado do Carrinho
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('@app:cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Estado dos Pedidos Finalizados
    const [orders, setOrders] = useState<any[]>(() => {
        const savedOrders = localStorage.getItem('@app:orders');
        return savedOrders ? JSON.parse(savedOrders) : [];
    });

    // Sincroniza Carrinho com LocalStorage
    useEffect(() => {
        localStorage.setItem('@app:cart', JSON.stringify(cart));
    }, [cart]);

    // Sincroniza Pedidos com LocalStorage
    useEffect(() => {
        localStorage.setItem('@app:orders', JSON.stringify(orders));
    }, [orders]);

    const addToCart = (product: any, selectedSize?: string, selectedColor?: string, variationId?: number) => {
        setCart(prevCart => {
            // A lógica de "item existente" agora considera o ID do produto E a variação
            const existingItem = prevCart.find(item =>
                item.id === product.id && item.variation_id === variationId
            );

            if (existingItem) {
                return prevCart.map(item =>
                    (item.id === product.id && item.variation_id === variationId)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            console.log(product)
            return [...prevCart, {
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.image_url || product.image_1,
                quantity: 1,
                size: selectedSize,
                color: selectedColor,
                variation_id: variationId || null // Armazena o ID vindo do banco
            }];
        });

        toast.success("🔥 Adicionado ao carrinho!");
    };

    const updateQuantity = (id: string | number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id: string | number) => {
        setCart(prev => prev.filter(item => item.id !== id));
        toast.error("Item removido");
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('@app:cart');
    };

    const completeOrder = (paymentData: any) => {
        if (cart.length === 0) return;

        const newOrder = {
            id: `ORD-${Math.floor(Math.random() * 90000) + 10000}`,
            date: new Date().toLocaleDateString('pt-BR'),
            status: 'aprovado',
            statusLabel: 'Pagamento Confirmado',
            total: paymentData.total,
            items: [...cart], 
            mainImage: cart[0].image,
            itemsCount: cart.reduce((sum, item) => sum + item.quantity, 0),
            paymentMethod: paymentData.method,
            estimate: "Entrega em até 7 dias úteis"
        };

        setOrders(prev => [newOrder, ...prev]);
        clearCart();
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider 
            value={{ 
                cart, 
                addToCart, 
                removeFromCart, 
                updateQuantity, 
                clearCart, 
                totalItems, 
                totalPrice,
                orders,
                completeOrder
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart deve ser usado dentro de um CartProvider');
    }
    return context;
};