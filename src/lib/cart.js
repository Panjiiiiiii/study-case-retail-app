// Utilities untuk mengelola cart di localStorage

export const CART_KEY = 'erp_cart';

// Mendapatkan cart dari localStorage
export const getCart = () => {
    if (typeof window === 'undefined') return [];
    try {
        const cart = localStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('Error getting cart:', error);
        return [];
    }
};

// Menyimpan cart ke localStorage
export const saveCart = (cart) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        // Trigger custom event untuk update cart
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
        console.error('Error saving cart:', error);
    }
};

// Menambahkan item ke cart
export const addToCart = (productId, quantity) => {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
        // Jika produk sudah ada, update quantity
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Jika produk belum ada, tambahkan baru
        cart.push({
            productId,
            quantity,
            addedAt: new Date().toISOString()
        });
    }
    
    saveCart(cart);
    return cart;
};

// Mengupdate quantity item di cart
export const updateCartItemQuantity = (productId, quantity) => {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.productId === productId);
    
    if (itemIndex >= 0) {
        if (quantity <= 0) {
            // Hapus item jika quantity 0 atau kurang
            cart.splice(itemIndex, 1);
        } else {
            cart[itemIndex].quantity = quantity;
        }
        saveCart(cart);
    }
    
    return cart;
};

// Menghapus item dari cart
export const removeFromCart = (productId) => {
    const cart = getCart();
    const filteredCart = cart.filter(item => item.productId !== productId);
    saveCart(filteredCart);
    return filteredCart;
};

// Mengosongkan cart
export const clearCart = () => {
    saveCart([]);
    return [];
};

// Mendapatkan total quantity di cart
export const getCartTotalQuantity = () => {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
};

// Mendapatkan quantity produk tertentu di cart
export const getProductQuantityInCart = (productId) => {
    const cart = getCart();
    const item = cart.find(item => item.productId === productId);
    return item ? item.quantity : 0;
};
