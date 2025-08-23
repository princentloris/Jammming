const express = require('express');
const fetch = require('node-fetch'); // Add this import for older Node.js versions
const app = express();
const port = 3001;

// Add your Spotify credentials here
const CLIENT_ID = '8e2ecafb93f54b8fb34fb647f756cb47';
const CLIENT_SECRET = 'c119c9372f89407bbb23f63c9251b78c';

// Add CORS headers BEFORE other middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Middleware to parse JSON requests
app.use(express.json());

// Test route - just to make sure server is working
app.get('/test', (req, res) => {
    res.json({ message: 'Backend server is working!' });
});

// Route to exchange authorization code for access token
app.post('/exchange-code', async (req, res) => {
    try {
        const { code } = req.body;
        
        if (!code) {
            return res.status(400).json({ error: 'No authorization code provided' });
        }
        
        // Make actual request to Spotify's token endpoint
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'http://127.0.0.1:5173'
            })
        });
        
        const data = await response.json();
        
        if (data.access_token) {
            res.json({
                access_token: data.access_token,
                expires_in: data.expires_in
            });
        } else {
            console.error('Spotify error:', data);
            res.status(400).json({ error: 'Failed to get token from Spotify', details: data });
        }
        
    } catch (error) {
        console.error('Error in /exchange-code route:', error);
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});