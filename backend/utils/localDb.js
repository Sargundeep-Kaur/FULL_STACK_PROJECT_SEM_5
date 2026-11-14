const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const DB_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return { users: [], tasks: [] };
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { users: [], tasks: [] };
  }
}

function writeDb(data) {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

const LocalUser = {
  async findOne( filter ) {
    const db = readDb();
    const user = db.users.find((u) => {
      if (filter.email) return u.email.toLowerCase() === filter.email.toLowerCase();
      if (filter._id) return u._id === filter._id;
      return false;
    });
    if (!user) return null;
    return {
      ...user,
      async matchPassword(enteredPassword) {
        return bcrypt.compare(enteredPassword, user.password);
      },
    };
  },

  async findById(id) {
    const db = readDb();
    const user = db.users.find((u) => u._id === String(id));
    if (!user) return null;
    const { password, ...withoutPassword } = user;
    return withoutPassword;
  },

  async create({ name, email, password }) {
    const db = readDb();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const now = new Date().toISOString();
    const newUser = {
      _id: generateId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      avatar: '',
      createdAt: now,
      updatedAt: now,
    };
    db.users.push(newUser);
    writeDb(db);
    return newUser;
  },
};

const LocalTask = {
  async find(query = {}) {
    const db = readDb();
    let results = db.tasks.filter((t) => String(t.user) === String(query.user));

    if (query.status) {
      results = results.filter((t) => t.status === query.status);
    }
    if (query.priority) {
      results = results.filter((t) => t.priority === query.priority);
    }
    if (query.category) {
      results = results.filter((t) => t.category === query.category);
    }
    if (query.title && query.title.$regex) {
      const regex = new RegExp(query.title.$regex, query.title.$options || '');
      results = results.filter((t) => regex.test(t.title));
    }

    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findById(id) {
    const db = readDb();
    const task = db.tasks.find((t) => t._id === String(id));
    if (!task) return null;
    return {
      ...task,
      async deleteOne() {
        const currentDb = readDb();
        currentDb.tasks = currentDb.tasks.filter((t) => t._id !== String(id));
        writeDb(currentDb);
      },
    };
  },

  async create(data) {
    const db = readDb();
    const now = new Date().toISOString();
    const newTask = {
      _id: generateId(),
      user: String(data.user),
      title: data.title.trim(),
      description: data.description ? data.description.trim() : '',
      priority: data.priority || 'medium',
      category: data.category || 'other',
      status: data.status || 'todo',
      dueDate: data.dueDate || null,
      createdAt: now,
      updatedAt: now,
    };
    db.tasks.push(newTask);
    writeDb(db);
    return newTask;
  },

  async findByIdAndUpdate(id, updates) {
    const db = readDb();
    const idx = db.tasks.findIndex((t) => t._id === String(id));
    if (idx === -1) return null;

    const updated = {
      ...db.tasks[idx],
      ...updates,
      _id: db.tasks[idx]._id,
      user: db.tasks[idx].user,
      updatedAt: new Date().toISOString(),
    };
    db.tasks[idx] = updated;
    writeDb(db);
    return updated;
  },
};

module.exports = { LocalUser, LocalTask };
