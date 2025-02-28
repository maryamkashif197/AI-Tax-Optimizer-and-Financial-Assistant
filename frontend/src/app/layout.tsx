import { Main } from 'next/document';
import Navbar from '../app/components/Navbar';
import './CSS/globals.css';
import { AuthProvider } from './components/AuthContext';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <title>Neural Piggy Bank</title>
                {/* You can add meta tags, links, etc. here */}
            </head>
            <body>
            <AuthProvider>
                <Navbar />
                <main >
                {children}
                </main>
            </AuthProvider>
            </body>
        </html>
    );
}
