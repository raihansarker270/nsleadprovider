// Fix: Use a default import for express to resolve type conflicts.
// Fix: Import Request and Response types directly from express to resolve type errors.
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Fix: Import `exit` from `process` to explicitly bring in Node.js types and resolve errors with `process.exit`.
import { exit } from 'process';


// Placeholder for future API route imports
// import authRoutes from './api/auth';
// import cartRoutes from './api/cart';
// import orderRoutes from './api/orders';


dotenv.config();

// --- Environment Variable Check ---
// Ensures the server fails fast if essential configuration is missing.
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error(`FATAL ERROR: Missing required environment variables: ${missingEnvVars.join(', ')}`);
    console.error('Please set these variables in your deployment environment.');
    // Fix: Use the imported `exit` function to avoid a TypeScript type error where `process.exit` was not defined.
    exit(1); // Exit with a non-zero code to indicate failure
}


// Rely on type inference for the express app.
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET as string;


app.use(cors());
app.use(express.json());

// --- API ROUTES ---

// Fix: Use Request and Response types from express.
app.post('/api/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await db.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
            [email, passwordHash]
        );
        
        const token = jwt.sign({ userId: newUser.rows[0].id, email: newUser.rows[0].email }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});


// Fix: Use Request and Response types from express.
app.post('/api/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
     if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
        
        res.json({ message: 'Login successful', token });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// A protected route to check session
// Fix: Use Request and Response types from express.
app.get('/api/session', (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.json({ loggedIn: false });
        }
        
        jwt.verify(token, JWT_SECRET);
        res.json({ loggedIn: true });

    } catch (error) {
        res.json({ loggedIn: false });
    }
});

// Health check route for Render
// Fix: Use Request and Response types from express.
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

// --- Database and Server Initialization ---

async function initializeDatabase() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await db.query(createTableQuery, []);
    console.log("Database initialized: 'users' table is ready.");
  } catch (error) {
    console.error("FATAL ERROR: Could not initialize database:", error);
    // Fix: Use the imported `exit` function to avoid a TypeScript type error where `process.exit` was not defined.
    exit(1);
  }
}

async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();