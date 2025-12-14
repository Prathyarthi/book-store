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
            <div className="border-b bg-white dark:bg-gray-800 sticky top-0 z-40">
                <div className="container px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Add New Product</h1>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Create a new book listing
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container px-4 py-8 max-w-4xl">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card className="border-0 shadow-md">
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>Essential details about the book</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Book Title *</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            placeholder="Enter book title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="author">Author *</Label>
                                        <Input
                                            id="author"
                                            name="author"
                                            placeholder="Enter author name"
                                            value={formData.author}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price ($) *</Label>
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
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Product Image */}
                            <Card className="border-0 shadow-md">
                                <CardHeader>
                                    <CardTitle>Product Image</CardTitle>
                                    <CardDescription>Upload book cover</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ImageUpload onImageUpload={handleImageUpload} />
                                    {formData.imageUrl && (
                                        <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                                            ✓ Image uploaded successfully
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card className="border-0 shadow-md">
                                <CardContent className="p-4 space-y-3">
                                    <Button
                                        type="submit"
                                        className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Upload className="w-4 h-4 mr-2 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Create Product
                                            </>
                                        )}
                                    </Button>
                                    <Link href="/admin">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
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
