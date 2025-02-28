"use client";
import React, { useRef } from 'react';
import { ArrowDownCircle, ChevronDown, DollarSign, Brain, Shield, Globe } from 'lucide-react';
import styles from './CSS/NPBLanding.module.css';
import Link from 'next/link';

// Landing page component for Neural Piggy Bank
const NeuralPiggyBankLanding = () => {

    const featuresRef = useRef<HTMLElement | null>(null);

    // 2. Scroll function with type safety
    const scrollToFeatures = () => {
        if (featuresRef.current) {
            featuresRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <div className={styles.backgroundEffects}>
                    <div className={styles.purpleGlow}></div>
                    <div className={styles.pinkGlow}></div>
                </div>
                <div className={styles.heroContent}>
                    <div className={styles.logoContainer}>
                        <div className={styles.logoWrapper}>
                            <span className={styles.logoNeuralText}>Neural</span>
                            <span className={styles.logoPiggyText}>Piggy</span>
                        </div>
                        <span className={styles.logoBankText}>Bank</span>
                    </div>

                    <h2 className={styles.tagline}>
                        AI-powered tax optimization that makes your life easier and your wallet fuller
                    </h2>

                    <div className={styles.buttonContainer}>
                        <Link href="/register">
                            <button className={styles.primaryButton}>
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
                <div className={styles.scrollIndicator} onClick={scrollToFeatures}>
                    <ArrowDownCircle size={36} />
                </div>
            </div>
            <div id="more-info" className={styles.featuresSection}>
                <div className={styles.sectionContainer}>
                    <h2 className={styles.sectionTitle}>
                        Making Taxes Less Taxing
                    </h2>

                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <DollarSign size={24} />
                            </div>
                            <h3 className={styles.featureTitle}>Tax Optimization</h3>
                            <p className={styles.featureDescription}>Our AI analyzes your transactions to find tax deductions and optimize your financial strategy.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <Brain size={24} />
                            </div>
                            <h3 className={styles.featureTitle}>AI-Powered Insights</h3>
                            <p className={styles.featureDescription}>Machine learning algorithms continuously improve to deliver personalized tax-saving suggestions.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <Globe size={24} />
                            </div>
                            <h3 className={styles.featureTitle}>Global Expansion</h3>
                            <p className={styles.featureDescription}>Currently supporting Egypt and the USA, with more countries coming soon to our platform.</p>
                        </div>
                    </div>
                    <div className={styles.howItWorksSection}>
                        <h2 className={styles.sectionTitle}>
                            How It Works
                        </h2>

                        <div className={styles.stepsGrid}>
                            <div className={styles.stepItem}>
                                <div className={styles.stepNumber}>1</div>
                                <h3 className={styles.stepTitle}>Enter Your Transactions</h3>
                                <p className={styles.stepDescription}>Input your financial data manually or import in bulk from your bank or financial apps.</p>
                            </div>

                            <div className={styles.stepItem}>
                                <div className={styles.stepNumber}>2</div>
                                <h3 className={styles.stepTitle}>AI Analysis</h3>
                                <p className={styles.stepDescription}>Our algorithms analyze your spending patterns and identify potential tax optimization opportunities.</p>
                            </div>

                            <div className={styles.stepItem}>
                                <div className={styles.stepNumber}>3</div>
                                <h3 className={styles.stepTitle}>Save Money</h3>
                                <p className={styles.stepDescription}>Follow our personalized recommendations to reduce your tax burden and maximize your savings.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonial/Trust Section */}
            <div className={styles.trustSection}>
                <div className={styles.trustContainer}>
                    <h2 className={styles.sectionTitle}>
                        Trusted Technology
                    </h2>

                    <div className={styles.trustCard}>
                        <div className={styles.trustBadge}>
                            <Shield className={styles.trustIcon} size={24} />
                            <span className={styles.trustText}>Secure & Reliable</span>
                        </div>

                        <p className={styles.trustDescription}>
                            Neural Piggy Bank uses TLS encryption to keep your financial data secure.
                            Fully supported and developed with Google's cutting-edge technologies.
                        </p>

                        <div className={styles.partnerLogos}>
                            <img
                                src="https://placehold.co/120x40/ec4899/ffffff?text=Google+Cloud+Partner"
                                alt="Google Cloud Partner"
                                className={styles.partnerLogo}
                            />
                            <img
                                src="https://placehold.co/120x40/9333ea/ffffff?text=TLS+Certified"
                                alt="TLS Certified"
                                className={styles.partnerLogo}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className={styles.ctaSection}>
                <div className={styles.ctaContainer}>
                    <h2 className={styles.ctaTitle}>
                        Ready to Save on Taxes?
                    </h2>
                    <p className={styles.ctaDescription}>
                        Join thousands of users who are already optimizing their finances with Neural Piggy Bank.
                    </p>
                    <Link href="/register">
                        <button className={styles.ctaButton}>
                            Get Started for Free
                        </button>
                    </Link>
                    <p className={styles.ctaFootnote}>No credit card required</p>
                </div>
            </div>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContainer}>
                    <div className={styles.footerContent}>
                        <div className={styles.footerBranding}>
                            <span className={styles.footerLogo}>Neural Piggy Bank</span>
                            <p className={styles.footerCopyright}>2025 All Rights Reserved</p>
                        </div>

                        <div className={styles.footerLinks}>
                            <a href="/login" className={styles.footerLink}>Login</a>
                            <a href="/register" className={styles.footerLink}>Register</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default NeuralPiggyBankLanding;