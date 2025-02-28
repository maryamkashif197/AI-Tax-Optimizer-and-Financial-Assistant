"use client";
import React, { useState, FormEvent, useEffect } from "react";
import styles from "../CSS/profile.module.css";
import axios from '../api/axios';

interface ChatMessage {
    id: number;
    role: 'user' | 'bot';
    content: string;
}
interface Transaction {
    _id: string;
    transaction_id: string;
    user_id: string;
    date: Date;
    amount: number;
    currency: string;
    category: string;
    description: string;
    deduction_rate: number;
    max_limit: number;
    merchant: string;
    payment_method: string;
    country: string;
    tax_deductible: boolean;
}



export default function ProfilePage() {
    const [showManualForm, setShowManualForm] = useState(false);
    const [transactions, setTransactions] = useState<Transaction | [] >([]);

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

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('/transaction');
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []); 

    const handleExampleQuestion = (question: string) => {
        setMessageInput(question);
    };

    const handleResetChat = async () => {
        // Clear messages state
        setMessages([]);
        // Clear input field
        setMessageInput("");

        await axios.delete("/api/chat/reset");
        window.location.reload();
    };

    const handleDeleteTransaction = async (transactionId: string) => {
        // Add your delete logic here
        // For example:
        // deleteTransaction(transactionId);
        // or
        // dispatch(deleteTransactionAction(transactionId));
        try {
            await axios.delete(`/transaction/${transactionId}`);
            // refresh page after deleting transaction
            window.location.reload();
            console.log("Deleting transaction:", transactionId);
        } catch (error) { 
            console.error("Error deleting transaction:", error)
        }
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

    // manual form
    const ManualForm = ({ onClose }) => {
        const [formData, setFormData] = useState({
            description: "",
            merchant: "",
            amount: "",
            category: "",
            payment_method: "",
            date: "",
        });

        const handleChange = (e: { target: { name: any; value: any; }; }) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        };

        const handleSubmit = async (e: { preventDefault: () => void; }) => {
            e.preventDefault();
            try {
                await axios.post("/transaction", formData);
            }catch (error) {
                console.error("Error creating transaction:", error);
            }
            onClose(); // Close the form after submission
            window.location.reload();
        };

        return (
            <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
                <div className={styles.modal}>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                    <h2>Enter Transaction</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Merchant</label>
                            <input
                                type="text"
                                name="merchant"
                                value={formData.merchant}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Amount</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">Select a category</option>
                                <option value="Home Office">Home Office</option>
                                <option value="Software & Subscriptions">Software & Subscriptions</option>
                                <option value="Freelancer Platform Fees">Freelancer Platform Fees</option>
                                <option value="Work Equipment">Work Equipment</option>
                                <option value="Internet & Phone">Internet & Phone</option>
                                <option value="Education & Training">Education & Training</option>
                                <option value="Business Travel">Business Travel</option>
                                <option value="Client Entertainment">Client Entertainment</option>
                                <option value="Business Travel">Business Travel</option>
                                <option value="Office Supplies">Office Supplies</option>
                                <option value="Software & Tools">Software & Tools</option>
                                <option value="Meals & Entertainment">Meals & Entertainment</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Personal Shopping">Personal Shopping</option>
                                <option value="Education & Training">Education & Training</option>
                                <option value="Meals & Entertainment">Meals & Entertainment</option>
                                <option value="Rent & Utilities">Rent & Utilities</option>
                                <option value="Marketing & Advertising">Marketing & Advertising</option>
                                <option value="Transportation">Transportation</option>
                                <option value="Groceries">Groceries</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Payment Method</label>
                            <select name="payment_method" value={formData.payment_method} onChange={handleChange} required>
                                <option value="">Select a payment method</option>
                                <option value="credit_card">Credit Card</option>
                                <option value="paypal">PayPal</option>
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="cash">Cash</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Date</label>
                            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                        </div>
                        <div className={styles.formActions}>
                            <button type="button" onClick={onClose} className={styles.cancelButton}>
                                Cancel
                            </button>
                            <button type="submit" className={styles.submitButton}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

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
                            {showManualForm && (
                                <ManualForm onClose={() => setShowManualForm(false)} />
                            )}
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
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDeleteTransaction(transaction._id)}
                                        aria-label="Delete transaction"
                                    >
                                        <span className={styles.deleteIcon}>×</span>
                                    </button>
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
                                <span>Total Transactions:</span>
                                <span className={styles.taxValue}>
                                    ${transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                                </span>
                            </div>
                            <div className={styles.taxRow}>
                                <span>Deductible Amount:</span>
                                <span className={styles.taxValue}>
                                    ${totalTax.toFixed(2)}
                                </span>
                            </div>
                            <div className={styles.taxRow}>
                                <span>Savings:</span>
                                <span className={styles.taxSavings}>
                                    ${savedAmount.toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <button
                            className={styles.downloadBtn}
                            onClick={handleTaxCalculation}
                            disabled={calculating}
                        >
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