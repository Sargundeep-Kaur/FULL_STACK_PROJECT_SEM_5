import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    clearError();
    setLocalError('');
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setLocalError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }
    const ok = await register(form.name, form.email, form.password);
    if (ok) navigate('/dashboard');
  };

  const displayError = localError || error;

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>TaskFlow</span>
        </div>

        <h1 style={styles.title}>Create account</h1>
        <p style={styles.subtitle}>Start managing your tasks for free</p>

        {displayError && <div className="alert alert-error mt-2">{displayError}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              type="text"
              name="name"
              className="form-control"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
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
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              name="password"
              className="form-control"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm">Confirm Password</label>
            <input
              id="reg-confirm"
              type="password"
              name="confirm"
              className="form-control"
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            id="register-submit"
            type="submit"
            className="btn btn-primary btn-full mt-2"
            disabled={loading}
            style={{ padding: '14px', fontSize: '1rem' }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>

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
    gap: 16,
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
    background: 'rgba(236,72,153,0.12)',
    top: '-100px',
    right: '-100px',
  },
  orb2: {
    width: 300,
    height: 300,
    background: 'rgba(124,58,237,0.1)',
    bottom: '-80px',
    left: '-80px',
  },
};
