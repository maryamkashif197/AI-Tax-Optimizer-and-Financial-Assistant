import React from "react";
import { Menu, Bell, Search } from "lucide-react";
import styles from "./Navbar.module.css";
export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Menu className={styles.logo} size={24} />
          <h1 className={styles.title}>TaxAI Optimizer</h1>
        </div>
        <div className={styles.actions}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search features..."
              className={styles.searchInput}
            />
          </div>
          <Bell className={styles.logo} size={24} />
        </div>
      </div>
    </nav>
  );
};
