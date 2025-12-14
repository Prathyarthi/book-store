

"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image } from "@imagekit/next";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

type BookCardProps = {
  id?: string;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  rating?: number;
};

export function BookCard({ id, title, author, price, imageUrl, rating = 4.5 }: BookCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log("Adding to cart:", title);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Card className="group w-full max-w-sm rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-gray-800">
      <div className="relative overflow-hidden">
        <Link href={`/product/${id || "1"}`}>
          <Image
            alt={title}
            className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
            height="400"
            src={imageUrl}
            style={{
              aspectRatio: "300/400",
              objectFit: "cover",
            }}
            width="300"
          />
        </Link>
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-5 h-5 ${isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-700 dark:text-gray-300"
              }`}
          />
        </button>
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
          Bestseller
        </div>
      </div>

      <CardHeader className="p-4 space-y-2">
        <Link href={`/product/${id || "1"}`}>
          <h3 className="text-lg font-bold line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-400">{author}</p>

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.floor(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
                }`}
            />
          ))}
          <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
            {rating}
          </span>
        </div>
      </CardHeader>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${price.toFixed(2)}
          </span>
        </div>
        <Button
          onClick={handleAddToCart}
          className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

