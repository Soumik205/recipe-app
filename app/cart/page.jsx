import React from "react";
import CartList from "@/components/Cart/CartList";

const Cart = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center">
      <div className="container mx-auto px-6 pt-32 md:px-12 lg:pt-[4.8rem] lg:px-7">
        <CartList />
      </div>
    </div>
  );
};

export default Cart;
