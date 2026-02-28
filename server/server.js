import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------------- PATH SETUP ---------------- */

// Needed for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "..", "users.json");

/* ---------------- MIDDLEWARE ---------------- */

// Parse JSON body
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, "..")));

// Request Logger (Focused on POST as requested)
app.use((req, res, next) => {
  if (req.method === "POST") {
    console.log(`[${new Date().toLocaleTimeString()}] POST request received: ${req.url}`);
  }
  next();
});

// Default route to serve login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "login.html"));
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

// Removed health check because static files are now served from /

// REGISTER
app.post("/users", async (req, res) => {
  console.log("  -> Processing Registration request");
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

    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      id: Date.now(),
      firstname,
      lastname,
      email,
      password: hashedPassword,
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
  console.log(`[${new Date().toLocaleTimeString()}] Processing Login request`);
  try {
    const { email, password } = req.body;
    const users = await getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "LOGIN_SUCCESS" });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// FORGOT PASSWORD
app.post("/forgotpass", async (req, res) => {
  console.log(`[${new Date().toLocaleTimeString()}] Processing Forgot Password request`);
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

app.post("/setpassword", async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await getUsers();

    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ message: "Email Not Found" });
    }

    // Check if new password is same as old password
    const isSame = await bcrypt.compare(password, user.password);
    if (isSame) {
      return res.status(400).json({ message: "Password is same" });
    }

    const saltRounds = 10;
    user.password = await bcrypt.hash(password, saltRounds);

    await saveUsers(users);

    return res.status(200).json({ message: "Password Changed" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
/* ---------------- SERVER START ---------------- */

initializeDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});