'use client';

import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import styles from '../CSS/Auth.module.css';

const LoginP = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // Handle login logic here
            console.log('Login attempt with:', { email, password, rememberMe });
        }, 1500);
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.backgroundEffects}>
                <div className={styles.purpleGlow}></div>
                <div className={styles.pinkGlow}></div>
            </div>

            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <Link href="/" className={styles.backLink}>
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
                    </Link>

                    <div className={styles.logoContainer}>
                        <div className={styles.logoWrapper}>
                            <span className={styles.logoNeuralText}>Neural</span>
                            <span className={styles.logoPiggyText}>Piggy</span>
                        </div>
                        <span className={styles.logoBankText}>Bank</span>
                    </div>
                </div>

                <h1 className={styles.authTitle}>Welcome Back</h1>
                <p className={styles.authSubtitle}>Enter your credentials to access your account</p>

                <form onSubmit={handleLogin} className={styles.authForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel}>Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.formInput}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.formLabel}>Password</label>
                        <div className={styles.passwordInputWrapper}>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.formInput}
                                placeholder="........."
                                required
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.formOptions}>
                        <div className={styles.rememberMe}>
                            <input
                                id="rememberMe"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                className={styles.checkbox}
                            />
                            <label htmlFor="rememberMe">Remember me</label>
                        </div>
                        <Link href="/forgot-password" className={styles.forgotPassword}>
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className={`${styles.authButton} ${isLoading ? styles.loading : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className={styles.authFooter}>
                    <p>Don't have an account?</p>
                    <Link href="/register" className={styles.authLink}>
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginP;