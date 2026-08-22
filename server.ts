import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Student AI Assistant" });
  });

  // AI Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { question, subject, history } = req.body;
      if (!question || typeof question !== "string" || !question.trim()) {
        return res.status(400).json({ error: "Question cannot be empty." });
      }

      const client = getGeminiClient();

      if (client) {
        let systemInstruction =
          "You are 'Student AI Assistant', an encouraging, expert, and pedagogical academic tutor for students. " +
          "Your goals are:\n" +
          "1. Provide crystal-clear, step-by-step explanations rather than just giving away final answers.\n" +
          "2. Break down complex math, science, programming, history, and language arts concepts.\n" +
          "3. Use clean Markdown formatting, bullet points, headers, bold text, and code blocks where appropriate.\n" +
          "4. Include quick practice tips, mnemonic devices, or self-check questions when helpful.\n" +
          "5. Keep the tone warm, motivating, polite, and student-centric.";

        if (subject && subject !== "General") {
          systemInstruction += ` Focus specifically on the academic domain of ${subject}.`;
        }

        let fullPrompt = "";
        if (history && Array.isArray(history) && history.length > 0) {
          fullPrompt += "Previous conversation context:\n";
          history.slice(-3).forEach((item: any) => {
            if (item.question && item.response) {
              fullPrompt += `Student: ${item.question}\nAssistant: ${item.response}\n\n`;
            }
          });
        }
        fullPrompt += `Current Student Question: ${question.trim()}`;

        const response = await client.models.generateContent({
          model: "gemini-3.7-flash",
          contents: fullPrompt,
          config: {
            systemInstruction,
          },
        });

        const replyText = response.text || "I've reviewed your question. Could you clarify what specific step you'd like to dive into?";
        return res.json({
          success: true,
          question: question.trim(),
          response: replyText,
          timestamp: new Date().toISOString(),
        });
      } else {
        // High quality educational fallback if GEMINI_API_KEY is not configured
        const fallbackReply =
          `### 🎓 Step-by-Step Study Guide\n\n` +
          `**Your Question:** ${question.trim()}\n` +
          (subject && subject !== "General" ? `**Subject:** ${subject}\n\n` : "\n") +
          `1. **Core Concept Formulation:**\n` +
          `   - Identify the fundamental terms and formulas.\n` +
          `   - Break down the prompt into knowns and unknowns.\n\n` +
          `2. **Methodical Breakdown:**\n` +
          `   - Apply the relevant theorem, syntax, or chronology.\n` +
          `   - Check edge cases or units of measurement.\n\n` +
          `3. **Key Takeaway:**\n` +
          `   - Summarize the principle so you can solve analogous problems on future exams.\n\n` +
          `*(Connect your Gemini API key in Settings > Secrets for live AI responses)*`;

        return res.json({
          success: true,
          question: question.trim(),
          response: fallbackReply,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.error("Chat API error:", err);
      return res.status(500).json({
        error: err.message || "Failed to generate AI response. Please try again.",
      });
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
