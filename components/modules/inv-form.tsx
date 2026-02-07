"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function InvForm({ onClose }: { onClose: () => void }) {
  const supabase = createClient();

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1️⃣ Get logged in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // 2️⃣ Get org_id from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("org_id")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.error(profileError);
      return;
    }

    // 3️⃣ Insert product with org_id
    const { error } = await supabase.from("inventory").insert([
      {
        product_name: productName,
        price: Number(price),
        stock: Number(stock),
        org_id: profile.org_id,
      },
    ]);

    if (error) {
      console.error(error);
    } else {
      onClose(); // close form and refresh list
    }
  };

  return (
    <div className="border p-4 mb-6 rounded">
      <h2 className="text-xl font-semibold mb-4">Add Product</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded"
          >
            Save
          </button>

          <button
            type="button"
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
