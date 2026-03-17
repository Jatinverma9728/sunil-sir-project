export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="bg-gradient-to-b from-gray-900 to-gray-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
                        <svg className="w-5 h-5 text-[#C1FF72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <span className="text-sm font-medium text-white">Cookie Settings</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        Cookie Policy
                    </h1>
                    <p className="text-xl text-gray-300">
                        Last updated: December 31, 2025
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Introduction */}
                <div className="bg-gray-50 rounded-3xl p-10 mb-16 border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        Cookies are small text files stored on your device when you visit our website. They help us provide a better experience by remembering your preferences, keeping you signed in, and understanding how you use our site.
                    </p>
                </div>

                {/* Cookie Types */}
                <div className="mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Types of Cookies We Use</h2>

                    <div className="space-y-6">
                        <CookieType
                            icon="🔐"
                            title="Essential Cookies"
                            color="gray"
                            description="Required for the website to function properly. These enable core features like security, network management, and accessibility."
                            examples="Session cookies, authentication tokens, security features"
                        />

                        <CookieType
                            icon="⚙️"
                            title="Functional Cookies"
                            color="gray"
                            description="Remember your choices and preferences to provide enhanced, personalized features."
                            examples="Language preferences, 'Remember me' settings, shopping cart"
                        />

                        <CookieType
                            icon="📊"
                            title="Analytics Cookies"
                            color="gray"
                            description="Help us understand how visitors interact with our website by collecting anonymous usage data."
                            examples="Google Analytics, page views, session duration"
                        />

                        <CookieType
                            icon="📢"
                            title="Marketing Cookies"
                            color="gray"
                            description="Track activity across websites to deliver relevant advertisements and measure campaign effectiveness."
                            examples="Facebook Pixel, ad retargeting, campaign tracking"
                        />
                    </div>
                </div>

                {/* Managing Cookies */}
                <div className="mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Manage Your Cookie Preferences</h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                        <ManageCard
                            icon="🚫"
                            title="Block Cookies"
                            description="Prevent websites from setting cookies on your device"
                        />
                        <ManageCard
                            icon="🗑️"
                            title="Delete Cookies"
                            description="Remove existing cookies from your browser"
                        />
                        <ManageCard
                            icon="⚠️"
                            title="Cookie Warnings"
                            description="Get notified before cookies are set"
                        />
                        <ManageCard
                            icon="⚙️"
                            title="Customize Settings"
                            description="Choose which cookie types to allow"
                        />
                    </div>
                </div>

                {/* Browser Instructions */}
                <div className="bg-white rounded-3xl p-10 border-2 border-gray-100 mb-16">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Browser-Specific Instructions</h3>
                    <div className="space-y-3">
                        <BrowserGuide
                            browser="Google Chrome"
                            path="Settings → Privacy and security → Cookies and site data"
                        />
                        <BrowserGuide
                            browser="Mozilla Firefox"
                            path="Settings → Privacy & Security → Cookies and Site Data"
                        />
                        <BrowserGuide
                            browser="Safari"
                            path="Preferences → Privacy → Cookies and website data"
                        />
                        <BrowserGuide
                            browser="Microsoft Edge"
                            path="Settings → Cookies and site permissions"
                        />
                    </div>
                </div>

                {/* Warning */}
                <div className="bg-gray-900 rounded-3xl p-10 text-white mb-16">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#C1FF72] rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-3">Important Notice</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Blocking or deleting cookies may impact your experience on our website. Some features may not work correctly, and you may need to re-enter information that was previously saved.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Questions About Cookies?</h3>
                    <p className="text-gray-600 mb-8">
                        Our team is here to help clarify any concerns about how we use cookies.
                    </p>
                    <a
                        href="mailto:northtechhub2003@gmail.com"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all hover:scale-105"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        privacy@flash.com
                    </a>
                </div>
            </div>
        </div>
    );
}

function CookieType({ icon, title, color, description, examples }: { icon: string; title: string; color: string; description: string; examples: string }) {
    return (
        <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-gray-900 transition-all hover:shadow-lg group">
            <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
                    <p className="text-sm text-gray-500">
                        <span className="font-medium">Examples:</span> {examples}
                    </p>
                </div>
            </div>
        </div>
    );
}

function ManageCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
                <span className="text-3xl">{icon}</span>
                <div>
                    <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </div>
    );
}

function BrowserGuide({ browser, path }: { browser: string; path: string }) {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <span className="font-medium text-gray-900">{browser}</span>
            <span className="text-sm text-gray-600">{path}</span>
        </div>
    );
}
