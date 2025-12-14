"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    Plus,
    Edit,
    Trash2,
    Search,
    DollarSign,
    TrendingUp,
    BookOpen
} from "lucide-react";
import Link from "next/link";

type TabType = "overview" | "products" | "users" | "orders";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<TabType>("overview");

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="border-b bg-white dark:bg-gray-800 sticky top-0 z-40">
                <div className="container px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Admin Dashboard
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Manage your bookstore
                            </p>
                        </div>
                        <Link href="/">
                            <Button variant="outline">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Back to Store
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <Card className="border-0 shadow-md">
                            <CardContent className="p-4">
                                <nav className="space-y-2">
                                    <Button
                                        variant={activeTab === "overview" ? "default" : "ghost"}
                                        className="w-full justify-start"
                                        onClick={() => setActiveTab("overview")}
                                    >
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        Overview
                                    </Button>
                                    <Button
                                        variant={activeTab === "products" ? "default" : "ghost"}
                                        className="w-full justify-start"
                                        onClick={() => setActiveTab("products")}
                                    >
                                        <Package className="w-4 h-4 mr-2" />
                                        Products
                                    </Button>
                                    <Button
                                        variant={activeTab === "users" ? "default" : "ghost"}
                                        className="w-full justify-start"
                                        onClick={() => setActiveTab("users")}
                                    >
                                        <Users className="w-4 h-4 mr-2" />
                                        Users
                                    </Button>
                                    <Button
                                        variant={activeTab === "orders" ? "default" : "ghost"}
                                        className="w-full justify-start"
                                        onClick={() => setActiveTab("orders")}
                                    >
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Orders
                                    </Button>
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-4">
                        {activeTab === "overview" && <OverviewTab />}
                        {activeTab === "products" && <ProductsTab />}
                        {activeTab === "users" && <UsersTab />}
                        {activeTab === "orders" && <OrdersTab />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function OverviewTab() {
    const stats = [
        {
            title: "Total Revenue",
            value: "$12,345",
            change: "+12.5%",
            icon: DollarSign,
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-100 dark:bg-green-900/20"
        },
        {
            title: "Total Orders",
            value: "145",
            change: "+8.2%",
            icon: ShoppingCart,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-100 dark:bg-blue-900/20"
        },
        {
            title: "Total Products",
            value: "89",
            change: "+3",
            icon: Package,
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-100 dark:bg-purple-900/20"
        },
        {
            title: "Total Users",
            value: "1,234",
            change: "+23.1%",
            icon: Users,
            color: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-100 dark:bg-orange-900/20"
        }
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        {stat.title}
                                    </p>
                                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                                    <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center">
                                        <TrendingUp className="w-4 h-4 mr-1" />
                                        {stat.change}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity */}
            <Card className="border-0 shadow-md">
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest orders from your store</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <ShoppingCart className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Order #100{item}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">user@example.com</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">${(Math.random() * 100 + 20).toFixed(2)}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function ProductsTab() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                className="pl-10"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Link href="/admin/products/new">
                            <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Product
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Products List */}
            <Card className="border-0 shadow-md">
                <CardHeader>
                    <CardTitle>All Products</CardTitle>
                    <CardDescription>Manage your product inventory</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                    <div>
                                        <p className="font-semibold">Book Title {item}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Author Name</p>
                                        <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-1">
                                            ${(Math.random() * 50 + 10).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function UsersTab() {
    return (
        <Card className="border-0 shadow-md">
            <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage registered users</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    U{item}
                                </div>
                                <div>
                                    <p className="font-semibold">user{item}@example.com</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Joined {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                                    Active
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function OrdersTab() {
    return (
        <Card className="border-0 shadow-md">
            <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>Manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="font-semibold">Order #100{item}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">user@example.com</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">${(Math.random() * 100 + 20).toFixed(2)}</p>
                                    <span className="inline-block mt-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
                                        Processing
                                    </span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p>2 items • {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
