import { useAuth } from '../context/AuthContext';

const CATEGORY_COLORS = {
  work: '#7c3aed',
  personal: '#ec4899',
  health: '#22c55e',
  learning: '#f59e0b',
  other: '#64748b',
};

const CATEGORY_ICONS = {
  work: '💼',
  personal: '🏠',
  health: '❤️',
  learning: '📚',
  other: '📌',
};

export default function Navbar({ onNewTask }) {
  const { user, logout } = useAuth();

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>TaskFlow</span>
        </div>

        {/* Right side */}
        <div style={styles.right}>
          <button
            id="new-task-btn"
            className="btn btn-primary"
            onClick={onNewTask}
            style={{ gap: 8 }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
            New Task
          </button>

          <div style={styles.userArea}>
            <div style={styles.avatar}>{initials}</div>
            <div style={styles.userInfo}>
              <span style={styles.userName}>{user?.name}</span>
              <span style={styles.userEmail}>{user?.email}</span>
            </div>
          </div>

          <button
            id="logout-btn"
            onClick={logout}
            className="btn btn-secondary btn-sm"
            title="Logout"
          >
            <span>→</span> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(10,10,26,0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    padding: '0 24px',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  logoIcon: {
    fontSize: 24,
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  userArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.8rem',
    color: 'white',
    flexShrink: 0,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#f1f5f9',
    lineHeight: 1,
  },
  userEmail: {
    fontSize: '0.72rem',
    color: '#64748b',
    lineHeight: 1,
  },
};
