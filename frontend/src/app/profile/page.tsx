"use client";
import React, { useState } from "react";
import styles from "../CSS/profile.module.css";

export default function ProfilePage() {
    const [files, setFiles] = useState<File[]>([]);
    const [chatMessages, setChatMessages] = useState<{ id: number; text: string }[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [report, setReport] = useState<string | null>(null);
    const [calculating, setCalculating] = useState(false);

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        }
    };

    // Remove a file from the list
    const removeFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    // Simulate tax calculation and report generation
    const handleTaxCalculation = () => {
        setCalculating(true);
        // Simulate delay for calculation
        setTimeout(() => {
            setReport("Your tax optimization report is ready!");
            setCalculating(false);
        }, 2000);
    };

    // Handle chat submission
    const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (chatInput.trim()) {
            const newMessage = { id: Date.now(), text: chatInput };
            setChatMessages((prev) => [...prev, newMessage]);
            setChatInput("");
        }
    };

    return (
        <div className={styles.profileContainer}>
            <h1 className={styles.title}>My Profile</h1>

            {/* 1. Upload Section */}
            <section className={styles.uploadSection}>
                <h2>Upload Documents</h2>
                <input
                    type="file"
                    multiple
                    accept=".pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                />

            </section>

            {/* 2. Files List Section */}
            <section className={styles.filesSection}>
                <h2>Uploaded Files & Transactions</h2>
                {files.length === 0 ? (
                    <p>No files uploaded yet.</p>
                ) : (
                    <ul className={styles.filesList}>
                        {files.map((file, index) => (
                            <li key={index} className={styles.fileItem}>
                                <span>{file.name}</span>
                                <div className={styles.fileActions}>
                                    <button onClick={() => removeFile(index)}>Remove</button>
                                    <button>Edit Extracted Text</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* 3. Tax Calculation Section */}
            <section className={styles.reportSection}>
                <h2>Tax Calculation & Optimization</h2>
                <button
                    onClick={handleTaxCalculation}
                    disabled={calculating}
                    className={styles.calcButton}
                >
                    {calculating ? "Calculating..." : "Calculate Taxes & Optimize"}
                </button>
                {report && (
                    <div className={styles.report}>
                        <p>{report}</p>
                        <a href="#" download="tax-report.pdf" className={styles.downloadLink}>
                            Download Report
                        </a>
                    </div>
                )}
            </section>

            {/* 4. Chat Bot Section */}
            <section className={styles.chatSection}>
                <h2>Support Chat</h2>
                <div className={styles.chatBox}>
                    {chatMessages.length === 0 ? (
                        <p>No messages yet. Start a chat!</p>
                    ) : (
                        chatMessages.map((message) => (
                            <div key={message.id} className={styles.chatMessage}>
                                {message.text}
                            </div>
                        ))
                    )}
                </div>
                <form onSubmit={handleChatSubmit} className={styles.chatForm}>
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className={styles.chatInput}
                    />
                    <button type="submit" className={styles.chatButton}>Send</button>
                </form>
            </section>
        </div>
    );
}
