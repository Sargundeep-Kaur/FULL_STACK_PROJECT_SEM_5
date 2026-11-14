import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    clearError();
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(form.email, form.password);
    if (ok) navigate('/dashboard');
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>TaskFlow</span>
        </div>

        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Sign in to your account to continue</p>

        {error && <div className="alert alert-error mt-2">{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              name="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              className="form-control"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary btn-full mt-2"
            disabled={loading}
            style={{ padding: '14px', fontSize: '1rem' }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p style={styles.switchText}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={styles.link}>Create one</Link>
        </p>

        {/* Demo hint */}
        <div style={styles.demo}>
          <span style={{ opacity: 0.6 }}>🔐 New here? </span>
          <Link to="/register" style={styles.link}>Register for free →</Link>
        </div>
      </div>

      {/* Decorative orbs */}
      <div style={{ ...styles.orb, ...styles.orb1 }} />
      <div style={{ ...styles.orb, ...styles.orb2 }} />
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20,
    backdropFilter: 'blur(20px)',
    padding: '48px 40px',
    width: '100%',
    maxWidth: 440,
    position: 'relative',
    zIndex: 1,
    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 60px rgba(124,58,237,0.1)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  logoIcon: {
    fontSize: 32,
    animation: 'float 3s ease-in-out infinite',
    display: 'inline-block',
  },
  logoText: {
    fontSize: '1.6rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#f1f5f9',
    marginBottom: 6,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '0.95rem',
    marginBottom: 28,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  switchText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '0.9rem',
    marginTop: 20,
  },
  link: {
    color: '#9d5cf6',
    fontWeight: 600,
    transition: 'color 0.2s',
  },
  demo: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: '0.85rem',
    color: '#64748b',
  },
  orb: {
    position: 'fixed',
    borderRadius: '50%',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },
  orb1: {
    width: 400,
    height: 400,
    background: 'rgba(124,58,237,0.15)',
    top: '-100px',
    left: '-100px',
  },
  orb2: {
    width: 300,
    height: 300,
    background: 'rgba(6,182,212,0.1)',
    bottom: '-80px',
    right: '-80px',
  },
};
