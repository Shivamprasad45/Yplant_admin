"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";

import { Plant_order } from "../../../type";
import Link from "next/link";
import { useGetuserOrderQuery } from "../features/OrderSlice";

export function AnimatedListDemo({ className }: { className?: string }) {
  const { data: order, isLoading } = useGetuserOrderQuery();
  console.log(order);
  const [items, setItems] = useState<Plant_order[]>([]);

  useEffect(() => {
    if (order) {
      setItems(order);
    }
  }, [order]);

  return (
    <div
      className={cn(
        "relative flex h-[700px] w-full flex-col p-6 overflow-hidden rounded-lg border bg-background md:shadow-xl",
        className
      )}
    >
      {!isLoading && items.length > 0 ? (
        <AnimatedList>
          {items.map((item, idx) => (
            <Notification {...item} key={idx} />
          ))}
        </AnimatedList>
      ) : (
        <p>No notifications to display</p>
      )}
    </div>
  );
}

const Notification = ({
  User_name,
  Orderid,
  Addresss,
  plants,
}: Plant_order) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <Link href={`/OrderDetails/${plants[0].UserId}`}>
          <div
            className="flex size-10 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: "#fbbf24",
            }}
          >
            <span className="text-lg">{plants.length}</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
              <span className="text-sm sm:text-lg">{User_name}</span>
              <span className="mx-1">·</span>
              <span className="text-xs text-gray-500">{Orderid}</span>
            </figcaption>
            <p className="text-sm font-normal dark:text-white/60">
              {Addresss.email}
            </p>
          </div>
        </Link>
      </div>
    </figure>
  );
};
