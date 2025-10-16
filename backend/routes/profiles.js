import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/me", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token provided" });

  try {
    const response = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      { headers: { Authorization: auth } }
    );

    const profile = await response.json();
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

export default router;
