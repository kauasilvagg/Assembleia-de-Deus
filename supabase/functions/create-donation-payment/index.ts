import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    // Parse request body
    const { 
      amount, 
      donationType, 
      isRecurring, 
      recurringFrequency, 
      campaignName, 
      notes 
    } = await req.json();

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
      });
      customerId = customer.id;
    }

    // Determine donation description
    let description = "";
    switch (donationType) {
      case "tithe":
        description = "Dízimo";
        break;
      case "offering":
        description = "Oferta";
        break;
      case "campaign":
        description = `Campanha: ${campaignName}`;
        break;
      case "mission":
        description = "Missões";
        break;
      default:
        description = "Doação";
    }

    // Create line items
    const lineItems = [{
      price_data: {
        currency: "brl",
        product_data: {
          name: description,
          description: notes || undefined,
        },
        unit_amount: Math.round(amount * 100), // Convert to cents
        ...(isRecurring && {
          recurring: {
            interval: recurringFrequency === "weekly" ? "week" :
                     recurringFrequency === "monthly" ? "month" :
                     recurringFrequency === "quarterly" ? "month" :
                     recurringFrequency === "yearly" ? "year" : "month",
            ...(recurringFrequency === "quarterly" && { interval_count: 3 })
          }
        })
      },
      quantity: 1,
    }];

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: isRecurring ? "subscription" : "payment",
      success_url: `${req.headers.get("origin")}/doacoes?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/doacoes?canceled=true`,
      metadata: {
        user_id: user.id,
        donation_type: donationType,
        campaign_name: campaignName || "",
        notes: notes || "",
        is_recurring: isRecurring.toString()
      }
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error creating donation payment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});