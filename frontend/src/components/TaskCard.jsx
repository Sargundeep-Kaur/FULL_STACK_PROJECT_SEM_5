const PRIORITY_CONFIG = {
  low: { label: 'Low', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', dot: '🟢' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', dot: '🟡' },
  high: { label: 'High', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', dot: '🔴' },
};

const STATUS_CONFIG = {
  todo: { label: 'To Do', color: '#64748b', bg: 'rgba(100,116,139,0.12)', icon: '○' },
  'in-progress': { label: 'In Progress', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', icon: '◑' },
  done: { label: 'Done', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', icon: '●' },
};

const CATEGORY_CONFIG = {
  work: { label: 'Work', icon: '💼', color: '#7c3aed' },
  personal: { label: 'Personal', icon: '🏠', color: '#ec4899' },
  health: { label: 'Health', icon: '❤️', color: '#22c55e' },
  learning: { label: 'Learning', icon: '📚', color: '#f59e0b' },
  other: { label: 'Other', icon: '📌', color: '#64748b' },
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const dueDay = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = dueDay - today;
  const days = Math.round(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return { text: 'Overdue', color: '#ef4444' };
  if (days === 0) return { text: 'Due today', color: '#f59e0b' };
  if (days === 1) return { text: 'Due tomorrow', color: '#f59e0b' };
  return { text: `Due in ${days} days`, color: '#94a3b8' };
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
  const category = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.other;
  const dueInfo = formatDate(task.dueDate);

  const statusOptions = ['todo', 'in-progress', 'done'];

  const cycleStatus = () => {
    const idx = statusOptions.indexOf(task.status);
    const next = statusOptions[(idx + 1) % statusOptions.length];
    onStatusChange(task._id, next);
  };

  return (
    <div className="card" style={styles.card}>
      {/* Priority bar */}
      <div style={{ ...styles.priorityBar, background: priority.color }} />

      <div style={styles.body}>
        {/* Header Row */}
        <div style={styles.headerRow}>
          <div style={styles.categoryBadge}>
            <span>{category.icon}</span>
            <span style={{ color: category.color, fontWeight: 600, fontSize: '0.75rem' }}>
              {category.label}
            </span>
          </div>
          <div style={styles.actions}>
            <button
              id={`edit-task-${task._id}`}
              className="btn btn-secondary btn-sm"
              onClick={() => onEdit(task)}
              title="Edit task"
              style={styles.iconBtn}
            >
              ✏️
            </button>
            <button
              id={`delete-task-${task._id}`}
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(task._id)}
              title="Delete task"
              style={styles.iconBtn}
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          ...styles.title,
          textDecoration: task.status === 'done' ? 'line-through' : 'none',
          opacity: task.status === 'done' ? 0.6 : 1,
        }}>
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p style={styles.description}>{task.description}</p>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          {/* Priority badge */}
          <span style={{ ...styles.chip, background: priority.bg, color: priority.color, borderColor: `${priority.color}40` }}>
            {priority.dot} {priority.label}
          </span>

          {/* Status - clickable to cycle */}
          <button
            id={`status-${task._id}`}
            onClick={cycleStatus}
            title="Click to change status"
            style={{ ...styles.chip, ...styles.statusChip, background: status.bg, color: status.color, borderColor: `${status.color}40` }}
          >
            {status.icon} {status.label}
          </button>

          {/* Due date */}
          {dueInfo && (
            <span style={{ ...styles.chip, color: dueInfo.color, background: 'transparent', border: 'none', fontSize: '0.72rem', padding: '2px 4px' }}>
              📅 {dueInfo.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideUp 0.3s ease',
  },
  priorityBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '3px',
    height: '100%',
    borderRadius: '16px 0 0 16px',
  },
  body: {
    padding: '18px 20px 18px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  categoryBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
  actions: {
    display: 'flex',
    gap: 6,
    transition: 'opacity 0.2s',
  },
  iconBtn: {
    padding: '4px 8px',
    fontSize: '0.8rem',
    lineHeight: 1,
  },
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#f1f5f9',
    lineHeight: 1.4,
  },
  description: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  footer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: '0.72rem',
    fontWeight: 600,
    border: '1px solid',
    letterSpacing: '0.3px',
    textTransform: 'capitalize',
  },
  statusChip: {
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.2s',
  },
};
