"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Upload } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ImageUpload from "@/app/components/ImageUpload";

export default function NewProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        price: "",
        imageUrl: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageUpload = (url: string) => {
        setFormData({
            ...formData,
            imageUrl: url
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!formData.title || !formData.author || !formData.price || !formData.imageUrl) {
                toast.error("Please fill in all required fields");
                setIsLoading(false);
                return;
            }

            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.title,
                    author: formData.author,
                    price: parseFloat(formData.price),
                    imageUrl: formData.imageUrl
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create product");
            }

            toast.success("Product created successfully!");
            router.push("/admin");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create product. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
                <div className="container mx-auto max-w-7xl px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Add New Product
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Create a new book listing for your store
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-4 py-8">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader className="dark:bg-gray-800 border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        Basic Information
                                    </CardTitle>
                                    <CardDescription>Essential details about the book</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-sm font-semibold flex items-center gap-2">
                                            Book Title <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            placeholder="Enter book title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            className="h-11 font-kannada"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="author" className="text-sm font-semibold flex items-center gap-2">
                                            Author <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="author"
                                            name="author"
                                            placeholder="Enter author name"
                                            value={formData.author}
                                            onChange={handleChange}
                                            required
                                            className="h-11 font-kannada"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="price" className="text-sm font-semibold flex items-center gap-2">
                                            Price (₹) <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                            <Input
                                                id="price"
                                                name="price"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                value={formData.price}
                                                onChange={handleChange}
                                                required
                                                className="h-11 pl-8"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">Enter the selling price in Indian Rupees</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Product Image */}
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader className="dark:bg-gray-800 border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        <Upload className="w-5 h-5 text-gray-900 dark:text-white" />
                                        Product Image
                                    </CardTitle>
                                    <CardDescription>Upload book cover image</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <ImageUpload onImageUpload={handleImageUpload} />
                                    {formData.imageUrl && (
                                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                            <p className="text-xs text-green-700 dark:text-green-400 font-semibold flex items-center gap-2">
                                                ✓ Image uploaded successfully
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-6 space-y-3">
                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white shadow-lg hover:shadow-xl transition-all text-base font-semibold"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Upload className="w-5 h-5 mr-2 animate-spin" />
                                                Creating Product...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5 mr-2" />
                                                Create Product
                                            </>
                                        )}
                                    </Button>
                                    <Link href="/admin" className="block">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full h-11"
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
