import React from 'react'
import logo from '../../assets/dash.webp'

function HeroSection({ openSignIn, openSignUp }) {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-20">
                    {/* Main content */}
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-8 shadow-sm">
                            <span className="mr-2">🚀</span>
                            Trusted by 10,000+ users worldwide
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl lg:text-7xl tracking-tight">
                            <span className="block mb-2">Securely Share Your Files</span>
                            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Anywhere, Anytime
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed">
                            Experience seamless and secure file sharing with our cutting-edge platform.
                            Fast, reliable, and built for teams of all sizes.
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button className="group px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                                onClick={() => openSignUp()}
                            >
                                Get Started
                                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <button className="px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-lg hover:bg-gray-50 border-2 border-indigo-200 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                                onClick={() => openSignIn()}
                            >
                                Sign In
                            </button>
                        </div>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="mt-16 sm:mt-20">
                        <div className="relative max-w-5xl mx-auto">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-2xl opacity-20 transform scale-95"></div>

                            {/* Image container */}
                            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 p-4">
                                <div className="rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                    <img
                                        src={logo}
                                        alt="CloudShare Dashboard Preview"
                                        className="w-full h-auto object-contain"
                                    />
                                </div>
                            </div>

                            {/* Floating cards decoration */}
                            <div className="absolute -top-8 -left-8 w-24 h-24 bg-white rounded-xl shadow-lg p-4 hidden lg:block transform rotate-6 hover:rotate-0 transition-transform">
                                <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center text-white text-2xl">
                                    📁
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-xl shadow-lg p-4 hidden lg:block transform -rotate-6 hover:rotate-0 transition-transform">
                                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center text-white text-2xl">
                                    🔒
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-16 text-center">
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-8">
                            Trusted by leading Everyday Users
                        </p>

                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    )
}

export default HeroSection