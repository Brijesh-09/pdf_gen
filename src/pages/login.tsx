// pages/login.tsx

import { useState, FormEvent } from 'react';
import styles from '../styles/Login.module.css';
import {useRouter} from 'next/router';
import Cookies from 'universal-cookie';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const cookies = new Cookies();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(baseUrl+'/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      cookies.set('authToken', result.token, { path: '/' });
      router.push('/dashboard');
    } catch (error:any) {
      setError(error?.message);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Login</h1>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.button}>Login</button>
      </form>
    </div>
  );
};

export default Login;
