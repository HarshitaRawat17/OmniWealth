import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "OmniWealth AI", timestamp: new Date().toISOString() });
  });

  // Server-side Gemini API route for Portfolio Analysis & Financial Q&A
  app.post("/api/ai-portfolio-analysis", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY environment variable is not configured.",
          isFallback: true,
        });
      }

      const { portfolioData, userQuery, action } = req.body;

      const ai = new GoogleGenAI({ apiKey });

      let prompt = "";
      if (action === "explain_optimization") {
        prompt = `You are OmniWealth AI, a top-tier quantitative wealth manager and tax-loss harvesting expert.
Analyze this portfolio data before and after rebalancing:
${JSON.stringify(portfolioData, null, 2)}

Provide a concise, 3-bullet-point executive breakdown:
1. Risk Reduction: How reducing Technology sector exposure from 65% down to 30% mitigates single-sector concentration risk.
2. Tax Efficiency: Explain how cross-asset tax-loss harvesting saved ₹12,400 (STCG/LTCG offset across direct stocks and mutual funds).
3. Capital Reallocation: Where the rebalanced funds were safely redeployed (Banking & Financials, Sovereign Gold Bonds / Debt).
Keep the tone professional, encouraging, precise, and crisp. Use Indian Rupee (₹) formatting.`;
      } else {
        prompt = `You are OmniWealth AI, an expert financial advisory assistant.
Current Portfolio:
${JSON.stringify(portfolioData, null, 2)}

User Question: "${userQuery || "Analyze my current portfolio risk and suggest optimal tax strategy."}"

Provide a clear, structured financial response addressing risk concentration, asset allocation, tax implications (STCG, LTCG, SGB tax-free status), and actionable steps.
Keep your response concise, well-formatted with markdown bullet points, and easy for an investor to understand.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      const text = response.text || "No insights available at this moment.";
      return res.json({ analysis: text, isFallback: false });
    } catch (err: any) {
      console.error("Gemini API Error in server.ts:", err);
      return res.status(500).json({
        error: err.message || "Failed to generate AI analysis",
        isFallback: true,
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
    console.log(`[OmniWealth AI] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
