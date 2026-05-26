import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini AI Setup
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const genAI = geminiApiKey ? new GoogleGenAI({ 
    apiKey: geminiApiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  }) : null;

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Recommendation/Feed endpoint
  app.post("/api/ai/feed", async (req, res) => {
    if (!genAI) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    try {
      const { userContext, posts } = req.body;
      const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
      
      const prompt = `
        You are a social media recommendation engine for iTambayan.
        User Context: ${JSON.stringify(userContext)}
        Available Posts: ${JSON.stringify(posts)}
        
        Rank these posts based on user interests. Return a JSON array of post IDs in the order they should be shown.
        Return ONLY the JSON array.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Basic extraction of JSON array
      const matches = text.match(/\[.*\]/s);
      const rankedIds = matches ? JSON.parse(matches[0]) : [];
      
      res.json({ rankedIds });
    } catch (error) {
      console.error("AI Feed Error:", error);
      res.status(500).json({ error: "Failed to generate AI feed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`iTambayan Server running on http://localhost:${PORT}`);
  });
}

startServer();
