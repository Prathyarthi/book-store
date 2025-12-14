import { BookCard } from "./components/BookCard";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listAllProducts } from "@/lib/actions/product.actions";
import { Image, ImageKitProvider } from "@imagekit/next";
import { BookOpen, TrendingUp, Award, Users } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const products = await listAllProducts();

  return (
    <ImageKitProvider
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
    >
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full py-16 md:py-24 lg:py-32 bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container px-4 md:px-6">
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
                <div className="flex flex-col justify-center space-y-6">
                  <div className="space-y-4">
                    <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full">
                      📚 Welcome to Parimala Geleyara Balaga
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Discover Your Next Great Read
                    </h1>
                    <p className="max-w-[600px] text-gray-600 md:text-xl dark:text-gray-400 leading-relaxed">
                      Explore thousands of books across all genres. From bestsellers to hidden gems,
                      find the perfect story that speaks to you.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="#books">
                      <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Browse Collection
                      </Button>
                    </Link>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        10K+
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Books
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        5K+
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Readers
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        4.9★
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Rating
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="relative z-10">
                    <Image
                      alt="Featured Books"
                      className="mx-auto rounded-2xl shadow-2xl object-cover"
                      height="600"
                      src="public/homeImage.png"
                      width="600"
                    />
                  </div>
                  <div className="absolute -top-6 -right-6 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                  <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="w-full py-16 bg-white dark:bg-gray-900">
            <div className="container px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center space-y-3 p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="mx-auto w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold">Curated Selection</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Handpicked books from bestselling authors and emerging writers
                  </p>
                </div>
                <div className="text-center space-y-3 p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="mx-auto w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Award className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold">Best Prices</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Competitive pricing with regular discounts and special offers
                  </p>
                </div>
                <div className="text-center space-y-3 p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="mx-auto w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Users className="w-7 h-7 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold">Community</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Join thousands of readers sharing reviews and recommendations
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Books Section */}
          <section id="books" className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Featured Books
                </h2>
                <p className="max-w-[700px] text-gray-600 md:text-lg dark:text-gray-400">
                  Explore our handpicked selection of bestsellers, new releases, and timeless classics
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {products.map((product) => (
                  <BookCard
                    key={String(product._id)}
                    id={String(product._id)}
                    title={product.title}
                    author={product.author}
                    price={product.price}
                    imageUrl={product.imageUrl}
                  />
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-16">
                  <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    No books available yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500">
                    Check back soon for new arrivals!
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </ImageKitProvider>
  );
}
