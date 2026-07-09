// Rathore's Kitchen — order receiver (Vercel serverless function)
// Receives orders from the site (same-origin, unblockable) and pushes
// a phone notification via ntfy from the SERVER side.

const NTFY_TOPIC = "rk1711-orders-103c092a";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "POST only" });

  try {
    const b = (typeof req.body === "object" && req.body) ? req.body : JSON.parse(req.body || "{}");
    const title = String(b.title || "NEW ORDER — Rathore's Kitchen").slice(0, 200);
    const text = String(b.text || "New order (no details)").slice(0, 4000);

    // trace in Vercel function logs as an extra backup record
    console.log("=== ORDER RECEIVED ===\n" + title + "\n" + text + "\n======================");

    const r = await fetch("https://ntfy.sh/" + NTFY_TOPIC, {
      method: "POST",
      headers: { "Title": title, "Priority": "high", "Tags": "bell,plate_with_cutlery" },
      body: text
    });

    return res.status(200).json({ ok: r.ok === true });
  } catch (e) {
    console.error("order fn error:", e && e.message);
    return res.status(200).json({ ok: false, error: "server error" });
  }
};
