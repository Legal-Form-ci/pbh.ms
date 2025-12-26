import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'lead' | 'contact';
  data: {
    name?: string;
    first_name?: string;
    last_name?: string;
    email: string;
    phone: string;
    subject?: string;
    message?: string;
    region?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: NotificationRequest = await req.json();
    
    const adminEmail = "contact@pbhms.ci"; // Email de l'admin
    const companyName = "PBHMS";
    
    let subject = "";
    let htmlContent = "";
    
    if (type === 'lead') {
      const fullName = data.first_name && data.last_name 
        ? `${data.first_name} ${data.last_name}` 
        : data.name || 'Non spécifié';
        
      subject = `🏠 Nouveau Lead - ${fullName}`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .info-row { display: flex; padding: 15px 0; border-bottom: 1px solid #eee; }
            .info-label { font-weight: bold; color: #666; width: 120px; }
            .info-value { color: #333; }
            .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .badge { background: #D4AF37; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; display: inline-block; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 ${companyName}</h1>
              <p>Nouveau Lead Reçu</p>
            </div>
            <div class="content">
              <span class="badge">NOUVEAU LEAD</span>
              <div class="info-row">
                <span class="info-label">Nom complet:</span>
                <span class="info-value">${fullName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${data.email}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Téléphone:</span>
                <span class="info-value">${data.phone}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Région:</span>
                <span class="info-value">${data.region || 'Non spécifiée'}</span>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${companyName} - Tous droits réservés</p>
              <p>Cet email a été envoyé automatiquement depuis votre site web.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'contact') {
      subject = `📩 Nouvelle Demande de Contact - ${data.name}`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #1a365d 0%, #2d5282 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .info-row { display: flex; padding: 15px 0; border-bottom: 1px solid #eee; }
            .info-label { font-weight: bold; color: #666; width: 120px; }
            .info-value { color: #333; }
            .message-box { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px; }
            .message-box h3 { margin-top: 0; color: #1a365d; }
            .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .badge { background: #1a365d; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; display: inline-block; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📩 ${companyName}</h1>
              <p>Nouvelle Demande de Contact</p>
            </div>
            <div class="content">
              <span class="badge">DEMANDE DE CONTACT</span>
              <div class="info-row">
                <span class="info-label">Nom:</span>
                <span class="info-value">${data.name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${data.email}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Téléphone:</span>
                <span class="info-value">${data.phone}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Sujet:</span>
                <span class="info-value">${data.subject || 'Non spécifié'}</span>
              </div>
              <div class="message-box">
                <h3>Message:</h3>
                <p>${data.message || 'Aucun message'}</p>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${companyName} - Tous droits réservés</p>
              <p>Cet email a été envoyé automatiquement depuis votre site web.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // Send notification to admin
    const adminEmailResponse = await resend.emails.send({
      from: "PBHMS <onboarding@resend.dev>",
      to: [adminEmail],
      subject: subject,
      html: htmlContent,
    });

    console.log("Admin notification sent:", adminEmailResponse);

    // Send confirmation to the user
    const userSubject = type === 'lead' 
      ? "Merci pour votre intérêt - PBHMS" 
      : "Nous avons bien reçu votre message - PBHMS";
      
    const userName = type === 'lead' 
      ? (data.first_name || data.name || 'Cher client')
      : (data.name || 'Cher client');

    const userHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; text-align: center; }
          .content h2 { color: #1a365d; }
          .content p { color: #666; line-height: 1.6; }
          .cta-button { display: inline-block; background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: bold; }
          .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 ${companyName}</h1>
          </div>
          <div class="content">
            <h2>Merci ${userName}!</h2>
            <p>Nous avons bien reçu votre ${type === 'lead' ? 'demande' : 'message'} et notre équipe vous contactera dans les plus brefs délais.</p>
            <p>En attendant, n'hésitez pas à explorer nos réalisations sur notre site.</p>
            <a href="https://www.pbhms.ci" class="cta-button">Visiter notre site</a>
          </div>
          <div class="footer">
            <p>📍 Daloa, Carrefour Acemon, à droite de la Pharmacie Palvis</p>
            <p>📞 +225 07 79 26 16 39</p>
            <p>© ${new Date().getFullYear()} ${companyName} - Construisons ensemble votre avenir</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const userEmailResponse = await resend.emails.send({
      from: "PBHMS <onboarding@resend.dev>",
      to: [data.email],
      subject: userSubject,
      html: userHtmlContent,
    });

    console.log("User confirmation sent:", userEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmail: adminEmailResponse,
        userEmail: userEmailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
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
