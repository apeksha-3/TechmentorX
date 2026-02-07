"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import InvForm from "@/components/modules/inv-form";

type Product = {
  id: string;
  product_name: string;
  price: number;
  stock: number;
};

export default function InventoryPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Fetch products (RLS will auto filter by org)
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("inventory")
      .select("*");

    if (error) {
      console.error(error);
    } else {
      setProducts(data || []);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </div>

      {showForm && (
        <InvForm
          onClose={() => {
            setShowForm(false);
            fetchProducts();
          }}
        />
      )}

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-2">Product</th>
            <th className="p-2">Price</th>
            <th className="p-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.id} className="text-center border-b">
              <td className="p-2">{item.product_name}</td>
              <td className="p-2">₹{item.price}</td>
              <td className="p-2">{item.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
