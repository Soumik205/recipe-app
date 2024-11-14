import HttpKit from "@/common/helpers/HttpKit";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import { useUser } from "@/hooks/useUser";
import { api } from "@/libs/api";

const SingleRecipe = ({ id, setIsOpen }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipe-details", id],
    queryFn: () => HttpKit.getRecipeDetails(id),
  });

  const [user] = useUser();

  const addToCart = async () => {
    const cartItem = {
      recipeId: data.idMeal,
      name: data.strMeal,
      image: data.strMealThumb,
    };

    if (user) {
      cartItem.userId = user.id;
      try {
        await api.post("/api/cart", cartItem);
      } catch (error) {
        console.error("Failed to add item to cart", error);
      }
    } else {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const itemExists = cart.find(
        (item) => item.recipeId === cartItem.recipeId
      );

      if (!itemExists) {
        cart.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    }
    setIsOpen(false);
  };

  if (isLoading) return "Loading...";
  if (error) return "Error loading recipe.";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <button onClick={() => setIsOpen(false)}>Close</button>
      </div>
      <div>
        <Image
          src={data?.strMealThumb}
          width={500}
          height={500}
          alt="Recipe Image"
        />
      </div>
      <h2 className="text-2xl font-semibold">{data?.strMeal}</h2>
      <button
        onClick={addToCart}
        className="px-6 py-2 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none"
      >
        Add to cart
      </button>
    </div>
  );
};

export default SingleRecipe;
