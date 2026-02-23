import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------------- PATH SETUP ---------------- */

// Needed for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "users.json");

/* ---------------- MIDDLEWARE ---------------- */

// Parse JSON body
app.use(express.json());

// Basic CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* ---------------- DATABASE FUNCTIONS ---------------- */

async function initializeDB() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, "[]");
  }
}

async function getUsers() {
  const data = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(data);
}

async function saveUsers(users) {
  await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));
}

/* ---------------- ROUTES ---------------- */

// Health check (important for deployment platforms)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Server running",
  });
});

// REGISTER
app.post("/users", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const users = await getUsers();
    const exists = users.find(u => u.email === email);

    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = {
      id: Date.now(),
      firstname,
      lastname,
      email,
      password,
      createdAt: new Date()
    };

    users.push(newUser);
    await saveUsers(users);

    res.status(201).json({ message: "Registered Successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "LOGIN_SUCCESS" });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// FORGOT PASSWORD
app.post("/forgotpass", async (req, res) => {
  try {
    const { email } = req.body;

    const users = await getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ message: "Email Not Found" });
    }

    res.status(200).json({ message: "Email Found" });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------- SERVER START ---------------- */

initializeDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});