import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'event' | 'blog' | 'ministry' | 'sermon';
  title: string;
  description?: string;
  content_id: string;
  author_name?: string;
  event_date?: string;
  preacher_name?: string;
}

const getEmailTemplate = (notificationType: string, data: any) => {
  const baseStyles = `
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e40af, #1e3a8a); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none; }
    .btn { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
  `;

  switch (notificationType) {
    case 'event':
      return `
        <!DOCTYPE html>
        <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 Novo Evento!</h1>
            </div>
            <div class="content">
              <h2>${data.title}</h2>
              ${data.description ? `<p>${data.description}</p>` : ''}
              ${data.event_date ? `<p><strong>Data:</strong> ${new Date(data.event_date).toLocaleDateString('pt-BR')}</p>` : ''}
              <p>Não perca este evento especial em nossa igreja!</p>
              <a href="${Deno.env.get('SITE_URL') || 'https://localhost:5173'}/eventos" class="btn">Ver Eventos</a>
            </div>
            <div class="footer">
              <p>Assembleia de Deus Shalom Parque Vitória</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
    case 'blog':
      return `
        <!DOCTYPE html>
        <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📖 Novo Artigo!</h1>
            </div>
            <div class="content">
              <h2>${data.title}</h2>
              ${data.description ? `<p>${data.description}</p>` : ''}
              ${data.author_name ? `<p><strong>Autor:</strong> ${data.author_name}</p>` : ''}
              <p>Um novo artigo foi publicado em nosso blog. Confira agora!</p>
              <a href="${Deno.env.get('SITE_URL') || 'https://localhost:5173'}/blog" class="btn">Ler Artigo</a>
            </div>
            <div class="footer">
              <p>Assembleia de Deus Shalom Parque Vitória</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
    case 'ministry':
      return `
        <!DOCTYPE html>
        <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🙏 Novo Ministério!</h1>
            </div>
            <div class="content">
              <h2>${data.title}</h2>
              ${data.description ? `<p>${data.description}</p>` : ''}
              <p>Um novo ministério foi criado em nossa igreja. Venha participar e servir!</p>
              <a href="${Deno.env.get('SITE_URL') || 'https://localhost:5173'}/ministerios" class="btn">Ver Ministérios</a>
            </div>
            <div class="footer">
              <p>Assembleia de Deus Shalom Parque Vitória</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
    case 'sermon':
      return `
        <!DOCTYPE html>
        <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎙️ Novo Sermão!</h1>
            </div>
            <div class="content">
              <h2>${data.title}</h2>
              ${data.description ? `<p>${data.description}</p>` : ''}
              ${data.preacher_name ? `<p><strong>Pregador:</strong> ${data.preacher_name}</p>` : ''}
              <p>Um novo sermão está disponível. Ouça e seja edificado!</p>
              <a href="${Deno.env.get('SITE_URL') || 'https://localhost:5173'}/sermoes" class="btn">Ouvir Sermão</a>
            </div>
            <div class="footer">
              <p>Assembleia de Deus Shalom Parque Vitória</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
    default:
      return `
        <!DOCTYPE html>
        <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 Nova Notificação!</h1>
            </div>
            <div class="content">
              <h2>${data.title}</h2>
              ${data.description ? `<p>${data.description}</p>` : ''}
              <p>Confira as novidades em nosso site!</p>
              <a href="${Deno.env.get('SITE_URL') || 'https://localhost:5173'}" class="btn">Visitar Site</a>
            </div>
            <div class="footer">
              <p>Assembleia de Deus Shalom Parque Vitória</p>
            </div>
          </div>
        </body>
        </html>
      `;
  }
};

const getSubject = (type: string, title: string) => {
  switch (type) {
    case 'event':
      return `📅 Novo Evento: ${title}`;
    case 'blog':
      return `📖 Novo Artigo: ${title}`;
    case 'ministry':
      return `🙏 Novo Ministério: ${title}`;
    case 'sermon':
      return `🎙️ Novo Sermão: ${title}`;
    default:
      return `🔔 ${title}`;
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const requestData: NotificationRequest = await req.json();
    console.log('Notification request:', requestData);

    // Get users with email notifications enabled for this type
    const { data: emailPreferences, error: prefsError } = await supabaseClient
      .from('email_preferences')
      .select(`
        user_id,
        profiles!inner(*)
      `)
      .eq(requestData.type === 'event' ? 'events' : 
          requestData.type === 'blog' ? 'blog_posts' :
          requestData.type === 'ministry' ? 'ministries' : 'sermons', true);

    if (prefsError) {
      console.error('Error fetching email preferences:', prefsError);
      throw prefsError;
    }

    console.log(`Found ${emailPreferences?.length || 0} users to notify`);

    if (!emailPreferences || emailPreferences.length === 0) {
      return new Response(JSON.stringify({ message: "No users to notify" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get all user emails
    const { data: authUsers, error: authError } = await supabaseClient.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      throw authError;
    }

    const userEmails = new Map();
    authUsers.users.forEach(user => {
      if (user.email) {
        userEmails.set(user.id, user.email);
      }
    });

    // Send emails to all eligible users
    const emailPromises = emailPreferences.map(async (pref) => {
      const userEmail = userEmails.get(pref.user_id);
      if (!userEmail) {
        console.log(`No email found for user ${pref.user_id}`);
        return null;
      }

      console.log(`Sending ${requestData.type} notification to ${userEmail}`);

      try {
        const emailResponse = await resend.emails.send({
          from: "Igreja Shalom <noreply@igreja-shalom.com>",
          to: [userEmail],
          subject: getSubject(requestData.type, requestData.title),
          html: getEmailTemplate(requestData.type, requestData),
        });

        console.log(`Email sent successfully to ${userEmail}:`, emailResponse);
        return emailResponse;
      } catch (emailError) {
        console.error(`Failed to send email to ${userEmail}:`, emailError);
        return null;
      }
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter(r => r !== null).length;

    console.log(`Successfully sent ${successCount} notification emails`);

    return new Response(JSON.stringify({ 
      message: `Notification emails sent successfully`,
      sent: successCount,
      total: emailPreferences.length
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in send-notification-emails function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);