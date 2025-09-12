import React from 'react';
import './globals.css'; // Ensure Tailwind (via @import "tailwindcss") is included
import Navbar from '../components/Navbar';
import CursorGlow from '../components/CursorGlow';
import Feature from '../components/Feature';
import PreviewShowcase from '../components/PreviewShowcase';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import AnimationProvider from '../components/AnimationProvider';
import Ambient from '../components/ambient';
import SplashScreen from '../components/SplashScreen';
import FeaturesSection from '@/components/Designs/FeatureSection';
import IntegrationCards from '@/components/Designs/IntegrationCards';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html lang="en">
            <body>
                <AnimationProvider>
                    <div className="relative min-h-screen bg-neutral-950 text-neutral-100">
                        <SplashScreen />
                        <Ambient />
                        <CursorGlow />
                        <Navbar />
                        <Hero />
                        <FeaturesSection />
                        <IntegrationCards />
                        <Feature />
                        {children}
                        <Footer />
                    </div>
                </AnimationProvider>
            </body>
        </html>
    );
};

export default Layout;
