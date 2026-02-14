import React, { useEffect } from 'react'
import { useClerk, useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import HeroSection from '../components/landing/HeroSection'
import FeatureSection from '../components/landing/FeatureSection'
import PricingSection from '../components/landing/PricingSection'
import Testinomialsec from '../components/landing/Testinomialsec'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'

export function Landing() {
    const { openSignIn, openSignUp } = useClerk();
    const { isSignedIn } = useUser();
    const navigate = useNavigate();
    useEffect(() => {
        if (isSignedIn) {
            navigate('/dashboard');
        }

    }, [isSignedIn, navigate]);

    return (
        <div className="Landing bg-gradient-to-r from-blue-500 to-purple-600">
            {/* Hero Section */}
            <HeroSection openSignIn={openSignIn} openSignUp={openSignUp} isSignedIn={isSignedIn} />
            {/* Features section */}
            <FeatureSection />
            {/* Pricing section */}
            <PricingSection openSignIn={openSignIn} openSignUp={openSignUp} />
            {/* Testimonials section */}
            <Testinomialsec />
            {/* CTA section */}
            <CTASection openSignUp={openSignUp} />
            {/* Footer section */}
            <Footer />
        </div>
    )
}

export default Landing