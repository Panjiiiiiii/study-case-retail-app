"use client";

import { useState, useEffect } from 'react';
import { getCart } from '@/lib/cart';
import { getAllProducts } from '@/app/action/product';

export const useCartData = () => {
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch products data
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await getAllProducts();
                if (res.success) {
                    setProducts(res.data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    // Load cart data dan combine dengan product data
    useEffect(() => {
        const loadCartData = () => {
            try {
                const cart = getCart();
                
                // Combine cart dengan product data
                const cartWithProductData = cart.map(cartItem => {
                    const product = products.find(p => p.id === cartItem.productId);
                    return {
                        ...cartItem,
                        product: product || null,
                        subtotal: product ? product.price * cartItem.quantity : 0
                    };
                }).filter(item => item.product !== null); // Filter produk yang tidak ditemukan

                setCartItems(cartWithProductData);
                setLoading(false);
            } catch (error) {
                console.error('Error loading cart data:', error);
                setCartItems([]);
                setLoading(false);
            }
        };

        if (products.length > 0) {
            loadCartData();
            
            // Listen untuk perubahan localStorage
            const handleStorageChange = (e) => {
                if (e.key === 'erp_cart') {
                    loadCartData();
                }
            };

            window.addEventListener('storage', handleStorageChange);
            
            // Custom event untuk update cart dari komponen yang sama
            const handleCartUpdate = () => loadCartData();
            window.addEventListener('cartUpdated', handleCartUpdate);

            return () => {
                window.removeEventListener('storage', handleStorageChange);
                window.removeEventListener('cartUpdated', handleCartUpdate);
            };
        }
    }, [products]);

    // Function untuk refresh cart data
    const refreshCart = () => {
        const cart = getCart();
        const cartWithProductData = cart.map(cartItem => {
            const product = products.find(p => p.id === cartItem.productId);
            return {
                ...cartItem,
                product: product || null,
                subtotal: product ? product.price * cartItem.quantity : 0
            };
        }).filter(item => item.product !== null);

        setCartItems(cartWithProductData);
    };

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    
    // Calculate total quantity
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
        cartItems,
        total,
        totalQuantity,
        loading,
        refreshCart
    };
};
