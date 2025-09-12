import React from 'react';
import './globals.css'; // Ensure Tailwind (via @import "tailwindcss") is included
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html lang="en">
            <body className="bg-neutral-950 text-neutral-100 min-h-screen overflow-x-hidden ">                 
              <Navbar />
                   {children}
              <Footer />

            </body>
        </html>
    );
};

export default Layout;
