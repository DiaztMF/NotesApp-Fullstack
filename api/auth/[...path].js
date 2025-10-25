// api/auth/[...path].js
// Handler untuk authentication dan profile management

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { path = [] } = req.query;
    const method = req.method;
    const endpoint = path[0]; // 'login' atau 'me'

    // ==========================================
    // 🔐 LOGIN - POST /api/auth/login
    // ==========================================
    if (method === 'POST' && endpoint === 'login') {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          message: "Email dan password wajib diisi" 
        });
      }

      // Validasi environment variables
      if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_CLIENT_ID || !process.env.AUTH0_CLIENT_SECRET) {
        return res.status(500).json({ 
          message: "Auth0 configuration missing" 
        });
      }

      try {
        const response = await fetch(
          `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              grant_type: "password",
              username: email,
              password: password,
              audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
              client_id: process.env.AUTH0_CLIENT_ID,
              client_secret: process.env.AUTH0_CLIENT_SECRET,
              connection: "Username-Password-Authentication",
              scope: "openid profile email"
            }),
          }
        );

        const data = await response.json();

        // Jika Auth0 return error
        if (!response.ok) {
          return res.status(response.status).json(data);
        }

        return res.json(data);
      } catch (err) {
        console.error("Auth0 login error:", err);
        return res.status(500).json({ 
          message: "Login failed", 
          error: err.message 
        });
      }
    }

    // ==========================================
    // 👤 GET PROFILE - GET /api/auth/me
    // ==========================================
    if (method === 'GET' && endpoint === 'me') {
      const auth = req.headers.authorization;

      if (!auth) {
        return res.status(401).json({ 
          message: "No token provided" 
        });
      }

      // Validasi environment variables
      if (!process.env.AUTH0_DOMAIN) {
        return res.status(500).json({ 
          message: "Auth0 configuration missing" 
        });
      }

      try {
        const response = await fetch(
          `https://${process.env.AUTH0_DOMAIN}/userinfo`,
          { 
            headers: { Authorization: auth } 
          }
        );

        const profile = await response.json();

        // Jika Auth0 return error
        if (!response.ok) {
          return res.status(response.status).json(profile);
        }

        return res.json(profile);
      } catch (err) {
        console.error("Auth0 profile error:", err);
        return res.status(500).json({ 
          message: "Failed to fetch profile",
          error: err.message 
        });
      }
    }

    // Default: endpoint not found
    return res.status(404).json({ 
      error: "Endpoint tidak ditemukan",
      availableEndpoints: [
        "POST /api/auth/login",
        "GET /api/auth/me"
      ]
    });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ 
      error: "Internal server error", 
      message: err.message 
    });
  }
}