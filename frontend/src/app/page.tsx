export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <main className="container mx-auto px-4 py-16">
                {/* Hero Section */}
                <section className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        Welcome to Our Platform
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        Your one-stop destination for premium products and online courses
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <a
                            href="/products"
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                        >
                            Browse Products
                        </a>
                        <a
                            href="/courses"
                            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl border-2 border-blue-600"
                        >
                            Explore Courses
                        </a>
                    </div>
                </section>

                {/* Features Section */}
                <section className="grid md:grid-cols-3 gap-8 mt-16">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">E-Commerce</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Browse and purchase premium products with secure checkout and fast delivery.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Online Courses</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Learn from expert instructors with high-quality video content and certifications.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Secure & Trusted</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Your data is protected with enterprise-grade security and encryption.
                        </p>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">10,000+</div>
                            <div className="text-gray-600 dark:text-gray-300">Products Available</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">500+</div>
                            <div className="text-gray-600 dark:text-gray-300">Online Courses</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">50,000+</div>
                            <div className="text-gray-600 dark:text-gray-300">Happy Customers</div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-gray-700 mt-16">
                <div className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
                    <p>&copy; 2025 E-Commerce + Course Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
