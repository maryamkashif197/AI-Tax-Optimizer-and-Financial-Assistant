"use client";
import React, { useState } from "react";
import styles from "../CSS/profile.module.css";

export default function ProfilePage() {
    const [files, setFiles] = useState<File[]>([]);
    const [report, setReport] = useState<string | null>(null);
    const [calculating, setCalculating] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
    const [isLoading, setIsLoading] = useState(false);

    // File handling functions remain the same
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleTaxCalculation = () => {
        setCalculating(true);
        setTimeout(() => {
            setReport("Your tax optimization report is ready!");
            setCalculating(false);
        }, 2000);
    };

    // Updated chat handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsLoading(true);
        try {
            // Store user message immediately
            setMessages(prev => [...prev, { role: 'user', content: message }]);

            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    history: messages.map(msg => ({
                        role: msg.role,
                        parts: [msg.content]
                    }))
                }),
            });

            const data = await response.json();
            setMessages(prev => [
                ...prev,
                { role: 'bot', content: data.response }
            ]);
            setMessage('');
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'bot',
                content: "Sorry, I'm having trouble connecting. Please try again later."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.profileContainer}>
            <div className={styles.gridLayout}>
                {/* Left Column (Keep existing structure) */}
                <div className={styles.column}>
                    {/* File upload and tax sections remain unchanged */}
                    {/* ... */}
                </div>

                {/* Right Column - Updated Chat Section */}
                <div className={styles.column}>
                    <section className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            <span className={styles.icon}>💬</span> Support Assistant
                        </h2>
                        <div className={styles.chatContent}>
                            <div className={styles.chatBox}>
                                {messages.length === 0 ? (
                                    <div className={styles.chatEmpty}>
                                        <p>How can I help you today?</p>
                                        <div className={styles.exampleQuestions}>
                                            <button
                                                type="button"
                                                className={styles.exampleButton}
                                                onClick={() => setMessage("How do tax deductions work?")}
                                            >
                                                How do deductions work?
                                            </button>
                                            <button
                                                type="button"
                                                className={styles.exampleButton}
                                                onClick={() => setMessage("What documents do I need for filing?")}
                                            >
                                                Required documents
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`${styles.chatMessage} ${msg.role === 'user' ? styles.userMessage : styles.botMessage
                                                }`}
                                        >
                                            {msg.content.split('\n').map((line, i) => (
                                                <p key={i}>{line}</p>
                                            ))}
                                        </div>
                                    ))
                                )}
                                {isLoading && (
                                    <div className={styles.loading}>
                                        <div className={styles.loadingDot}></div>
                                        <div className={styles.loadingDot}></div>
                                        <div className={styles.loadingDot}></div>
                                    </div>
                                )}
                            </div>
                            <form onSubmit={handleSubmit} className={styles.chatForm}>
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
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