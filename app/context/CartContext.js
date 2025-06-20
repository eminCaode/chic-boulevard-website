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
    const data = await getCart();
    setCart(data);
    setCartLoaded(true);
  };
  useEffect(() => {
    refreshCart();
  }, []);
  if (!cartLoaded) return null; // veya bir <Loading /> gösterebilirsin

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        refreshCart,
        openCartModal,
        closeCartModal,
        cartModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Kullanmak için hook
export const useCart = () => useContext(CartContext);
