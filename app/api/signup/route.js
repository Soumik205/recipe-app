import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/libs/db";

export async function POST(request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("recipe");
    const users = db.collection("users");

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const salt = crypto.randomBytes(16).toString("hex");

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password + salt)
      .digest("hex");

    const result = await users.insertOne({
      name,
      email,
      phone,
      password: hashedPassword,
      salt,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
