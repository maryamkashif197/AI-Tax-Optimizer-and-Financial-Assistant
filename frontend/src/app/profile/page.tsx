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
                                Upload CSV
                            </button>
                            <button className={styles.manualBtn}>
                                <span className={styles.btnIcon}>✍️</span>
                                Add Manual Entry
                            </button>
                        </div>
                    </div>

                    <div className={styles.transactionsList}>
                        <div className={styles.transactionItem}>
                            <span className={styles.transactionIcon}>💳</span>
                            <div className={styles.transactionDetails}>
                                <div className={styles.transactionTitle}>Transaction 1</div>
                                <div className={styles.transactionDate}>Jan 1, 2023</div>
                            </div>
                            <span className={styles.transactionAmount}>$150.00</span>
                        </div>
                        <div className={styles.transactionItem}>
                            <span className={styles.transactionIcon}>💳</span>
                            <div className={styles.transactionDetails}>
                                <div className={styles.transactionTitle}>Transaction 1</div>
                                <div className={styles.transactionDate}>Jan 1, 2023</div>
                            </div>
                            <span className={styles.transactionAmount}>$150.00</span>
                        </div>
                        <div className={styles.transactionItem}>
                            <span className={styles.transactionIcon}>💳</span>
                            <div className={styles.transactionDetails}>
                                <div className={styles.transactionTitle}>Transaction 1</div>
                                <div className={styles.transactionDate}>Jan 1, 2023</div>
                            </div>
                            <span className={styles.transactionAmount}>$150.00</span>
                        </div>
                        <div className={styles.transactionItem}>
                            <span className={styles.transactionIcon}>💸</span>
                            <div className={styles.transactionDetails}>
                                <div className={styles.transactionTitle}>Transaction 2</div>
                                <div className={styles.transactionDate}>Jan 15, 2023</div>
                            </div>
                            <span className={styles.transactionAmount}>$275.50</span>
                        </div>
                        <div className={styles.transactionItem}>
                            <span className={styles.transactionIcon}>🛒</span>
                            <div className={styles.transactionDetails}>
                                <div className={styles.transactionTitle}>Transaction 3</div>
                                <div className={styles.transactionDate}>Feb 3, 2023</div>
                            </div>
                            <span className={styles.transactionAmount}>$89.99</span>
                        </div>
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
                            <h2 className={styles.savingsTitle}>Total Savings</h2>
                        </div>
                        <div className={styles.savingsContent}>
                            <div className={styles.savingsAmount}>
                                $12,345
                            </div>
                            <div className={styles.savingsProgress}>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: '65%' }}
                                    ></div>
                                </div>
                                <div className={styles.progressText}>
                                    65% of your goal
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