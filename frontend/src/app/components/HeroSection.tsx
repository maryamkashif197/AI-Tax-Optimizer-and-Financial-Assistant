import React from "react";
import { ArrowRight, PieChart, DollarSign, TrendingUp } from "lucide-react";
import styles from "./HeroSection.module.css";
export const HeroSection = () => {
  const features = [
    {
      icon: <PieChart size={32} color="#60a5fa" />,
      title: "Smart Analytics",
      description: "Advanced insights into your financial data",
    },
    {
      icon: <DollarSign size={32} color="#a78bfa" />,
      title: "Maximum Savings",
      description: "Identify all possible tax deductions",
    },
    {
      icon: <TrendingUp size={32} color="#2dd4bf" />,
      title: "Real-time Updates",
      description: "Track your tax optimization progress",
    },
  ];
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Optimize Your Taxes with AI</h1>
          <p className={styles.description}>
            Maximize your tax savings with our intelligent tax optimization
            platform. Get personalized insights and real-time tax planning.
          </p>
          <button className={styles.button}>
            Get Started <ArrowRight size={20} />
          </button>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
