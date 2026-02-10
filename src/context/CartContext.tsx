import React, { 
    createContext, 
    useContext, 
    useState, 
    useEffect, 
    useCallback, 
    useMemo 
} from 'react';
import toast from 'react-hot-toast';

/** * INTERFACES TÉCNICAS */
export interface CartItem {
    id: number;
    name: string;
    price: number;         
    sale_price: number;    
    discount: number;      
    image: string;
    quantity: number;
    size?: string | null;
    color?: string | null;
    variation_id: number | null; 
}

interface ProductInput {
    id: number;
    name: string;
    price: string | number;
    sale_price?: string | number;
    discount_percentage?: number;
    image_1?: string;
    image_url?: string;
}

interface VariationInput {
    id: number;
    extra_price?: string | number;
    value?: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: ProductInput, variation?: VariationInput | null) => void;
    removeFromCart: (id: number, variationId: number | null) => void;
    updateQuantity: (id: number, variationId: number | null, delta: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CART_STORAGE_KEY = '@app:cart';
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Erro ao carregar carrinho", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }, [cart]);

    /**
     * ADICIONAR AO CARRINHO
     */
    const addToCart = useCallback((product: ProductInput, variation: VariationInput | null = null) => {
        const vId = variation?.id || null;
        
        const isExisting = cart.some(item => item.id === product.id && item.variation_id === vId);

        if (isExisting) {
            toast.success(`Quantidade de ${product.name} aumentada!`);
        } else {
            toast.success(`${product.name} adicionado ao carrinho!`);
        }

        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(item =>
                item.id === product.id && item.variation_id === vId
            );

            if (existingItemIndex >= 0) {
                const newCart = [...prevCart];
                newCart[existingItemIndex] = {
                    ...newCart[existingItemIndex],
                    quantity: newCart[existingItemIndex].quantity + 1
                };
                return newCart;
            }

            const basePrice = Number(product.price);
            const salePrice = product.sale_price ? Number(product.sale_price) : basePrice;
            const extraFromVariation = variation?.extra_price ? Number(variation.extra_price) : 0;

            const newItem: CartItem = {
                id: product.id,
                name: product.name,
                price: basePrice + extraFromVariation,
                sale_price: salePrice + extraFromVariation,
                discount: product.discount_percentage || 0,
                image: product.image_1 || product.image_url || '',
                quantity: 1,
                size: variation?.value || null,
                variation_id: vId
            };

            return [...prevCart, newItem];
        });
    }, [cart]);

    const updateQuantity = useCallback((id: number, variationId: number | null, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id && item.variation_id === variationId) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    }, []);

    const removeFromCart = useCallback((id: number, variationId: number | null) => {
        setCart(prev => prev.filter(item => 
            !(item.id === id && item.variation_id === variationId)
        ));
        toast.error("Item removido");
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    const totalItems = useMemo(() => 
        cart.reduce((sum, item) => sum + item.quantity, 0), 
    [cart]);

    const totalPrice = useMemo(() => 
        cart.reduce((sum, item) => sum + (item.sale_price * item.quantity), 0), 
    [cart]);

    const contextValue = useMemo(() => ({
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
    }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart deve ser usado dentro de um CartProvider');
    return context;
};