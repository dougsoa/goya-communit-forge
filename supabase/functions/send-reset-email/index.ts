import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from "npm:react@18.3.1";
import ResetPasswordEmail from "./_templates/reset-password-email.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResetEmailRequest {
  userEmail: string;
  resetUrl: string;
  userName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, resetUrl, userName }: ResetEmailRequest = await req.json();

    console.log(`Sending reset password email to: ${userEmail}`);

    // Render the React email template
    const html = await renderAsync(
      React.createElement(ResetPasswordEmail, {
        resetUrl: resetUrl,
        userName: userName || "User"
      })
    );

    const emailResponse = await resend.emails.send({
      from: "Goya Communit <onboarding@resend.dev>",
      to: [userEmail],
      subject: "🔒 Reset Your Password - Goya Communit",
      html: html,
    });

    console.log("Reset password email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-reset-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);