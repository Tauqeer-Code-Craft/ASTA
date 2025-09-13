import React from 'react';
import './globals.css'; // Ensure Tailwind (via @import "tailwindcss") is included
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SessionProvider } from '../components/SessionProvider';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html lang="en">
                        <body className="bg-neutral-950 text-neutral-100 min-h-screen overflow-x-hidden ">
                            <SessionProvider>
                                <Navbar />
                                {children}
                                <Footer />
                            </SessionProvider>
                        </body>
        </html>
    );
};

export default Layout;
