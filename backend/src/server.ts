// Fix: Use a default import for express to resolve type conflicts.
// Fix: Import Request and Response types directly from express to resolve type errors.
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Fix: Import `exit` from `process` to explicitly bring in Node.js types and resolve errors with `process.exit`.
import { exit } from 'process';


dotenv.config();

// --- Environment Variable Check ---
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error(`FATAL ERROR: Missing required environment variables: ${missingEnvVars.join(', ')}`);
    // Fix: Use the imported `exit` function to avoid a TypeScript type error where `process.exit` was not defined.
    exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET as string;


app.use(cors());
app.use(express.json());


// --- TypeScript Type Augmentation for Express Request ---
// This allows us to attach the decoded user payload to the request object
// by augmenting the global Express Request type.

interface UserPayload {
    userId: number;
    email: string;
    role: string;
}

declare global {
    namespace Express {
        export interface Request {
            user?: UserPayload;
        }
    }
}


// --- AUTHENTICATION MIDDLEWARE ---
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded as UserPayload;
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
    return next();
};

const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => {
        if (req.user?.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Requires Admin Role!' });
        }
    });
};


// --- AUTH API ROUTES ---

app.post('/api/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string' || password.length < 1) {
        return res.status(400).json({ message: 'A valid email and password are required' });
    }

    try {
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await db.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, role',
            [email, passwordHash]
        );
        
        const user = newUser.rows[0];
        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});


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

        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        
        res.json({ message: 'Login successful', token });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});


app.get('/api/session', (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.json({ loggedIn: false });
        jwt.verify(token, JWT_SECRET);
        res.json({ loggedIn: true });
    } catch (error) {
        res.json({ loggedIn: false });
    }
});

// --- USER ORDER ROUTES ---

app.post('/api/orders', verifyToken, async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Cart items are required.' });
    }

    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const orderResult = await client.query(
            'INSERT INTO orders (user_id) VALUES ($1) RETURNING id',
            [userId]
        );
        const orderId = orderResult.rows[0].id;

        const itemInsertPromises = items.map((item: {id: number; title: string; image: string; }) => {
            const { id, title, image } = item;
            return client.query(
                'INSERT INTO order_items (order_id, service_id, service_title, service_image) VALUES ($1, $2, $3, $4)',
                [orderId, id, title, image]
            );
        });

        await Promise.all(itemInsertPromises);
        
        await client.query('COMMIT');
        res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Server error during order creation' });
    } finally {
        client.release();
    }
});

app.get('/api/orders', verifyToken, async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    try {
        const ordersResult = await db.query(
          'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
          [userId]
        );
        const orders = ordersResult.rows;

        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const itemsResult = await db.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
            return { ...order, items: itemsResult.rows };
        }));

        res.json(ordersWithItems);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: 'Server error fetching orders' });
    }
});


// --- ADMIN ROUTES ---

app.get('/api/admin/orders', verifyAdmin, async (req: Request, res: Response) => {
    try {
        // Fix: Added an empty array as the second argument to match the 'query' function signature which expects a 'params' array.
        const ordersResult = await db.query(`
            SELECT o.id, o.status, o.created_at, u.email as user_email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `, []);
        const orders = ordersResult.rows;

        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const itemsResult = await db.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
            return { ...order, items: itemsResult.rows };
        }));

        res.json(ordersWithItems);
    } catch (error) {
        console.error('Admin get orders error:', error);
        res.status(500).json({ message: 'Server error fetching all orders' });
    }
});

app.put('/api/admin/orders/:orderId', verifyAdmin, async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    try {
        const result = await db.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, orderId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.json({ message: 'Order status updated successfully', order: result.rows[0] });
    } catch (error) {
        console.error('Admin update order status error:', error);
        res.status(500).json({ message: 'Server error updating order status' });
    }
});



// Health check route for Render
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

// --- Database and Server Initialization ---

async function initializeDatabase() {
  try {
    // Note: To make a user an admin, you would run this SQL manually in your database:
    // UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'user',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await db.query(createUsersTableQuery, []);

    const createOrdersTableQuery = `
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await db.query(createOrdersTableQuery, []);

    const createOrderItemsTableQuery = `
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        service_id INTEGER NOT NULL,
        service_title VARCHAR(255) NOT NULL,
        service_image VARCHAR(255)
      );
    `;
    await db.query(createOrderItemsTableQuery, []);

    console.log("Database initialized: tables are ready.");
  } catch (error) {
    console.error("FATAL ERROR: Could not initialize database:", error);
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
