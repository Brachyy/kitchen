"use client";
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import styles from './LoginView.module.css';

export default function LoginView() {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          Kitchen<span>AI</span>
        </div>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Your smart kitchen assistant awaits.</p>
        
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
