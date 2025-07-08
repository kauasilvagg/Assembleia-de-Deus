
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  message_type: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, subject, message, message_type }: ContactEmailRequest = await req.json();

    // Send confirmation email to the person who submitted the form
    const confirmationEmailResponse = await resend.emails.send({
      from: "Assembleia de Deus Shalom <onboarding@resend.dev>",
      to: [email],
      subject: "Mensagem recebida - Assembleia de Deus Shalom",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1e40af; margin-bottom: 10px;">Assembleia de Deus Shalom</h1>
            <p style="color: #666; margin: 0;">Parque Vitória - São Luís/MA</p>
          </div>
          
          <h2 style="color: #333;">Olá, ${name}!</h2>
          <p style="color: #555; line-height: 1.6;">
            Recebemos sua mensagem e agradecemos por entrar em contato conosco. 
            Nossa equipe analisará sua solicitação e retornaremos em breve.
          </p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Resumo da sua mensagem:</h3>
            <p><strong>Assunto:</strong> ${subject}</p>
            <p><strong>Tipo:</strong> ${message_type}</p>
            <p><strong>Mensagem:</strong> ${message}</p>
          </div>
          
          <div style="background-color: #1e40af; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: white;">Horários de Culto</h3>
            <p style="margin: 5px 0;">📅 Domingo (Manhã): 8h00</p>
            <p style="margin: 5px 0;">📅 Domingo (Noite): 19h00</p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #666;">
            <p><strong>Assembleia de Deus Shalom</strong></p>
            <p>Parque Vitória - São Luís/MA</p>
            <p>CEP: 65123-250</p>
            <p>📧 contato@igrejashalom.com.br</p>
            <p>📞 (98) 1234-5678</p>
          </div>
        </div>
      `,
    });

    // Send notification email to the church
    const notificationEmailResponse = await resend.emails.send({
      from: "Sistema Contato <onboarding@resend.dev>",
      to: ["magalhaeskaua13@gmail.com"],
      subject: `Nova mensagem de contato: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e40af;">Nova mensagem de contato recebida</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Dados do contato:</h3>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Telefone:</strong> ${phone}</p>` : ''}
            <p><strong>Tipo de mensagem:</strong> ${message_type}</p>
            <p><strong>Assunto:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Mensagem:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <p style="color: #666; margin-top: 20px; font-size: 14px;">
            Esta mensagem foi enviada através do formulário de contato do site.
          </p>
        </div>
      `,
    });

    console.log("Emails sent successfully:", { confirmationEmailResponse, notificationEmailResponse });

    return new Response(JSON.stringify({ 
      success: true, 
      confirmationEmailId: confirmationEmailResponse.data?.id,
      notificationEmailId: notificationEmailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
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
