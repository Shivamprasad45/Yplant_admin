"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Plant_order } from "../../../type";
import { useGetuserOrderMutation } from "../features/OrderSlice";

export default function OrderList({ className }: { className?: string }) {
  const [getOrders, { data: orders, isLoading, isError }] =
    useGetuserOrderMutation(); // Destructure mutation function
  const [items, setItems] = useState<Plant_order[]>([]);

  useEffect(() => {
    // Trigger the mutation on component mount
    getOrders();
  }, [getOrders]);

  useEffect(() => {
    if (orders) {
      setItems(orders);
    }
  }, [orders]);

  return (
    <div className={`p-6 rounded-lg border bg-background ${className}`}>
      <h2 className="text-2xl font-bold mb-4">Order List</h2>
      {isLoading ? (
        <p>Loading orders...</p>
      ) : isError ? (
        <p>Failed to load orders.</p>
      ) : items.length > 0 ? (
        <ul className="space-y-4">
          {items.map((item, idx) => (
            <OrderItem key={idx} {...item} />
          ))}
        </ul>
      ) : (
        <p>No orders to display</p>
      )}
    </div>
  );
}

const OrderItem = ({ User_name, Orderid, Addresss, plants }: Plant_order) => {
  const AllTree = plants.reduce((acc, item) => item.quantity + acc, 0);
  return (
    <li className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <Link href={`/OrderDetails/${plants[0].UserId}`} className="block">
        <div className="flex items-center space-x-4">
          <div className="bg-yellow-400 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
            {AllTree}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{User_name}</h3>
            <p className="text-sm text-gray-500">Order ID: {Orderid}</p>
            <p className="text-sm text-gray-500">{Addresss.email}</p>
          </div>
        </div>
      </Link>
    </li>
  );
};
