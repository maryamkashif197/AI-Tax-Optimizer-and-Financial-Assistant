'use client';

import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import styles from '../CSS/Auth.module.css';

export default function RegisterP(){
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // Handle registration logic here
            console.log('Registration attempt with:', formData);
        }, 1500);
    };

    const passwordsMatch = formData.password === formData.confirmPassword;
    const passwordStrength = formData.password.length >= 8 ? 'strong' : 'weak';

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

                <h1 className={styles.authTitle}>Create Account</h1>
                <p className={styles.authSubtitle}>Join thousands of users optimizing their finances</p>

                <form onSubmit={handleRegister} className={styles.authForm}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="firstName" className={styles.formLabel}>First Name</label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={styles.formInput}
                                placeholder="John"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="lastName" className={styles.formLabel}>Last Name</label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={styles.formInput}
                                placeholder="Doe"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel}>Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
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
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                className={`${styles.formInput} ${formData.password && styles[passwordStrength]}`}
                                placeholder=".........."
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {formData.password && (
                            <div className={styles.passwordStrength}>
                                <span className={styles[passwordStrength]}>
                                    {passwordStrength === 'strong' ? 'Strong password' : 'Password must be at least 8 characters'}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword" className={styles.formLabel}>Confirm Password</label>
                        <div className={styles.passwordInputWrapper}>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`${styles.formInput} ${formData.confirmPassword && (passwordsMatch ? styles.match : styles.mismatch)}`}
                                placeholder="........"
                                required
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {formData.confirmPassword && !passwordsMatch && (
                            <div className={styles.passwordMismatch}>
                                Passwords do not match
                            </div>
                        )}
                    </div>

                    <div className={styles.termsContainer}>
                        <div className={styles.rememberMe}>
                            <input
                                id="agreeToTerms"
                                type="checkbox"
                                checked={agreeToTerms}
                                onChange={() => setAgreeToTerms(!agreeToTerms)}
                                className={styles.checkbox}
                                required
                            />
                            <label htmlFor="agreeToTerms">
                                I agree to the <Link href="/terms" className={styles.termsLink}>Terms of Service</Link> and <Link href="/privacy" className={styles.termsLink}>Privacy Policy</Link>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`${styles.authButton} ${isLoading ? styles.loading : ''}`}
                        disabled={isLoading || !passwordsMatch || formData.password.length < 8 || !agreeToTerms}
                    >
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className={styles.authFooter}>
                    <p>Already have an account?</p>
                    <Link href="/login" className={styles.authLink}>
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};