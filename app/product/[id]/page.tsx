"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star, Minus, Plus, BookOpen, Package, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";

export default function ProductDetail() {
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Mock product data - replace with actual data from API
    const product = {
        id: "1",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 24.99,
        rating: 4.8,
        reviews: 2547,
        imageUrl: "/file.svg",
        inStock: true
    };

    const incrementQuantity = () => setQuantity(q => q + 1);
    const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 bg-gray-50 dark:bg-gray-900">
                <div className="container px-4 py-8">
                    {/* Breadcrumb */}
                    <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
                        {" / "}
                        <span className="text-gray-900 dark:text-white">{product.title}</span>
                    </div>

                    {/* Product Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <Card className="border-0 shadow-xl overflow-hidden">
                                <div className="relative aspect-3/4 bg-gray-100 dark:bg-gray-800">
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </Card>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    {product.title}
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-400">
                                    by {product.author}
                                </p>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(product.rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300 dark:text-gray-600"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-600 dark:text-gray-400">
                                    {product.rating} ({product.reviews} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="py-4 border-y border-gray-200 dark:border-gray-700">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <span className={`text-sm font-semibold ${product.inStock
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                        }`}>
                                        {product.inStock ? "In Stock" : "Out of Stock"}
                                    </span>
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium">Quantity:</span>
                                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={decrementQuantity}
                                        className="h-10 w-10"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="w-12 text-center font-semibold">{quantity}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={incrementQuantity}
                                        className="h-10 w-10"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <Button
                                    className="flex-1 h-12 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                                    disabled={!product.inStock}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Add to Cart
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-12 w-12"
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                >
                                    <Heart
                                        className={`w-6 h-6 ${isWishlisted
                                            ? "fill-red-500 text-red-500"
                                            : ""
                                            }`}
                                    />
                                </Button>
                            </div>

                            {/* Product Details */}
                            <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
                                <CardContent className="p-6 space-y-3">
                                    <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="text-gray-600 dark:text-gray-400">Author:</div>
                                        <div className="font-medium">{product.author}</div>

                                        <div className="text-gray-600 dark:text-gray-400">Price:</div>
                                        <div className="font-medium">${product.price.toFixed(2)}</div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Features */}
                            <div className="grid grid-cols-3 gap-4">
                                <Card className="border-0 shadow-md">
                                    <CardContent className="p-4 text-center">
                                        <Package className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                                        <p className="text-xs font-medium">Free Shipping</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-0 shadow-md">
                                    <CardContent className="p-4 text-center">
                                        <Shield className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
                                        <p className="text-xs font-medium">Secure Payment</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-0 shadow-md">
                                    <CardContent className="p-4 text-center">
                                        <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                                        <p className="text-xs font-medium">Quality Assured</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
