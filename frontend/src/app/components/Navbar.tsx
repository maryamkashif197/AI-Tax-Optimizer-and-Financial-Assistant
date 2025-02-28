'use client';
// components/Navbar.tsx
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useAuth } from './AuthContext';

export default function Navbar() {
    const { tokenDetails, isLoading, logout } = useAuth();
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
                <ul className={styles.navLinks}>
                    <li className={styles.navItem}>
                        <Link href="/register" className={styles.navLink}>Register</Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/login" className={styles.navLink}>Login</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
