"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getCart } from "../_lib/action";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartModal, setCartModal] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);

  const openCartModal = () => {
    setCartModal(true);
  };

  const closeCartModal = () => {
    setCartModal(false);
  };

  const refreshCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
      setCartLoaded(true);
    } catch (error) {
      setCart([]);
      setCartLoaded(true);
    }
  };

  // Sepeti tamamen temizle (webhook için)
  const clearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    refreshCart();
  }, []);

  // Modal açıldığında cart'ı yenile
  useEffect(() => {
    if (cartModal) {
      refreshCart();
    }
  }, [cartModal]);

  if (!cartLoaded) return null;

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        refreshCart,
        clearCart,
        openCartModal,
        closeCartModal,
        cartModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
