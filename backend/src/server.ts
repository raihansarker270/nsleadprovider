import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import db from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'dist')));

// --- Helper Functions & Middleware ---

const services = [
    { id: 1, title: 'Targeted Custom Contact List Building', description: 'Transform your outreach with our expertly curated, high-quality prospect contact lists.', image: '/images/services/service-1.png' },
    { id: 2, title: 'Data Entry & Web Research', description: 'Our Data Entry & Web Research service offers precise data finding & input.', image: '/images/services/service-2.png' },
    { id: 3, title: 'CRM Data Appending & Enrichment', description: 'Supercharge your CRM with our specialized email and phone number enrichment services.', image: '/images/services/service-3.png' },
    { id: 4, title: 'Verified Email Finding', description: 'Unlock verified email discovery with our specialized service.', image: '/images/services/service-4.png' },
    { id: 5, title: 'Phone Number Finding', description: 'Discover verified phone numbers with our dedicated service.', image: '/images/services/service-5.png' },
    { id: 6, title: 'Hire Dedicated Research Team', description: 'Expand your reach with our dedicated research team focused on prospect contact data.', image: '/images/services/service-6.png' },
    { id: 7, title: 'God Level Email Validation', description: 'Ensure flawless email validation with our ‘God Level’ service by sending test email 1 by 1 from public server.', image: '/images/services/service-7.png' },
    { id: 8, title: 'Email Personalization', description: 'We specialize in writing captivating opening lines for personalized emails.', image: '/images/services/service-8.png' },
    { id: 9, title: 'Apollo Data Scrapping', description: 'Get hassle-free Apollo.io data export, reformatting, cleaning, and validation at an unbeatable price!', image: '/images/services/service-9.png' },
    { id: 10, title: 'Done-For-You Cold Email Outreach', description: 'Effortlessly execute cold email outreach with our ‘Done-For-You’ service.', image: '/images/services/service-10.png' },
    { id: 11, title: 'Done-For-You Linkedin Outreach', description: 'Transform your outreach with our ‘Done-For-You’ Linkedin outreach service.', image: '/images/services/service-11.png' },
];

// Fix: Use declaration merging to extend the Express Request interface.
// This is the idiomatic way to add custom properties to `req` in Express with TypeScript
// and resolves issues where properties like `headers`, `body`, and `params` were not found.
declare global {
    namespace Express {
        interface Request {
            user?: { id: number };
        }
    }
}


const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication token required' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};


// --- API ROUTES ---

// Health Check
app.get('/api/health', (req, res) => res.status(200).send('OK'));

// Auth
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        const token = jwt.sign({ userId: newUser.rows[0].id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = userResult.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

app.get('/api/session', authMiddleware, (req: Request, res: Response) => {
    res.json({ loggedIn: true, userId: req.user?.id });
});

// Cart
app.get('/api/cart', authMiddleware, async (req: Request, res: Response) => {
    try {
        const cartResult = await db.query(
            `SELECT service_id FROM cart_items WHERE user_id = $1`,
            [req.user!.id]
        );
        const cartServiceIds = cartResult.rows.map(row => row.service_id);
        const cartServices = services.filter(s => cartServiceIds.includes(s.id));
        res.json(cartServices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
});

app.post('/api/cart', authMiddleware, async (req: Request, res: Response) => {
    const { serviceId } = req.body;
    try {
        await db.query(
            'INSERT INTO cart_items (user_id, service_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [req.user!.id, serviceId]
        );
        // Return updated cart
        const cartResult = await db.query('SELECT service_id FROM cart_items WHERE user_id = $1', [req.user!.id]);
        const cartServiceIds = cartResult.rows.map(row => row.service_id);
        const cartServices = services.filter(s => cartServiceIds.includes(s.id));
        res.status(201).json(cartServices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add item to cart' });
    }
});

app.delete('/api/cart/:serviceId', authMiddleware, async (req: Request, res: Response) => {
    const { serviceId } = req.params;
    try {
        await db.query(
            'DELETE FROM cart_items WHERE user_id = $1 AND service_id = $2',
            [req.user!.id, serviceId]
        );
        // Return updated cart
        const cartResult = await db.query('SELECT service_id FROM cart_items WHERE user_id = $1', [req.user!.id]);
        const cartServiceIds = cartResult.rows.map(row => row.service_id);
        const cartServices = services.filter(s => cartServiceIds.includes(s.id));
        res.json(cartServices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to remove item from cart' });
    }
});

// Orders
app.get('/api/orders', authMiddleware, async (req: Request, res: Response) => {
    try {
        const ordersResult = await db.query(
            `SELECT o.id, o.order_date, oi.service_id 
             FROM orders o
             JOIN order_items oi ON o.id = oi.order_id
             WHERE o.user_id = $1
             ORDER BY o.order_date DESC`,
            [req.user!.id]
        );

        const ordersMap: { [key: number]: any } = {};
        ordersResult.rows.forEach(row => {
            if (!ordersMap[row.id]) {
                ordersMap[row.id] = {
                    id: row.id,
                    order_date: row.order_date,
                    items: []
                };
            }
            const service = services.find(s => s.id === row.service_id);
            if (service) {
                ordersMap[row.id].items.push(service);
            }
        });

        res.json(Object.values(ordersMap));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

app.post('/api/orders', authMiddleware, async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const client = await (db as any).pool.connect();
    try {
        await client.query('BEGIN');
        
        const cartResult = await client.query('SELECT service_id FROM cart_items WHERE user_id = $1', [userId]);
        if (cartResult.rows.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }
        
        const newOrder = await client.query(
            'INSERT INTO orders (user_id) VALUES ($1) RETURNING id',
            [userId]
        );
        const orderId = newOrder.rows[0].id;

        const orderItemsQuery = 'INSERT INTO order_items (order_id, service_id) VALUES ' +
            cartResult.rows.map((_, i) => `($${2*i+1}, $${2*i+2})`).join(',');
        
        const orderItemsValues = cartResult.rows.flatMap(row => [orderId, row.service_id]);

        await client.query(orderItemsQuery, orderItemsValues);

        await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

        await client.query('COMMIT');
        res.status(201).json({ message: 'Order placed successfully', orderId });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Failed to place order' });
    } finally {
        client.release();
    }
});


// The "catchall" handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'dist', 'index.html'));
});


// Database schema initialization
const initializeDb = async () => {
  try {
    // Fix: Provide an empty array as the second argument for queries without parameters.
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `, []);
    // Fix: Provide an empty array as the second argument for queries without parameters.
    await db.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        service_id INTEGER NOT NULL,
        UNIQUE(user_id, service_id)
      );
    `, []);
    // Fix: Provide an empty array as the second argument for queries without parameters.
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `, []);
    // Fix: Provide an empty array as the second argument for queries without parameters.
    await db.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        service_id INTEGER NOT NULL
      );
    `, []);
    console.log('Database schema checked/initialized successfully.');
  } catch (error) {
    console.error('Error initializing database schema:', error);
  }
}


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  initializeDb();
});
