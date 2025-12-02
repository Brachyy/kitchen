"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children, activeView, onViewChange }) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'planner', label: 'Plan', icon: '📅' },
    { id: 'fridge', label: 'Fridge', icon: '❄️' },
    { id: 'shop', label: 'Shop', icon: '🛒' },
  ];

  return (
    <div className={styles.container}>
      {/* Desktop Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          Kitchen<span>AI</span>
        </div>
        
        <nav className={styles.nav}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`${styles.navItem} ${activeView === item.id ? styles.active : ''}`}
              onClick={() => onViewChange(item.id)}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{user?.email?.[0]?.toUpperCase()}</div>
            <span className={styles.email}>{user?.email}</span>
          </div>
          <button onClick={logout} className={styles.logoutBtn}>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.main}>
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className={styles.bottomNav}>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeView === item.id ? styles.active : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
        <button className={styles.navItem} onClick={logout}>
           <span className={styles.icon}>🚪</span>
           <span className={styles.label}>Exit</span>
        </button>
      </nav>
    </div>
  );
}
