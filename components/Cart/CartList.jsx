"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { api } from "@/libs/api";

const CartList = () => {
  const [user] = useUser();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCartData = async () => {
      setIsLoading(true);
      try {
        let cartItems;
        if (user) {
          const response = await api.get(`/api/cart`, {
            params: { userId: user.id },
          });
          cartItems = response.data;
          setProducts(cartItems.items);
        } else {
          cartItems = JSON.parse(localStorage.getItem("cart")) || [];
          setProducts(cartItems);
        }
      } catch (error) {
        console.error("Failed to load cart items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, [user]);

  const removeItemFromCart = async (id) => {
    if (user) {
      try {
        await api.delete(`/api/cart`, {
          params: {
            recipeId: id,
            userId: user.id,
          },
        });

        setProducts((prevProducts) =>
          prevProducts.filter((item) => item.recipeId !== id)
        );
      } catch (error) {
        console.error("Failed to remove item:", error);
      }
    } else {
      const updatedCart = products.filter((item) => item.recipeId !== id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setProducts(updatedCart);
    }
  };

  if (isLoading) return <p>Loading cart items...</p>;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        <section aria-labelledby="cart-heading" className="mt-12">
          <h2 id="cart-heading" className="sr-only">
            Items in your shopping cart
          </h2>

          <ul
            role="list"
            className="divide-y divide-gray-200 border-b border-t border-gray-200"
          >
            {products &&
              products.map((product) => (
                <li key={product.recipeId} className="flex py-6">
                  <div className="shrink-0">
                    <Image
                      width={500}
                      height={500}
                      alt={`${product.name} Image`}
                      src={product.image}
                      className="size-24 rounded-md object-cover object-center sm:size-32"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                    <div>
                      <div className="flex justify-between">
                        <h4 className="text-sm">{product.name}</h4>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-1 items-end justify-between">
                      <button
                        type="button"
                        onClick={() => removeItemFromCart(product.recipeId)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default CartList;
