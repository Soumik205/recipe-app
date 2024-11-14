import AllRecipesList from "@/components/Recipes/AllRecipesList";
import React from "react";

const AllRecipes = () => {
  return (
    <div className="bg-gray-50 flex items-center">
      <div className="container mx-auto px-6 pt-32 md:px-12 lg:pt-[4.8rem] lg:px-7">
        {/* <h1 className="text-4xl">This is the all recipes page</h1> */}
        <AllRecipesList />
      </div>
    </div>
  );
};

export default AllRecipes;
