"use client";
import React, { useState, FormEvent } from "react";
import styles from "../CSS/profile.module.css";
import axios from '../api/axios';

interface ChatMessage {
    id: number;
    role: 'user' | 'bot';
    content: string;
}

export default function ProfilePage() {
    const [showManualForm, setShowManualForm] = useState(false);
    const [transactions, setTransactions] = useState([
        {
            transaction_id: 1,
            user_id: "user_123",
            date: "2023-01-01",
            amount: 150.00,
            currency: "USD",
            category: "Office Supplies",
            description: "Printer paper purchase",
            deduction_rate: 0.3,
            max_limit: 1000,
            merchant: "Office Depot",
            payment_method: "Credit Card",
            country: "US",
            tax_deductible: true
        },
        {
            transaction_id: 2,
            user_id: "user_123",
            date: "2023-01-15",
            amount: 275.50,
            currency: "USD",
            category: "Software",
            description: "Design software license",
            deduction_rate: 0.2,
            max_limit: 500,
            merchant: "Adobe",
            payment_method: "PayPal",
            country: "US",
            tax_deductible: true
        },
        {
            transaction_id: 3,
            user_id: "user_123",
            date: "2023-02-03",
            amount: 89.99,
            currency: "USD",
            category: "Education",
            description: "Online course subscription",
            deduction_rate: 0.15,
            max_limit: 300,
            merchant: "Udemy",
            payment_method: "Credit Card",
            country: "US",
            tax_deductible: false
        }
    ]);

    const [files, setFiles] = useState<File[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [report, setReport] = useState<string | null>(null);
    const [calculating, setCalculating] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...selectedFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleTaxCalculation = () => {
        setCalculating(true);
        setTimeout(() => {
            setReport("Your tax optimization report is ready!");
            setCalculating(false);
        }, 2000);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const input = messageInput.trim();
        if (!input) return;

        setIsLoading(true);
        const newMessage: ChatMessage = {
            id: Date.now(),
            role: 'user',
            content: input
        };

        try {
            setMessages(prev => [...prev, newMessage]);
            setMessageInput("");

            const response = await axios.post("/api/chat", { message: input });

            const data = await response.data;
            console.log(data);
            setMessages(prev => [
                ...prev,
                { id: Date.now(), role: 'bot', content: data.response }
            ]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'bot',
                content: "Sorry, I'm having trouble connecting. Please try again later."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExampleQuestion = (question: string) => {
        setMessageInput(question);
    };

    const handleResetChat = async () => {
        // Clear messages state
        setMessages([]);
        // Clear input field
        setMessageInput("");

        await axios.delete("/api/chat/reset");
    };

    // Helper function to calculate total taxes and savings
    const calculateTaxSavings = (transactions: any[]) => {
        const taxDeductibleTransactions = transactions.filter((t: { tax_deductible: any; }) => t.tax_deductible);

        const { totalTax, totalSavedAmount } = taxDeductibleTransactions.reduce(
            (acc: { totalTax: number; totalSavedAmount: number }, t: { amount: number; deduction_rate: number }) => {
                const savedAmount = t.amount * (t.deduction_rate || 0); // Use deduction_rate from the transaction
                return {
                    totalTax: acc.totalTax + t.amount,
                    totalSavedAmount: acc.totalSavedAmount + savedAmount,
                };
            },
            { totalTax: 0, totalSavedAmount: 0 } // Initial values
        );

        const percentage = totalTax > 0 ? (totalSavedAmount / totalTax) * 100 : 0;

        return {
            totalTax,
            savedAmount: totalSavedAmount,
            percentage,
        };
    };

    // Then use the function
    const { percentage, savedAmount, totalTax } = calculateTaxSavings(transactions);

    return (
        <div className={styles.profileContainer}>
            <div className={styles.gridLayout}>
                <div className={styles.leftContainer}>
                    <div className={styles.uploadSection}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionIcon}>💜</span>
                            <h3 className={styles.sectionTitle}>Add Transactions</h3>
                        </div>
                        <div className={styles.uploadOptions}>
                            <button className={styles.uploadBtn}>
                                <span className={styles.btnIcon}>📄</span>
                                Upload Transaction
                            </button>
                            <button className={styles.manualBtn} onClick={() => setShowManualForm(true)}>
                                <span className={styles.btnIcon}>✍️</span>
                                Manual Entry
                            </button>
                        </div>
                    </div>

                    <div className={styles.transactionsList}>
                        {transactions.map((transaction) => {
                            const getPaymentIcon = (method: string) => {
                                switch (method.toLowerCase()) {
                                    case 'credit card':
                                        return '💳'; // Credit card icon
                                    case 'paypal':
                                        return '📱'; // Mobile icon for PayPal
                                    case 'bank transfer':
                                        return '🏦'; // Bank icon
                                    case 'cash':
                                        return '💰'; // Money stack icon
                                    case 'crypto':
                                        return '🪙'; // Coin icon for crypto
                                    default:
                                        return '💳'; // Default icon (credit card)
                                }
                            };
                            return (
                                <div key={transaction.transaction_id} className={styles.transactionItem}>
                                    
                                    <div className={styles.transactionDetails}>
                                        <div className={styles.transactionTitle}>
                                            <span className={styles.transactionIcon}>{getPaymentIcon(transaction.payment_method)} </span>
                                            {transaction.description}
                                            <span className={styles.transactionMerchant}> - {transaction.merchant}</span>
                                        </div>
                                        <div className={styles.transactionSubdetails}>
                                            <span className={styles.transactionDate}>
                                                {new Date(transaction.date).toDateString()}
                                            </span>
                                            <span className={styles.transactionCategory}> - {transaction.category}</span>
                                            {transaction.tax_deductible && (
                                                <span className={styles.taxBadge}> - Tax Deductible</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.transactionAmount}>
                                        <div>${transaction.amount.toFixed(2)}</div>
                                        <div className={styles.deductionRate}>
                                            {transaction.deduction_rate * 100}% Deduction
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.taxSection}>
                        <div className={styles.taxCalculation}>
                            <div className={styles.sectionHeader}>
                                <span className={styles.sectionIcon}>✨</span>
                                <h4 className={styles.sectionTitle}>Tax Calculation</h4>
                            </div>
                            <div className={styles.taxRow}>
                                <span>Total Income:</span>
                                <span className={styles.taxValue}>$515.49</span>
                            </div>
                            <div className={styles.taxRow}>
                                <span>Estimated Tax:</span>
                                <span className={styles.taxValue}>$103.10</span>
                            </div>
                            <div className={styles.taxRow}>
                                <span>Savings:</span>
                                <span className={styles.taxSavings}>$42.75</span>
                            </div>
                        </div>
                        <button className={styles.downloadBtn} onClick={handleTaxCalculation}>
                            <span className={styles.btnIcon}>📥</span>
                            {calculating ? "Processing..." : "Download Report"}
                        </button>
                    </div>
                </div>

                <div className={styles.column}>
                    <section className={styles.savingsCard}>
                        <div className={styles.savingsHeader}>
                            <span className={styles.savingsIcon}>💰</span>
                            <h2 className={styles.savingsTitle}>Tax Savings</h2>
                        </div>
                        <div className={styles.savingsContent}>
                            <div className={styles.savingsAmount}>
                                ${calculateTaxSavings(transactions).savedAmount.toLocaleString()}
                            </div>
                            <div className={styles.savingsProgress}>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{
                                            width: `${calculateTaxSavings(transactions).percentage.toFixed(1)}%`
                                        }}
                                    ></div>
                                </div>
                                <div className={styles.progressText}>
                                    {calculateTaxSavings(transactions).percentage.toFixed(1)}% saved paying only ${calculateTaxSavings(transactions).totalTax.toLocaleString()} total taxes
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            <span className={styles.icon}>💬</span> Support Assistant
                            <button
                                onClick={handleResetChat}
                                className={styles.resetButton}
                                type="button"
                            >
                                <span className={styles.btnIcon}>🔄</span>
                                Reset Chat
                            </button>
                        </h2>
                        <div className={styles.chatContent}>
                            <div className={styles.chatBox}>
                                {messages.length === 0 ? (
                                    <div className={styles.chatEmpty}>
                                        <p>How can I help you today?</p>
                                        <div className={styles.exampleQuestions}>
                                            <button
                                                type="button"
                                                onClick={() => handleExampleQuestion("How do deductions work?")}
                                                className={styles.exampleButton}
                                            >
                                                How do deductions work?
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleExampleQuestion("What documents are required?")}
                                                className={styles.exampleButton}
                                            >
                                                Required documents
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleExampleQuestion("Calculate my tax savings")}
                                                className={styles.exampleButton}
                                            >
                                                Calculate my tax savings
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`${styles.chatMessage} ${message.role === 'user' ? styles.userMessage : styles.botMessage
                                                }`}
                                        >
                                            {message.content}
                                        </div>
                                    ))
                                )}
                                {isLoading && (
                                    <div className={`${styles.chatMessage} ${styles.botMessage}`}>
                                        <div className={styles.typingIndicator}>
                                            <div className={styles.dot}></div>
                                            <div className={styles.dot}></div>
                                            <div className={styles.dot}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <form onSubmit={handleSubmit} className={styles.chatForm}>
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    className={styles.chatInput}
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    className={styles.chatButton}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Sending...' : 'Send'}
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}