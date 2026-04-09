import { Router } from 'express';
import jwt from 'jsonwebtoken';
const router = Router();
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
const JWT_SECRET = process.env.JWT_SECRET || 'codemate-dev-secret';
// Step 1: Redirect user to GitHub OAuth
router.get('/github', (req, res) => {
    const redirectUri = `${getBaseUrl(req)}/auth/github/callback`;
    const scopes = 'read:user';
    const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}`;
    res.redirect(url);
});
// Step 2: GitHub redirects back with a code
router.get('/github/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) {
        return res.status(400).json({ error: 'Missing code parameter' });
    }
    try {
        // Exchange code for access token
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code,
            }),
        });
        const tokenData = await tokenRes.json();
        if (!tokenData.access_token) {
            return res.status(400).json({ error: 'Failed to get access token', details: tokenData });
        }
        // Fetch GitHub user profile
        const userRes = await fetch('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const user = await userRes.json();
        // Create a JWT for the extension to store
        const token = jwt.sign({
            githubId: user.id,
            username: user.login,
            displayName: user.name || user.login,
            avatar: user.avatar_url,
        }, JWT_SECRET, { expiresIn: '30d' });
        // Return an HTML page that sends the token to the extension via URL fragment
        // The extension's launchWebAuthFlow will capture this URL
        const redirectUrl = `${getBaseUrl(req)}/auth/extension-callback#token=${token}`;
        res.redirect(redirectUrl);
    }
    catch (err) {
        console.error('GitHub OAuth error:', err);
        res.status(500).json({ error: 'OAuth failed', message: err.message });
    }
});
// Step 3: Final callback that the extension captures
// This just returns a simple page — the extension reads the token from the URL fragment
router.get('/extension-callback', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>CodeMate — Signed In</title></head>
    <body style="background:#0a0a12;color:#e2e2f0;font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
      <div style="text-align:center;">
        <div style="font-size:48px;margin-bottom:16px;">✅</div>
        <h2 style="color:#a78bfa;margin-bottom:8px;">Signed in to CodeMate!</h2>
        <p style="color:#6b7280;font-size:14px;">You can close this window now.</p>
      </div>
    </body>
    </html>
  `);
});
// Verify token endpoint — extension can call this to validate stored tokens
router.get('/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const token = authHeader.slice(7);
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({
            githubId: decoded.githubId,
            username: decoded.username,
            displayName: decoded.displayName,
            avatar: decoded.avatar,
        });
    }
    catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});
// Helper: verify JWT (used by socket handlers)
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch {
        return null;
    }
}
function getBaseUrl(req) {
    const proto = req.headers['x-forwarded-proto'] || req.protocol;
    return `${proto}://${req.get('host')}`;
}
export default router;
