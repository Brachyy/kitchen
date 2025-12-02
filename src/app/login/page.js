"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useState } from 'react';

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push('/planner');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome to Kitchen</h1>
        <p className={styles.subtitle}>Sign in to manage your weekly meal plan</p>
        
        {error && <p className={styles.error}>{error}</p>}
        
        <button onClick={handleGoogleLogin} className={styles.googleBtn}>
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google logo" 
            className={styles.googleIcon}
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
