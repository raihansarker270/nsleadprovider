

// Fix: Switch to default import for express and import Request, Response types to resolve type conflicts.
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Placeholder for future API route imports
// import authRoutes from './api/auth';
// import cartRoutes from './api/cart';
// import orderRoutes from './api/orders';


dotenv.config();

// Fix: Explicitly type `app` as `express.Express` to ensure correct type inference for middleware and route handlers.
const app: express.Express = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '..', 'dist')));


// --- API ROUTES ---
// In a real application, these would be in separate files.
// For simplicity, we are placing placeholder logic here.

// Mock user store
const users: any[] = []; 

// Fix: Use Request and Response types from express.
app.post('/api/register', async (req: Request, res: Response) => {
    // In a real app, you'd hash the password with bcrypt
    const { email, password } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = { id: Date.now(), email, password }; // Don't store plain passwords!
    users.push(newUser);
    // In a real app, you'd return a JWT
    res.status(201).json({ message: 'User registered successfully', token: 'fake-jwt-token' });
});


// Fix: Use Request and Response types from express.
app.post('/api/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', token: 'fake-jwt-token' });
});

// A protected route to check session
// Fix: Use Request and Response types from express.
app.get('/api/session', (req: Request, res: Response) => {
    // In a real app, you'd verify a JWT from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (token === 'fake-jwt-token') {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});


// The "catchall" handler: for any request that doesn't match one above,
// send back React's index.html file.
// Fix: Use Request and Response types from express.
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});