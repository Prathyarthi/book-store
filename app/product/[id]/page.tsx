"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star, Minus, Plus, BookOpen, Package, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { createOrder } from "@/lib/actions/order.actions";

export default function ProductDetail() {
    const params = useParams();
    const productId = params.id as string;

    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${productId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch product");
                }
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to load product details");
            } finally {
                setIsLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const incrementQuantity = () => setQuantity(q => q + 1);
    const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

    const handleBuyNow = async () => {
        setIsPlacingOrder(true);
        try {
            await createOrder(product._id, quantity);
            toast.success(`Order placed successfully for ${quantity} ${quantity > 1 ? 'items' : 'item'}!`);
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error(error instanceof Error ? error.message : "Failed to place order. Please try again.");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading product...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-xl text-gray-600 dark:text-gray-400">Product not found</p>
                        <Link href="/">
                            <Button className="mt-4">Back to Home</Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

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

                            {/* Price */}
                            <div className="py-4 border-y border-gray-200 dark:border-gray-700">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                        &#8377;{product.price.toFixed(2)}
                                    </span>
                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                        In Stock
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
                                    onClick={handleBuyNow}
                                    disabled={isPlacingOrder}
                                >
                                    {isPlacingOrder ? (
                                        <>
                                            <ShoppingCart className="w-5 h-5 mr-2 animate-pulse" />
                                            Placing Order...
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-5 h-5 mr-2" />
                                            Buy Now
                                        </>
                                    )}
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
