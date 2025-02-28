import Navbar from '../app/components/Navbar';
import './CSS/globals.css';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <title>Neural Piggy Bank</title>
                {/* You can add meta tags, links, etc. here */}
            </head>
            <body>
                <Navbar />
                {children}
            </body>
        </html>
    );
}
