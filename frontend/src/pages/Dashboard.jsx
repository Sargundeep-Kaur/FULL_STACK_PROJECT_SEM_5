import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import FilterBar from '../components/FilterBar';
import TaskModal from '../components/TaskModal';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: '',
  });

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.priority !== 'all') params.priority = filters.priority;
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.search) params.search = filters.search;

      const hasActiveFilters = Object.keys(params).length > 0;
      if (hasActiveFilters) {
        const [filteredRes, allRes] = await Promise.all([
          api.get('/tasks', { params }),
          api.get('/tasks'),
        ]);
        setTasks(filteredRes.data);
        setAllTasks(allRes.data);
      } else {
        const { data } = await api.get('/tasks');
        setTasks(data);
        setAllTasks(data);
      }
    } catch (err) {
      showToast('Failed to fetch tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(fetchTasks, 300);
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFilterChange = (key, value) => {
    setFilters((p) => ({ ...p, [key]: value }));
  };

  const handleNewTask = () => {
    setEditTask(null);
    setShowModal(true);
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditTask(null);
  };

  const handleSave = async (formData) => {
    setModalLoading(true);
    try {
      if (editTask) {
        await api.put(`/tasks/${editTask._id}`, formData);
        showToast('Task updated successfully!');
      } else {
        await api.post('/tasks', formData);
        showToast('Task created successfully!');
      }
      handleCloseModal();
      fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      setAllTasks((prev) => prev.filter((t) => t._id !== id));
      showToast('Task deleted');
    } catch {
      showToast('Failed to delete task', 'error');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, { status: newStatus });
      setTasks((prev) =>
        filters.status !== 'all' && filters.status !== newStatus
          ? prev.filter((t) => t._id !== id)
          : prev.map((t) => (t._id === id ? data : t))
      );
      setAllTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
      showToast(`Status → ${newStatus}`);
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  // Compute counts for filter bar
  const counts = {
    all: allTasks.length,
    todo: allTasks.filter((t) => t.status === 'todo').length,
    'in-progress': allTasks.filter((t) => t.status === 'in-progress').length,
    done: allTasks.filter((t) => t.status === 'done').length,
  };

  // Stats
  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = allTasks.filter((t) => t.status === 'in-progress').length;
  const highPriority = allTasks.filter((t) => t.priority === 'high' && t.status !== 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div style={styles.page}>
      <Navbar onNewTask={handleNewTask} />

      <main style={styles.main}>
        {/* Welcome & Stats */}
        <section style={styles.heroSection}>
          <div>
            <h1 style={styles.welcome}>
              Good {getTimeOfDay()},{' '}
              <span style={styles.nameGradient}>{user?.name?.split(' ')[0]} 👋</span>
            </h1>
            <p style={{ color: '#94a3b8', marginTop: 6 }}>
              {totalTasks === 0
                ? "You have no tasks yet. Create your first one!"
                : `You have ${totalTasks - doneTasks} task${totalTasks - doneTasks !== 1 ? 's' : ''} remaining.`}
            </p>
          </div>

          {/* Stat Cards */}
          <div style={styles.statsRow}>
            <StatCard
              icon="📋"
              label="Total"
              value={totalTasks}
              color="#7c3aed"
            />
            <StatCard
              icon="⚡"
              label="In Progress"
              value={inProgressTasks}
              color="#06b6d4"
            />
            <StatCard
              icon="✅"
              label="Done"
              value={doneTasks}
              color="#22c55e"
            />
            <StatCard
              icon="🔥"
              label="High Priority"
              value={highPriority}
              color="#ef4444"
            />
          </div>

          {/* Progress Bar */}
          {totalTasks > 0 && (
            <div style={styles.progressWrap}>
              <div style={styles.progressHeader}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Overall Progress</span>
                <span style={{ color: '#c4b5fd', fontWeight: 700 }}>{completionRate}%</span>
              </div>
              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${completionRate}%`,
                  }}
                />
              </div>
            </div>
          )}
        </section>

        {/* Filter Bar */}
        <section style={styles.filterSection}>
          <FilterBar
            filters={filters}
            onChange={handleFilterChange}
            counts={counts}
          />
        </section>

        {/* Task Grid */}
        <section>
          {loading ? (
            <div style={styles.center}>
              <div className="spinner" style={{ width: 48, height: 48 }} />
              <p style={{ color: '#64748b', marginTop: 16 }}>Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState onNewTask={handleNewTask} hasFilters={Object.values(filters).some(v => v && v !== 'all')} />
          ) : (
            <div style={styles.grid}>
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal */}
      {showModal && (
        <TaskModal
          task={editTask}
          onClose={handleCloseModal}
          onSave={handleSave}
          loading={modalLoading}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          id="toast-notification"
          className={`alert ${toast.type === 'error' ? 'alert-error' : 'alert-success'}`}
          style={styles.toast}
        >
          {toast.type === 'error' ? '❌' : '✅'} {toast.message}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ ...styles.statCard, borderColor: `${color}30` }}>
      <div style={{ ...styles.statIcon, background: `${color}18`, color }}>
        {icon}
      </div>
      <div>
        <div style={{ ...styles.statValue, color }}>{value}</div>
        <div style={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
}

function EmptyState({ onNewTask, hasFilters }) {
  return (
    <div style={styles.empty}>
      <div style={styles.emptyIcon}>
        {hasFilters ? '🔍' : '✨'}
      </div>
      <h3 style={{ color: '#f1f5f9', marginBottom: 8 }}>
        {hasFilters ? 'No tasks match your filters' : 'No tasks yet!'}
      </h3>
      <p style={{ color: '#64748b', marginBottom: 20, fontSize: '0.9rem' }}>
        {hasFilters
          ? 'Try adjusting your search or filters.'
          : 'Create your first task to get started.'}
      </p>
      {!hasFilters && (
        <button id="empty-new-task-btn" className="btn btn-primary" onClick={onNewTask}>
          + Create First Task
        </button>
      )}
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

const styles = {
  page: {
    minHeight: '100vh',
  },
  main: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '32px 24px 60px',
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
  },
  heroSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  welcome: {
    fontSize: 'clamp(1.4rem, 3vw, 2rem)',
    fontWeight: 700,
    color: '#f1f5f9',
  },
  nameGradient: {
    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  statsRow: {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: '1 1 130px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid',
    borderRadius: 14,
    padding: '16px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    backdropFilter: 'blur(10px)',
    transition: 'all 0.25s',
    minWidth: 120,
  },
  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    flexShrink: 0,
  },
  statValue: {
    fontSize: '1.6rem',
    fontWeight: 800,
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#64748b',
    fontWeight: 500,
    marginTop: 3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  progressWrap: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '14px 18px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressTrack: {
    height: 8,
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
    borderRadius: 100,
    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 0 10px rgba(124,58,237,0.5)',
  },
  filterSection: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: '18px 20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 16,
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: 16,
    animation: 'float 3s ease-in-out infinite',
    display: 'inline-block',
  },
  toast: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 2000,
    minWidth: 240,
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    animation: 'slideUp 0.3s ease',
  },
};
