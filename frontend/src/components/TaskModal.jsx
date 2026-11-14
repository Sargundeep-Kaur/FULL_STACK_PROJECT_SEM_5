import { useState, useEffect } from 'react';

const defaultForm = {
  title: '',
  description: '',
  priority: 'medium',
  category: 'other',
  status: 'todo',
  dueDate: '',
};

export default function TaskModal({ task, onClose, onSave, loading }) {
  const [form, setForm] = useState(defaultForm);
  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        category: task.category || 'other',
        status: task.status || 'todo',
        dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [task]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.dueDate) payload.dueDate = null;
    onSave(payload);
  };

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box">
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>
            {isEditing ? '✏️ Edit Task' : '✨ New Task'}
          </h2>
          <button
            id="modal-close-btn"
            onClick={onClose}
            style={styles.closeBtn}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="task-title">Task Title *</label>
            <input
              id="task-title"
              type="text"
              name="title"
              className="form-control"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              name="description"
              className="form-control"
              placeholder="Add details (optional)..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Row: Priority + Category */}
          <div style={styles.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                name="priority"
                className="form-control"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="task-category">Category</label>
              <select
                id="task-category"
                name="category"
                className="form-control"
                value={form.category}
                onChange={handleChange}
              >
                <option value="work">💼 Work</option>
                <option value="personal">🏠 Personal</option>
                <option value="health">❤️ Health</option>
                <option value="learning">📚 Learning</option>
                <option value="other">📌 Other</option>
              </select>
            </div>
          </div>

          {/* Row: Status + Due Date */}
          <div style={styles.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="task-status">Status</label>
              <select
                id="task-status"
                name="status"
                className="form-control"
                value={form.status}
                onChange={handleChange}
              >
                <option value="todo">○ To Do</option>
                <option value="in-progress">◑ In Progress</option>
                <option value="done">● Done</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="task-duedate">Due Date</label>
              <input
                id="task-duedate"
                type="date"
                name="dueDate"
                className="form-control"
                value={form.dueDate}
                onChange={handleChange}
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button
              id="modal-cancel-btn"
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              id="modal-save-btn"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ minWidth: 120 }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Saving...
                </>
              ) : isEditing ? (
                '💾 Update Task'
              ) : (
                '✨ Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#f1f5f9',
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#94a3b8',
    width: 32,
    height: 32,
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    fontFamily: 'Inter, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  row: {
    display: 'flex',
    gap: 14,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
};
