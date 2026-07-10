// Rathore's Kitchen — order receiver (Vercel serverless function)
// POST  /api/order          -> receives an order, pushes phone notification via ntfy (server-side)
// GET   /api/order?test=1   -> sends a TEST notification so we can verify the pipe from a browser

const https = require("https");
const NTFY_TOPIC = "rk1711-orders-103c092a";

function pushNtfy(title, text){
  return new Promise((resolve) => {
    try{
      const body = Buffer.from(String(text || ""), "utf8");
      const req = https.request({
        hostname: "ntfy.sh",
        path: "/" + NTFY_TOPIC,
        method: "POST",
        headers: {
          "Title": String(title || "Rathore's Kitchen").replace(/[^\x20-\x7E]/g, "").slice(0, 190),
          "Priority": "high",
          "Tags": "bell",
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Length": body.length
        },
        timeout: 8000
      }, (r) => {
        let d = "";
        r.on("data", c => d += c);
        r.on("end", () => resolve({ status: r.statusCode, ok: r.statusCode >= 200 && r.statusCode < 300 }));
      });
      req.on("error", (e) => resolve({ ok: false, error: e.message }));
      req.on("timeout", () => { req.destroy(); resolve({ ok: false, error: "timeout" }); });
      req.write(body);
      req.end();
    }catch(e){ resolve({ ok: false, error: e.message }); }
  });
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  // Browser-friendly TEST: /api/order?test=1
  if (req.method === "GET"){
    const isTest = req.query && (req.query.test === "1" || req.query.test === 1);
    if (isTest){
      const r = await pushNtfy("SERVER TEST — Rathore's", "Agar ye notification aayi, server->phone pipe 100% chalu hai. Time: " + new Date().toISOString());
      return res.status(200).json({ ok: true, mode: "test", pushed: r.ok === true, detail: r, node: process.version });
    }
    return res.status(200).json({ ok: false, error: "POST only", node: process.version });
  }

  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "POST only" });

  try{
    let b = req.body;
    if (typeof b === "string"){ try{ b = JSON.parse(b); }catch(_){ b = {}; } }
    if (!b || typeof b !== "object") b = {};
    const title = String(b.title || "NEW ORDER — Rathore's Kitchen");
    const text = String(b.text || "New order (no details)").slice(0, 4000);

    console.log("=== ORDER RECEIVED ===\n" + title + "\n" + text + "\n======================");

    const r = await pushNtfy(title, text);
    return res.status(200).json({ ok: r.ok === true, detail: r });
  }catch(e){
    console.error("order fn error:", e && e.message);
    return res.status(200).json({ ok: false, error: e && e.message });
  }
};
