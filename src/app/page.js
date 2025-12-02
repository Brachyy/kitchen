"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoginView from '@/components/LoginView';
import DashboardLayout from '@/components/DashboardLayout';
import PlannerView from '@/components/PlannerView';
import FridgeView from '@/components/FridgeView';
import styles from './page.module.css';

// Simple Dashboard Home View
function DashboardHome() {
  return (
    <div className={styles.dashboardHome}>
      <h1 className={styles.welcomeTitle}>Welcome to your Kitchen</h1>
      <div className={styles.quickActions}>
        <div className={styles.actionCard}>
          <h3>📅 Weekly Plan</h3>
          <p>Check what's for dinner today.</p>
        </div>
        <div className={styles.actionCard}>
          <h3>❄️ Empty Fridge</h3>
          <p>Find recipes with ingredients you have.</p>
        </div>
        <div className={styles.actionCard}>
          <h3>🛒 Shopping List</h3>
          <p>See what you need to buy.</p>
        </div>
      </div>
    </div>
  );
}

// Simple Shop View (reusing ShoppingList component logic if needed, or just placeholder for now)
import ShoppingList from '@/components/ShoppingList';
import { getWeeklyPlan } from '@/services/db';
import { useEffect } from 'react';

function ShopView() {
  const { user } = useAuth();
  const [plan, setPlan] = useState({ Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] });
  
  useEffect(() => {
    if (user) {
      getWeeklyPlan(user.uid).then(data => {
        if (data) setPlan(prev => ({ ...prev, ...data }));
      });
    }
  }, [user]);

  return (
    <div className={styles.shopView}>
      <h2 className={styles.viewTitle}>Shopping List</h2>
      <ShoppingList plan={plan} />
    </div>
  );
}

export default function Home() {
  const { user, loading } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <DashboardLayout activeView={activeView} onViewChange={setActiveView}>
      {activeView === 'dashboard' && <DashboardHome />}
      {activeView === 'planner' && <PlannerView />}
      {activeView === 'fridge' && <FridgeView />}
      {activeView === 'shop' && <ShopView />}
    </DashboardLayout>
  );
}
