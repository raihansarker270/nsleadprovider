// Fix: Switch to default import for express and import Request, Response types to resolve type conflicts.
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// Placeholder for future API route imports
// import authRoutes from './api/auth';
// import cartRoutes from './api/cart';
// import orderRoutes from './api/orders';


dotenv.config();

// Fix: Explicitly type `app` as `express.Express` to ensure correct type inference for middleware and route handlers.
const app: express.Express = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-is-long';


/*
IMPORTANT: Before running, ensure you have a 'users' table in your PostgreSQL database.
You can create it with the following SQL command:

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

*/

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

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});