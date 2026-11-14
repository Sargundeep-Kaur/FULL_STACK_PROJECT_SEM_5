export default function FilterBar({ filters, onChange, counts }) {
  const statusOptions = [
    { value: 'all', label: 'All', icon: '🗂️' },
    { value: 'todo', label: 'To Do', icon: '○' },
    { value: 'in-progress', label: 'In Progress', icon: '◑' },
    { value: 'done', label: 'Done', icon: '●' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: '🔴 High' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'low', label: '🟢 Low' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'work', label: '💼 Work' },
    { value: 'personal', label: '🏠 Personal' },
    { value: 'health', label: '❤️ Health' },
    { value: 'learning', label: '📚 Learning' },
    { value: 'other', label: '📌 Other' },
  ];

  return (
    <div style={styles.wrapper}>
      {/* Search */}
      <div style={styles.searchWrap}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          id="task-search"
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
          style={styles.searchInput}
          className="form-control"
        />
      </div>

      {/* Status pills */}
      <div style={styles.pills}>
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            id={`filter-status-${opt.value}`}
            onClick={() => onChange('status', opt.value)}
            style={{
              ...styles.pill,
              ...(filters.status === opt.value ? styles.pillActive : {}),
            }}
          >
            <span>{opt.icon}</span>
            <span>{opt.label}</span>
            {counts && counts[opt.value] !== undefined && (
              <span style={styles.count}>{counts[opt.value]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Dropdowns */}
      <div style={styles.dropdowns}>
        <select
          id="filter-priority"
          className="form-control"
          value={filters.priority}
          onChange={(e) => onChange('priority', e.target.value)}
          style={styles.select}
        >
          {priorityOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          id="filter-category"
          className="form-control"
          value={filters.category}
          onChange={(e) => onChange('category', e.target.value)}
          style={styles.select}
        >
          {categoryOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 14,
    alignItems: 'center',
  },
  searchWrap: {
    position: 'relative',
    flex: '1 1 220px',
    minWidth: 200,
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1rem',
    pointerEvents: 'none',
  },
  searchInput: {
    paddingLeft: 40,
    width: '100%',
  },
  pills: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  pill: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '8px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: '#94a3b8',
    fontSize: '0.82rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'Inter, sans-serif',
  },
  pillActive: {
    background: 'rgba(124,58,237,0.2)',
    border: '1px solid rgba(124,58,237,0.5)',
    color: '#c4b5fd',
  },
  count: {
    background: 'rgba(255,255,255,0.1)',
    padding: '1px 7px',
    borderRadius: 10,
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#f1f5f9',
  },
  dropdowns: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  select: {
    minWidth: 150,
    padding: '8px 12px',
    fontSize: '0.85rem',
  },
};
