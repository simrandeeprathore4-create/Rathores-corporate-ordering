# Rathore's Kitchen — Corporate Ordering Site

This folder is a complete, deployable website: the ordering page
(`index.html`) plus the Stripe checkout engine (`api/create-checkout-session.js`)
live together, so there's only one thing to deploy and one URL to manage.

## Deploy it (free, ~10 minutes, one time)

1. **Get your Stripe secret key**
   Stripe Dashboard → Developers → API keys → copy the "Secret key".
   Keep it private — it only ever goes into Vercel (step 3), never into
   `index.html`.

2. **Put this folder on GitHub**
   - github.com → New repository (e.g. `rathores-ordering`)
   - "uploading an existing file" → drag in everything from this folder
     (keep the `api` folder as a folder, don't flatten it)
   - Commit

3. **Deploy to Vercel (free)**
   - vercel.com → sign up with GitHub
   - "Add New Project" → import `rathores-ordering`
   - Before clicking Deploy, open "Environment Variables" and add:
     - Name: `STRIPE_SECRET_KEY`
     - Value: (your secret key from step 1)
   - Click Deploy → in about a minute you get a live URL like
     `https://rathores-ordering.vercel.app`

That's it — that URL is now a real, working site: menu, bulk pricing,
Stripe checkout, all on one page.

## (Optional) Use your own domain instead of the .vercel.app one

In the Vercel project → Settings → Domains, you can add something like
`order.rathoreskitchen.com`. Vercel gives you a DNS record to add at
wherever `rathoreskitchen.com` is registered — send me that record and
I can walk you through it if you get stuck.

## Add it to your current website (GoHighLevel)

Since you picked "separate page + button": in GoHighLevel's page editor,
add a button anywhere (nav bar, homepage, footer) and set its link to your
deployed URL (either the `.vercel.app` one or your custom domain once set
up). No embed code needed — it just opens like any external link.

## After deploying

Send me the live URL and I'll double check the Stripe checkout works
end-to-end before you share it with anyone.
