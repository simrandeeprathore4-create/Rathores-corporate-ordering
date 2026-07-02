// Vercel serverless function — deploy this whole "stripe-backend" folder
// to Vercel (free) and it becomes a live API endpoint automatically at:
//   https://your-project-name.vercel.app/api/create-checkout-session
//
// This is the ONLY safe place for your Stripe secret key to live — never
// inside the ordering page itself, since that page's code is visible to
// anyone who opens it.

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Allow the ordering page (running on a different domain) to call this API
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { items } = req.body; // [{ name, unitAmountCents, quantity }]
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items in order" });
    }

    const line_items = items.map((it) => ({
      price_data: {
        currency: "usd",
        product_data: { name: String(it.name).slice(0, 250) },
        unit_amount: Math.max(1, Math.round(it.unitAmountCents)),
      },
      quantity: Math.max(1, Math.round(it.quantity)),
    }));

    const origin = req.headers.origin || "https://rathoreskitchen.com";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}?payment=success`,
      cancel_url: `${origin}?payment=cancelled`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};
