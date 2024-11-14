import { NextResponse } from "next/server";
import clientPromise from "@/libs/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("recipe");
    const cart = db.collection("cart");

    const cartItems = await cart.find({ userId }).toArray();

    return NextResponse.json({ items: cartItems || [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { userId, recipeId, image, name } = await request.json();

    if (!userId || !recipeId || !image || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("recipe");
    const cart = db.collection("cart");

    const existingItem = await cart.findOne({ userId, recipeId });

    if (existingItem) {
      return NextResponse.json(
        { error: "Item already in cart" },
        { status: 200 }
      );
    }

    const result = await cart.insertOne({
      userId,
      recipeId,
      image,
      name,
      addedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Item added to cart",
        itemId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get("recipeId");
    const userId = searchParams.get("userId");

    if (!recipeId || !userId) {
      return NextResponse.json(
        { error: "Recipe ID and User ID are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("recipe");
    const cart = db.collection("cart");

    const result = await cart.deleteOne({
      recipeId: recipeId,
      userId: userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Item removed from cart" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
