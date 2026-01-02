"use client";

import { useState, useEffect } from "react";
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
import { listAllProducts, deleteProduct } from "@/lib/actions/product.actions";
import { getAllUsers } from "@/lib/actions/user.actions";
import { getAllOrders } from "@/lib/actions/order.actions";
import { toast } from "sonner";
import Image from "next/image";

type TabType = "overview" | "products" | "users" | "orders";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<TabType>("overview");
    const [products, setProducts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [productsData, usersData, ordersData] = await Promise.all([
                    listAllProducts(),
                    getAllUsers(),
                    getAllOrders()
                ]);
                setProducts(productsData);
                setUsers(usersData);
                setOrders(ordersData);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="border-b bg-white dark:bg-gray-800 sticky top-0 z-40">
                <div className="container mx-auto max-w-7xl px-4 py-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
                                Manage your bookstore
                            </p>
                        </div>
                        <Link href="/">
                            <Button variant="outline" size="sm" className="md:h-10">
                                <BookOpen className="w-4 h-4 md:mr-2" />
                                <span className="hidden md:inline">Back to Store</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-4 md:py-8">
                <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 md:gap-6">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <Card className="border-0 shadow-md">
                            <CardContent className="p-2 md:p-4">
                                <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                                    <Button
                                        variant={activeTab === "overview" ? "default" : "ghost"}
                                        className="flex-shrink-0 lg:w-full justify-start whitespace-nowrap"
                                        onClick={() => setActiveTab("overview")}
                                    >
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        Overview
                                    </Button>
                                    <Button
                                        variant={activeTab === "products" ? "default" : "ghost"}
                                        className="flex-shrink-0 lg:w-full justify-start whitespace-nowrap"
                                        onClick={() => setActiveTab("products")}
                                    >
                                        <Package className="w-4 h-4 mr-2" />
                                        Products
                                    </Button>
                                    <Button
                                        variant={activeTab === "users" ? "default" : "ghost"}
                                        className="flex-shrink-0 lg:w-full justify-start whitespace-nowrap"
                                        onClick={() => setActiveTab("users")}
                                    >
                                        <Users className="w-4 h-4 mr-2" />
                                        Users
                                    </Button>
                                    <Button
                                        variant={activeTab === "orders" ? "default" : "ghost"}
                                        className="flex-shrink-0 lg:w-full justify-start whitespace-nowrap"
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
                        {activeTab === "overview" && <OverviewTab orders={orders} products={products} users={users} isLoading={isLoading} />}
                        {activeTab === "products" && <ProductsTab products={products} setProducts={setProducts} isLoading={isLoading} />}
                        {activeTab === "users" && <UsersTab users={users} isLoading={isLoading} />}
                        {activeTab === "orders" && <OrdersTab orders={orders} isLoading={isLoading} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function OverviewTab({ orders, products, users, isLoading }: { orders: any[], products: any[], users: any[], isLoading: boolean }) {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.amount / 100), 0);
    const recentOrders = orders.slice(0, 5);

    const stats = [
        {
            title: "Total Revenue",
            value: `₹${totalRevenue.toFixed(2)}`,
            change: orders.length > 0 ? `${orders.length} orders` : "No orders",
            icon: DollarSign,
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-100 dark:bg-green-900/20"
        },
        {
            title: "Total Orders",
            value: orders.length.toString(),
            change: orders.filter(o => o.status === 'pending').length + " pending",
            icon: ShoppingCart,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-100 dark:bg-blue-900/20"
        },
        {
            title: "Total Products",
            value: products.length.toString(),
            change: products.length > 0 ? "In stock" : "No products",
            icon: Package,
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-100 dark:bg-purple-900/20"
        },
        {
            title: "Total Users",
            value: users.length.toString(),
            change: users.filter(u => u.role === 'user').length + " customers",
            icon: Users,
            color: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-100 dark:bg-orange-900/20"
        }
    ];

    if (isLoading) {
        return <div className="text-center py-12">Loading dashboard data...</div>;
    }

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        {stat.title}
                                    </p>
                                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center">
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
                    {recentOrders.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No orders yet</p>
                    ) : (
                        <div className="space-y-3 md:space-y-4">
                            {recentOrders.map((order: any) => (
                                <div key={order._id} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg gap-3">
                                    <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-white dark:text-black" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-sm md:text-base truncate">{order.productId?.title || "Unknown Product"}</p>
                                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">{order.userId?.email || "Unknown User"}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-semibold text-sm md:text-base">₹{(order.amount / 100).toFixed(2)}</p>
                                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function ProductsTab({ products, setProducts, isLoading }: { products: any[], setProducts: (products: any[]) => void, isLoading: boolean }) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (productId: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await deleteProduct(productId);
            setProducts(products.filter(p => p._id !== productId));
            toast.success("Product deleted successfully");
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        }
    };

    if (isLoading) {
        return <div className="text-center py-12">Loading products...</div>;
    }

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
                            <Button className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white">
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
                    <CardDescription>Manage your product inventory ({filteredProducts.length} products)</CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredProducts.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            {searchQuery ? "No products found matching your search" : "No products yet. Add your first product!"}
                        </p>
                    ) : (
                        <div className="space-y-3 md:space-y-4">
                            {filteredProducts.map((product: any) => (
                                <div key={product._id} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg gap-3">
                                    <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                                        <div className="w-12 h-16 md:w-16 md:h-20 bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden flex-shrink-0">
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-sm md:text-base truncate">{product.title}</p>
                                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">{product.author}</p>
                                            <p className="text-xs md:text-sm font-semibold text-green-600 dark:text-green-400 mt-1">
                                                ₹{product.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDelete(product._id)}
                                            className="text-red-600 hover:text-red-700 h-9 w-9 md:h-10 md:w-10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function UsersTab({ users, isLoading }: { users: any[], isLoading: boolean }) {
    if (isLoading) {
        return <div className="text-center py-12">Loading users...</div>;
    }

    return (
        <Card className="border-0 shadow-md">
            <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage registered users ({users.length} users)</CardDescription>
            </CardHeader>
            <CardContent>
                {users.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No users registered yet</p>
                ) : (
                    <div className="space-y-3 md:space-y-4">
                        {users.map((user: any) => (
                            <div key={user._id} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg gap-3">
                                <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-semibold flex-shrink-0">
                                        {user.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-sm md:text-base truncate">{user.email}</p>
                                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                            Joined {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className={`px-2 md:px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${user.role === 'admin'
                                        ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                                        : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                        }`}>
                                        {user.role === 'admin' ? 'Admin' : 'Customer'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function OrdersTab({ orders, isLoading }: { orders: any[], isLoading: boolean }) {
    if (isLoading) {
        return <div className="text-center py-12">Loading orders...</div>;
    }

    return (
        <Card className="border-0 shadow-md">
            <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>Manage customer orders ({orders.length} orders)</CardDescription>
            </CardHeader>
            <CardContent>
                {orders.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No orders yet</p>
                ) : (
                    <div className="space-y-3 md:space-y-4">
                        {orders.map((order: any) => (
                            <div key={order._id} className="p-3 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-start justify-between gap-3 mb-2 md:mb-3">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-sm md:text-base">{order.productId?.title || "Unknown Product"} (x{order.quantity})</p>
                                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">{order.userId?.email || "Unknown User"}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-semibold text-sm md:text-base">₹{(order.amount / 100).toFixed(2)}</p>
                                        <span className={`inline-block mt-1 px-2 md:px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${order.status === 'completed'
                                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                            : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                    <p>{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
