"use client";
import React, { useState, FormEvent } from "react";
import styles from "../CSS/profile.module.css";

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

            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    history: messages.map(msg => ({
                        role: msg.role,
                        parts: [msg.content]
                    }))
                }),
            });

            const data = await response.json();
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

    return (
        <div className={styles.profileContainer}>
            <div className={styles.backgroundEffects}>
                <div className={styles.purpleGlow}></div>
                <div className={styles.pinkGlow}></div>
            </div>

            <div className={styles.gridLayout}>
                <div className={styles.column}>
                    <section className={`${styles.card} ${styles.featureCard}`}>
                        <h2 className={styles.cardTitle}>
                            <span className={styles.icon}>📁</span>
                            <span className={styles.logoBankText}>Document Upload</span>
                        </h2>
                        <div className={styles.uploadContent}>
                            <input
                                type="file"
                                multiple
                                accept=".pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={handleFileChange}
                                className={styles.fileInput}
                            />
                            <p className={styles.uploadHint}>Supported formats: PDF, DOCX, JPEG, PNG</p>
                        </div>
                    </section>

                    <section className={`${styles.card} ${styles.featureCard}`}>
                        <h2 className={styles.cardTitle}>
                            <span className={styles.icon}>📂</span>
                            <span className={styles.logoBankText}>Uploaded Documents</span>
                        </h2>
                        <div className={styles.filesContent}>
                            {files.length === 0 ? (
                                <p className={styles.emptyState}>No documents uploaded yet</p>
                            ) : (
                                <ul className={styles.filesList}>
                                    {files.map((file, index) => (
                                        <li key={index} className={styles.fileItem}>
                                            <div className={styles.fileInfo}>
                                                <span className={styles.fileName}>{file.name}</span>
                                                <span className={styles.fileSize}>
                                                    {(file.size / 1024).toFixed(1)} KB
                                                </span>
                                            </div>
                                            <div className={styles.fileActions}>
                                                <button
                                                    onClick={() => removeFile(index)}
                                                    className={styles.iconButton}
                                                    aria-label="Delete file"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>

                    <section className={`${styles.card} ${styles.featureCard}`}>
                        <h2 className={styles.cardTitle}>
                            <span className={styles.icon}>🧮</span>
                            <span className={styles.logoBankText}>Tax Optimization</span>
                        </h2>
                        <div className={styles.taxContent}>
                            <button
                                onClick={handleTaxCalculation}
                                disabled={calculating || files.length === 0}
                                className={styles.primaryButton}
                            >
                                {calculating ? (
                                    <span className={styles.buttonText}>Analyzing...</span>
                                ) : (
                                    <>
                                        <span className={styles.buttonIcon}>💸</span>
                                        <span className={styles.buttonText}>Generate Tax Report</span>
                                    </>
                                )}
                            </button>
                            {report && (
                                <div className={styles.report}>
                                    <p className={styles.reportText}>✅ Analysis Complete!</p>
                                    <a href="#" download="tax-report.pdf" className={styles.downloadLink}>
                                        <span className={styles.downloadIcon}>⬇️</span>
                                        Download Full Report
                                    </a>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <div className={styles.column}>
                    <section className={`${styles.card} ${styles.trustCard}`}>
                        <h2 className={styles.cardTitle}>
                            <span className={styles.icon}>💬</span>
                            <span className={styles.logoBankText}>Support Assistant</span>
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
                                    <div className={styles.chatMessage}>
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

            <footer className={styles.footer}>
                <div className={styles.footerContainer}>
                    <div className={styles.footerContent}>
                        <div className={styles.footerBranding}>
                            <div className={styles.footerLogo}>NeuralPiggyBank</div>
                            <div className={styles.footerCopyright}>
                                © {new Date().getFullYear()} All rights reserved
                            </div>
                        </div>
                        <div className={styles.footerLinks}>
                            <a href="#" className={styles.footerLink}>Privacy</a>
                            <a href="#" className={styles.footerLink}>Terms</a>
                            <a href="#" className={styles.footerLink}>Support</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}