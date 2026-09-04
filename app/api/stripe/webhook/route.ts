import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !process.env.STRIPE_SECRET_KEY) return new Response("Stripe webhook belum dikonfigurasi", { status: 503 });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = headers().get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });
  const body = await req.text();
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(body, signature, secret); } catch { return new Response("Invalid signature", { status: 400 }); }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const projectId = session.metadata?.projectId;
    if (userId && projectId) {
      await prisma.purchase.upsert({
        where: { userId_projectId: { userId, projectId } },
        update: { stripeSessionId: session.id, amount: session.amount_total || 0 },
        create: { userId, projectId, stripeSessionId: session.id, amount: session.amount_total || 0 },
      });
    }
  }
  return new Response("ok");
}
