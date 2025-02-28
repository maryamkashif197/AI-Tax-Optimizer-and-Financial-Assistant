'use client';
// components/Navbar.tsx
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useAuth } from './AuthContext';
import { useState } from 'react';

export default function Navbar() {
    const { tokenDetails, isLoading, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        // Close dropdown if it's open
        setMenuOpen(false);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href="/" className={styles.logoLink}>
                        <span className={styles.logoNeural}>Neural</span>
                        <span className={styles.logoPiggy}>Piggy</span>
                        <span className={styles.logoBank}>Bank</span>
                    </Link>
                </div>

                {isLoading ? (
                    <div className={styles.loadingIndicator}>
                        <div className={styles.loadingDot}></div>
                        <div className={styles.loadingDot}></div>
                        <div className={styles.loadingDot}></div>
                    </div>
                ) : tokenDetails ? (
                    <div className={styles.userSection}>
                        <div
                            className={styles.userProfile}
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                                <div className={styles.userAvatar}>
                                    {tokenDetails.name ? tokenDetails.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span className={styles.userName}>
                                    {tokenDetails.name || 'User'}
                            </span>
                            <span className={styles.dropdownIcon}>▼</span>
                        </div>

                        {menuOpen && (
                            <div className={styles.dropdownMenu}>
                                <Link href="/profile" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
                                    Profile
                                </Link>
                                <button className={styles.logoutButton} onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <ul className={styles.navLinks}>
                        <li className={styles.navItem}>
                            <Link href="/register" className={styles.navLink}>Register</Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/login" className={styles.navLink}>Login</Link>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
}