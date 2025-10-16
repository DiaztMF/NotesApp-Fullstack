import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

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
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;
