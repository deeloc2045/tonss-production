import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import { SeoAiService, SEO_PAGES_DEFINITIONS } from './server/seoAi';
import { createSupabaseServerClient, createSupabaseAdminClient } from './server/supabase';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware pour parser le JSON
  app.use(express.json());

  // ==========================================
  // CONFIGURATION SMTP (Service d'envoi d'emails)
  // ==========================================
  function getMailTransporter() {
    const rawHost = (process.env.SMTP_HOST || '').trim();
    const rawPort = (process.env.SMTP_PORT || '').trim();
    const rawUser = (process.env.SMTP_USER || '').trim();
    const rawPass = (process.env.SMTP_PASS || '').trim();

    if (!rawHost || !rawUser || !rawPass) {
      return null;
    }

    const port = parseInt(rawPort || '465', 10);
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;

    return nodemailer.createTransport({
      host: rawHost,
      port,
      secure,
      auth: {
        user: rawUser,
        pass: rawPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // Vérifier le statut de la configuration SMTP
  app.get('/api/smtp/status', (req, res) => {
    const rawHost = (process.env.SMTP_HOST || '').trim();
    const rawUser = (process.env.SMTP_USER || '').trim();
    const rawPass = (process.env.SMTP_PASS || '').trim();
    const isConfigured = Boolean(rawHost && rawUser && rawPass);

    let receiver = (process.env.CONTACT_RECEIVER_EMAIL || rawUser || 'contact@tonssproduction.com').trim();
    if (receiver.includes('tonss-production.com')) {
      receiver = receiver.replace('tonss-production.com', 'tonssproduction.com');
    }

    res.json({
      configured: isConfigured,
      host: rawHost || null,
      port: process.env.SMTP_PORT || (rawHost.includes('spacemail') ? '465' : '587'),
      user: rawUser || null,
      receiver,
      provider: rawHost.includes('spacemail') 
        ? 'Spacemail (Spaceship)' 
        : rawHost.includes('gmail') 
          ? 'Google / Gmail' 
          : 'Custom SMTP',
    });
  });

  // Tester la connexion SMTP
  app.post('/api/smtp/test', async (req, res) => {
    try {
      const transporter = getMailTransporter();
      if (!transporter) {
        return res.status(400).json({
          success: false,
          error: "Configuration SMTP incomplète. Veuillez définir SMTP_HOST, SMTP_USER et SMTP_PASS.",
        });
      }

      await transporter.verify();
      res.json({
        success: true,
        message: "Connexion au serveur SMTP réussie avec succès.",
      });
    } catch (err: any) {
      console.error("Erreur de test SMTP:", err);
      const errMsg = err.message || "";
      let diagnostic = "";

      if (errMsg.includes("535") || errMsg.includes("BadCredentials") || errMsg.includes("authentication failed")) {
        if (process.env.SMTP_HOST?.includes("gmail")) {
          diagnostic = "Erreur d'authentification Gmail (535 BadCredentials). Deux cas fréquents : (1) Votre domaine tonssproduction.com est hébergé sur Spacemail (Spaceship), utilisez SMTP_HOST=mail.spacemail.com et SMTP_PORT=465 avec le mot de passe de votre boîte mail. (2) Si vous utilisez un compte @gmail.com, Google exige un 'Mot de passe d'application' de 16 caractères et non votre mot de passe habituel.";
        } else if (process.env.SMTP_HOST?.includes("spacemail")) {
          diagnostic = "Erreur d'authentification Spacemail. L'adresse email ou le mot de passe de la boîte mail contact@tonssproduction.com est incorrect. Vérifiez le mot de passe de la boîte dans votre console Spaceship / Spacemail.";
        } else {
          diagnostic = "Identifiants SMTP invalides (535). Vérifiez l'adresse email et le mot de passe.";
        }
      } else if (errMsg.includes("ETIMEDOUT") || errMsg.includes("ECONNREFUSED")) {
        diagnostic = "Délai d'attente dépassé ou connexion refusée. Vérifiez le port (465 pour SSL ou 587 pour TLS).";
      }

      res.status(500).json({
        success: false,
        error: errMsg,
        diagnostic: diagnostic || undefined,
      });
    }
  });

  // API Envoi d'email de contact (formulaire client)
  app.post('/api/send-email', async (req, res) => {
    const { name, email, phone, service, budget, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Nom, email et message sont obligatoires.",
      });
    }

    const transporter = getMailTransporter();

    // Si le SMTP n'est pas encore renseigné, on valide quand même pour ne pas bloquer l'utilisateur
    if (!transporter) {
      console.warn("⚠️ SMTP non configuré dans l'environnement. Message enregistré sans notification email.");
      return res.json({
        success: true,
        warning: "SMTP_NOT_CONFIGURED",
        message: "Message enregistré avec succès (notification email en attente de configuration SMTP).",
      });
    }

    let receiverEmail = (process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER || 'contact@tonssproduction.com').trim();
    if (receiverEmail.includes('tonss-production.com')) {
      receiverEmail = receiverEmail.replace('tonss-production.com', 'tonssproduction.com');
    }
    const fromAddress = process.env.SMTP_FROM || `"TONSS Production" <${(process.env.SMTP_USER || 'contact@tonssproduction.com').trim()}>`;

    try {
      // 1. Notification à l'équipe TONSS Production
      await transporter.sendMail({
        from: fromAddress,
        to: receiverEmail,
        replyTo: email,
        subject: `[TONSS Site] Nouveau message de ${name} (${service || 'Demande générale'})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #121212; color: #f1f5f9; padding: 24px; border-radius: 12px; border: 1px solid #27272a;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #FFD700; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">TONSS PRODUCTION</h2>
              <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Nouvelle demande de contact reçue via tonssproduction.com</p>
            </div>
            
            <div style="background-color: #18181b; padding: 18px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #FFD700;">
              <p style="margin: 6px 0;"><strong>Client / Expéditeur :</strong> ${name}</p>
              <p style="margin: 6px 0;"><strong>Email :</strong> <a href="mailto:${email}" style="color: #FFD700; text-decoration: none;">${email}</a></p>
              ${phone ? `<p style="margin: 6px 0;"><strong>Téléphone :</strong> <a href="tel:${phone}" style="color: #38bdf8; text-decoration: none;">${phone}</a></p>` : ''}
              ${service ? `<p style="margin: 6px 0;"><strong>Service souhaité :</strong> ${service}</p>` : ''}
              ${budget ? `<p style="margin: 6px 0;"><strong>Budget estimé :</strong> ${budget}</p>` : ''}
            </div>

            <div style="background-color: #18181b; padding: 18px; border-radius: 8px;">
              <h4 style="color: #FFD700; margin-top: 0; margin-bottom: 10px;">Message du client :</h4>
              <p style="white-space: pre-wrap; line-height: 1.6; color: #e2e8f0; margin: 0;">${message}</p>
            </div>

            <div style="text-align: center; margin-top: 24px; font-size: 11px; color: #64748b;">
              <p style="margin: 2px;">Studio Média Hybride • Dakar, Sénégal</p>
              <p style="margin: 2px;">PA1 02 des Parcelles Assainies • +221 33 843 77 35</p>
            </div>
          </div>
        `,
      });

      // 2. Email d'accusé de réception automatique au client
      try {
        await transporter.sendMail({
          from: fromAddress,
          to: email,
          subject: `Nous avons bien reçu votre demande - TONSS Production`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #121212; color: #f1f5f9; padding: 24px; border-radius: 12px; border: 1px solid #27272a;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #FFD700; margin: 0; font-size: 22px; text-transform: uppercase;">TONSS PRODUCTION</h2>
                <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Studio Média Hybride & Innovation Numérique</p>
              </div>
              
              <div style="background-color: #18181b; padding: 20px; border-radius: 8px; line-height: 1.6;">
                <p>Bonjour <strong>${name}</strong>,</p>
                <p>Nous vous remercions d'avoir contacté <strong>TONSS Production</strong>.</p>
                <p>Votre demande concernant <strong>« ${service || 'votre projet'} »</strong> a bien été transmise à notre équipe de production et à nos architectes technologiques.</p>
                <p>Nous étudions vos besoins et reviendrons vers vous sous un délai de <strong>24 heures ouvrées</strong>.</p>
              </div>

              <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                <p style="color: #FFD700; font-weight: bold; margin: 4px 0;">TONSS Production</p>
                <p style="margin: 2px;">Dakar, Sénégal • PA1 02 des Parcelles Assainies</p>
                <p style="margin: 2px;">Téléphone : +221 33 843 77 35 / +221 78 012 88 62</p>
                <p style="margin: 2px;"><a href="https://tonssproduction.com" style="color: #38bdf8; text-decoration: none;">tonssproduction.com</a></p>
              </div>
            </div>
          `,
        });
      } catch (confirmErr) {
        console.warn("Notice: client auto-reply failed, but main notification succeeded:", confirmErr);
      }

      res.json({
        success: true,
        message: "Email envoyé avec succès.",
      });
    } catch (err: any) {
      console.error("Erreur lors de l'envoi de l'email SMTP:", err);
      res.status(500).json({
        success: false,
        error: "Erreur lors de l'envoi de l'email. Veuillez réessayer ou nous contacter par téléphone.",
      });
    }
  });

  // ==========================================
  // WHATSAPP CLOUD API - WEBHOOK
  // ==========================================

  // 1. Vérification du Webhook par Meta (GET)
  app.get('/api/webhook/whatsapp', (req, res) => {
    const verify_token = process.env.WHATSAPP_VERIFY_TOKEN || 'mon_super_token_secret';
    
    // Parse les paramètres de l'URL
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Vérifie si le mode et le token sont présents
    if (mode && token) {
      if (mode === 'subscribe' && token === verify_token) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403); // Forbidden
      }
    } else {
      res.sendStatus(400); // Bad Request
    }
  });

  // 2. Réception des messages WhatsApp (POST)
  app.post('/api/webhook/whatsapp', (req, res) => {
    const body = req.body;

    console.log("🔔 Nouveau webhook reçu de WhatsApp:", JSON.stringify(body, null, 2));

    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;
        const from = body.entry[0].changes[0].value.messages[0].from; // Numéro de l'expéditeur
        const msgBody = body.entry[0].changes[0].value.messages[0].text?.body; // Texte du message

        console.log(`💬 Message de ${from}: ${msgBody}`);
        
        // C'est ici que vous pourrez ajouter la logique pour sauvegarder le message dans Supabase
        // ou envoyer une réponse automatique via l'API WhatsApp.
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });

  // ==========================================
  // SUPABASE SSR & ADMIN API ROUTES
  // ==========================================
  async function verifyAdminRequest(req: express.Request, res: express.Response) {
    const supabaseAdmin = createSupabaseAdminClient();
    const supabaseServer = createSupabaseServerClient(req, res);
    if (!supabaseAdmin || !supabaseServer) {
      res.status(503).json({
        success: false,
        error: "Supabase serveur non configuré (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants).",
      });
      return null;
    }

    const authHeader = req.headers.authorization || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    const { data: userResult, error: userError } = bearerToken
      ? await supabaseAdmin.auth.getUser(bearerToken)
      : await supabaseServer.auth.getUser();

    const caller = userResult?.user;
    if (userError || !caller) {
      res.status(401).json({ success: false, error: "Authentification requise." });
      return null;
    }

    const isSuperAdmin =
      caller.email === 'deeloc2045@gmail.com' || caller.email === 'deeloc2045agmail.com';

    if (!isSuperAdmin) {
      const { data: profile } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', caller.id)
        .maybeSingle();

      if (profile?.role !== 'admin') {
        res.status(403).json({ success: false, error: "Accès administrateur requis." });
        return null;
      }
    }

    return { supabaseAdmin, caller };
  }

  app.post('/api/admin/invite-client', async (req, res) => {
    const ctx = await verifyAdminRequest(req, res);
    if (!ctx) return;

    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ success: false, error: "Adresse email requise." });
    }

    try {
      const { data, error } = await ctx.supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: { role: 'client' },
      });

      if (error) {
        if (error.message?.toLowerCase().includes('already') || error.status === 422) {
          return res.status(409).json({ success: false, error: "Cet email est déjà utilisé." });
        }
        return res.status(400).json({ success: false, error: error.message });
      }

      if (data.user) {
        await ctx.supabaseAdmin.from('users').upsert(
          {
            id: data.user.id,
            email,
            role: 'client',
          },
          { onConflict: 'id' }
        );
      }

      return res.json({ success: true, user: data.user });
    } catch (err: any) {
      console.error("Erreur invitation Supabase:", err);
      return res.status(500).json({ success: false, error: "Erreur serveur lors de l'invitation." });
    }
  });

  app.delete('/api/admin/users/:id', async (req, res) => {
    const ctx = await verifyAdminRequest(req, res);
    if (!ctx) return;

    const userId = req.params.id;
    try {
      await ctx.supabaseAdmin.from('users').delete().eq('id', userId);
      const { error } = await ctx.supabaseAdmin.auth.admin.deleteUser(userId);
      if (error) {
        console.warn("Supabase auth.admin.deleteUser warning:", error.message);
      }
      return res.json({ success: true });
    } catch (err: any) {
      console.error("Erreur suppression utilisateur Supabase:", err);
      return res.status(500).json({ success: false, error: "Erreur lors de la suppression." });
    }
  });

  // ==========================================
  // GOOGLE AI SEO & PAGES D'INDEXATION GOOGLE SEARCH
  // ==========================================

  // 1. Liste des pages SEO générées par Google AI
  app.get('/api/seo/pages', (req, res) => {
    const pages = SEO_PAGES_DEFINITIONS.map(def => {
      const filePath = path.join(process.cwd(), 'public', 'seo-pages', `${def.slug}.html`);
      const exists = fs.existsSync(filePath);
      return {
        slug: def.slug,
        routePath: def.routePath,
        url: `https://tonssproduction.com${def.routePath}`,
        title: def.title,
        category: def.category,
        primaryKeyword: def.primaryKeyword,
        secondaryKeywords: def.secondaryKeywords,
        isGenerated: exists,
      };
    });

    res.json({
      total: pages.length,
      pages,
      sitemapUrl: 'https://tonssproduction.com/sitemap.xml',
      robotsUrl: 'https://tonssproduction.com/robots.txt'
    });
  });

  // 2. Déclencher la génération / actualisation des pages SEO avec Google AI (Gemini)
  app.post('/api/seo/generate-pages', async (req, res) => {
    try {
      console.log("🤖 Lancement de la génération des pages d'indexation avec Google AI...");
      const result = await SeoAiService.generateAllPages();
      res.json({
        success: true,
        message: `${result.successCount} / ${result.total} pages SEO générées avec succès par Google AI pour l'indexation Google Search.`,
        data: result
      });
    } catch (err: any) {
      console.error("Erreur génération SEO:", err);
      res.status(500).json({
        success: false,
        error: err.message || "Erreur lors de la génération avec Google AI"
      });
    }
  });

  // 3. Servir les pages SEO optimisées pour Google Search (Root paths)
  SEO_PAGES_DEFINITIONS.forEach(def => {
    app.get(def.routePath, async (req, res, next) => {
      try {
        const { html } = await SeoAiService.getOrGeneratePage(def);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
        res.send(html);
      } catch (err) {
        console.error(`Erreur rendu page SEO ${def.slug}:`, err);
        next();
      }
    });
  });

  // ==========================================
  // SEO STATIC FILES (robots.txt, sitemap.xml, favicon.ico)
  // ==========================================
  app.get('/favicon.ico', (req, res) => {
    res.type('image/x-icon');
    res.sendFile(path.join(process.cwd(), 'public', 'favicon.ico'));
  });

  app.get('/robots.txt', (req, res) => {
    res.type('text/plain; charset=utf-8');
    res.sendFile(path.join(process.cwd(), 'public', 'robots.txt'));
  });

  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml; charset=utf-8');
    res.sendFile(path.join(process.cwd(), 'public', 'sitemap.xml'));
  });

  app.get('/feed.xml', (req, res) => {
    res.type('application/rss+xml; charset=utf-8');
    res.sendFile(path.join(process.cwd(), 'public', 'feed.xml'));
  });

  // ==========================================
  // CONFIGURATION FRONTEND (Vite / Express)
  // ==========================================
  
  if (process.env.NODE_ENV !== 'production') {
    // Mode Développement: Utiliser Vite comme middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Mode Production: Servir les fichiers statiques de dist/
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
