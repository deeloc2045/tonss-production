import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

export interface SeoPageDefinition {
  slug: string;
  routePath: string;
  title: string;
  category: 'cinema' | 'audiovisuel' | 'tech' | 'faq' | 'solutions';
  primaryKeyword: string;
  secondaryKeywords: string[];
  summary: string;
  h1: string;
}

export const SEO_PAGES_DEFINITIONS: SeoPageDefinition[] = [
  {
    slug: 'cinema-longs-metrages',
    routePath: '/cinema-longs-metrages',
    title: 'Cinéma & Longs-Métrages 4K/8K à Dakar | TONSS Production',
    category: 'cinema',
    primaryKeyword: 'production cinéma dakar',
    secondaryKeywords: ['long métrage sénégal', 'tournage film afrique', 'caméras 8k dakar', 'cinéma africain'],
    summary: 'Production cinématographique d\'excellence à Dakar. Longs et courts-métrages tournés en 4K/8K RAW, optiques anamorphiques et direction artistique de rang international.',
    h1: 'Production Cinématographique & Longs-Métrages d\'Excellence à Dakar'
  },
  {
    slug: 'production-audiovisuelle',
    routePath: '/production-audiovisuelle',
    title: 'Société de Production Audiovisuelle & Documentaires au Sénégal | TONSS Production',
    category: 'audiovisuel',
    primaryKeyword: 'société production audiovisuelle sénégal',
    secondaryKeywords: ['documentaire dakar', 'spot publicitaire sénégal', 'captation vidéo événementielle dakar', 'studio audiovisuel dakar'],
    summary: 'Création audiovisuelle haut de gamme au Sénégal : documentaires d\'auteur, publicités de marque, séries TV et reportages culturels immersifs.',
    h1: 'Création Audiovisuelle, Documentaires & Publicités de Prestige au Sénégal'
  },
  {
    slug: 'developpement-applications',
    routePath: '/developpement-applications',
    title: 'Développement d\'Applications Mobiles iOS & Android à Dakar | TONSS Production',
    category: 'tech',
    primaryKeyword: 'développement application mobile dakar',
    secondaryKeywords: ['développeur flutter sénégal', 'création application ios android dakar', 'ingénierie logicielle sénégal', 'agence digitale dakar'],
    summary: 'Conception d\'applications mobiles performantes, sécurisées et intuitives (iOS, Android, Flutter) par les architectes technologiques de TONSS Production à Dakar.',
    h1: 'Ingénierie Logicielle & Développement d\'Applications Mobiles à Dakar'
  },
  {
    slug: 'streaming-et-cloud',
    routePath: '/streaming-et-cloud',
    title: 'Plateformes de Streaming VOD & Architectures Cloud en Afrique | TONSS Production',
    category: 'tech',
    primaryKeyword: 'plateforme streaming afrique',
    secondaryKeywords: ['plateforme vod sénégal', 'architecture cloud dakar', 'streaming vidéo haute disponibilité', 'solutions saas afrique'],
    summary: 'Déploiement de plateformes VOD, streaming musical et billetteries connectées à très forte concurrence avec infrastructures cloud mondiales.',
    h1: 'Plateformes de Streaming VOD & Infrastructures Cloud Distribuées'
  },
  {
    slug: 'waaxtu',
    routePath: '/waaxtu',
    title: 'Waaxtu - L\'Application Multimédia & Culturelle par TONSS Production',
    category: 'solutions',
    primaryKeyword: 'waaxtu application sénégal',
    secondaryKeywords: ['waaxtu tonss production', 'application multimédia dakar', 'culture africaine numérique', 'waaxtu streaming'],
    summary: 'Découvrez Waaxtu, l\'écosystème numérique propriétaire développé par TONSS Production pour valoriser la culture, l\'audio et le patrimoine africain.',
    h1: 'Waaxtu : L\'Écosystème Média & Culturel Conçu par TONSS Production'
  },
  {
    slug: 'post-production',
    routePath: '/post-production',
    title: 'Post-Production Cinéma, Étalonnage DaVinci & Sound Design à Dakar | TONSS Production',
    category: 'cinema',
    primaryKeyword: 'post production cinéma dakar',
    secondaryKeywords: ['étalonnage film sénégal', 'sound design surround 5.1 dakar', 'mixage audio cinéma', 'montage vidéo professionnel dakar'],
    summary: 'Laboratoires de post-production ultra-équipés à Dakar : étalonnage colorimétrique cinéma, sound design immersif 5.1/7.1, mixage et effets visuels VFX.',
    h1: 'Laboratoire de Post-Production, Étalonnage Numérique & Sound Design 5.1'
  },
  {
    slug: 'faq',
    routePath: '/faq',
    title: 'FAQ - Production Cinéma, Audiovisuel & Solutions Tech à Dakar | TONSS Production',
    category: 'faq',
    primaryKeyword: 'faq production audiovisuelle dakar',
    secondaryKeywords: ['tarifs tournage dakar', 'devis application mobile sénégal', 'délais production film afrique', 'questions studio tonss'],
    summary: 'Réponses détaillées à toutes vos questions sur les formats de tournage, les technologies employées, les budgets, les délais et la propriété intellectuelle.',
    h1: 'Questions Fréquentes sur nos Services de Production & Solutions Digitales'
  }
];

// Lazy client init
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

export class SeoAiService {
  private static storageDir = path.join(process.cwd(), 'public', 'seo-pages');
  private static cache = new Map<string, { html: string; generatedAt: string; isAiGenerated: boolean }>();

  public static init() {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  /**
   * Generates or loads the SEO HTML page
   */
  public static async getOrGeneratePage(def: SeoPageDefinition, forceAiRegen: boolean = false): Promise<{ html: string; isAiGenerated: boolean }> {
    this.init();
    const filePath = path.join(this.storageDir, `${def.slug}.html`);

    // Check in-memory cache first if not forcing regen
    if (!forceAiRegen && this.cache.has(def.slug)) {
      const cached = this.cache.get(def.slug)!;
      return { html: cached.html, isAiGenerated: cached.isAiGenerated };
    }

    // Check disk cache
    if (!forceAiRegen && fs.existsSync(filePath)) {
      try {
        const html = fs.readFileSync(filePath, 'utf-8');
        this.cache.set(def.slug, { html, generatedAt: new Date().toISOString(), isAiGenerated: true });
        return { html, isAiGenerated: true };
      } catch (err) {
        console.warn(`Could not read cached file for ${def.slug}:`, err);
      }
    }

    // Generate page with Google AI (Gemini)
    let aiGeneratedContent: {
      metaDescription: string;
      articleContent: string;
      faqItems: { q: string; a: string }[];
      highlights: string[];
    } | null = null;

    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `Tu es l'expert mondial en référencement naturel (SEO Google) et copywriter pour TONSS Production, un studio média hybride d'élite basé à Dakar, Sénégal (création cinéma 4K/8K, production audiovisuelle, développement d'applications mobiles iOS/Android, architectures cloud, application Waaxtu).
Ton objectif est de rédiger le contenu SEO parfait destiné à indexer cette page sur Google Search pour la requête cible : "${def.primaryKeyword}".

Détails de la page :
- Titre : "${def.title}"
- H1 : "${def.h1}"
- Mots-clés secondaires : ${def.secondaryKeywords.join(', ')}
- Contexte : Studio situé à Dakar (Parcelles Assainies & Almadies), matériel caméras cinéma RED/ARRI 8K, optiques anamorphiques, ingénierie logicielle Flutter/React/Cloud, portée internationale.

Réponds STRICTEMENT sous la forme d'un objet JSON valide avec cette structure exacte :
{
  "metaDescription": "Une meta description percutante de 150-160 caractères incitant au clic sur Google Search.",
  "highlights": ["3 à 4 points forts majeurs avec chiffres ou technologies"],
  "articleContent": "<p>Au moins 4 à 5 paragraphes HTML riches, bien structurés et captivants détaillant l'offre, l'expertise, les technologies de pointe, la méthodologie de réalisation à Dakar et l'impact culturel & technique.</p><h3>Sous-titre H3 pertinent</h3><p>Explications détaillées supplémentaires.</p>",
  "faqItems": [
    {"q": "Question 1 fréquemment posée sur ce sujet spécifique ?", "a": "Réponse complète et rassurante."},
    {"q": "Question 2 fréquemment posée sur ce sujet spécifique ?", "a": "Réponse complète et rassurante."}
  ]
}`;

        // Try gemini-3.8-flash first, fallback to gemini-3.1-flash-lite if temporary demand spike
        let responseText = '';
        try {
          const res = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json'
            }
          });
          responseText = res.text || '';
        } catch (mErr: any) {
          console.warn('Gemini 3.8 Flash busy, falling back to gemini-3.1-flash-lite:', mErr.message);
          const res = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: prompt,
            config: {
              responseMimeType: 'application/json'
            }
          });
          responseText = res.text || '';
        }

        if (responseText) {
          const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          aiGeneratedContent = JSON.parse(cleanJson);
        }
      } catch (geminiError) {
        console.warn(`Gemini generation warning for ${def.slug}:`, geminiError);
      }
    }

    const html = this.assemblePageHtml(def, aiGeneratedContent);

    // Save to disk
    try {
      fs.writeFileSync(filePath, html, 'utf-8');
    } catch (saveErr) {
      console.warn(`Could not write SEO file to disk:`, saveErr);
    }

    this.cache.set(def.slug, {
      html,
      generatedAt: new Date().toISOString(),
      isAiGenerated: Boolean(aiGeneratedContent)
    });

    return { html, isAiGenerated: Boolean(aiGeneratedContent) };
  }

  /**
   * Generates all SEO pages in batch with Google AI
   */
  public static async generateAllPages(): Promise<{ total: number; successCount: number; results: any[] }> {
    this.init();
    const results: any[] = [];
    let successCount = 0;

    for (const def of SEO_PAGES_DEFINITIONS) {
      try {
        const { isAiGenerated } = await this.getOrGeneratePage(def, true);
        results.push({
          slug: def.slug,
          url: `https://tonssproduction.com${def.routePath}`,
          title: def.title,
          isAiGenerated,
          status: 'success'
        });
        successCount++;
      } catch (err: any) {
        results.push({
          slug: def.slug,
          url: `https://tonssproduction.com${def.routePath}`,
          title: def.title,
          isAiGenerated: false,
          status: 'error',
          error: err.message
        });
      }
    }

    return {
      total: SEO_PAGES_DEFINITIONS.length,
      successCount,
      results
    };
  }

  /**
   * Builds high-standard, mobile-friendly, schema-rich HTML
   */
  private static assemblePageHtml(def: SeoPageDefinition, aiContent: any): string {
    const metaDesc = aiContent?.metaDescription || def.summary;
    const canonicalUrl = `https://tonssproduction.com${def.routePath}`;
    const highlights = aiContent?.highlights || [
      'Studio Média Hybride basé à Dakar (Parcelles Assainies & Almadies)',
      'Caméras Cinéma 4K/8K RAW, Optiques Anamorphiques & DaVinci Resolve',
      'Ingénierie Logicielle avancée (iOS, Android, Flutter & Cloud Distribué)',
      'Écosystème Waaxtu & Diffusion Internationale de contenus culturels'
    ];
    
    const articleHtml = aiContent?.articleContent || `
      <p class="mb-6 leading-relaxed text-slate-300">
        <strong>TONSS Production</strong> est le studio média hybride de référence à Dakar, combinant la maîtrise artistique de la narration cinématographique et la robustesse de l'ingénierie logicielle contemporaine. Fondé au Sénégal avec une ambition panafricaine et mondiale, notre studio conçoit des œuvres visuelles d'exception et des solutions logicielles scalables qui valorisent le patrimoine culturel tout en répondant aux standards technologiques les plus exigeants.
      </p>
      <h3 class="text-xl font-bold text-white uppercase font-['Montserrat'] mt-8 mb-4">Une infrastructure technique d'avant-garde</h3>
      <p class="mb-6 leading-relaxed text-slate-300">
        Sur le plan audiovisuel, nos équipes opèrent avec des systèmes de caméras cinéma de dernière génération (4K/8K), des séries d'optiques anamorphiques réputées pour leur texture organique, et des stations de post-production calibrées pour l'étalonnage HDR et le mixage surround multicanal. Côté technologie, nos ingénieurs développent des applications mobiles réactives et des plateformes web scalables propulsées par les infrastructures cloud mondiales les plus fiables.
      </p>
      <h3 class="text-xl font-bold text-white uppercase font-['Montserrat'] mt-8 mb-4">De la conception à la diffusion mondiale</h3>
      <p class="mb-6 leading-relaxed text-slate-300">
        Chaque projet bénéficie d'une double expertise : notre cellule narrative affine le scénario, le découpage technique et la direction artistique, tandis que notre pôle technologique garantit la souveraineté des données, l'interactivité numérique et la diffusion multi-écrans.
      </p>
    `;

    const faqItems = aiContent?.faqItems || [
      {
        q: "Comment démarrer un projet avec TONSS Production ?",
        a: "Contactez notre équipe via notre formulaire en ligne ou par téléphone (+221 33 843 77 35). Nous organisons un atelier de cadrage créatif et technique sous 24h ouvrées."
      },
      {
        q: "Quels sont les délais types pour cette prestation ?",
        a: "Les délais s'échelonnent généralement de 2 à 4 semaines pour les formats courts ou MVP d'applications, et de 2 à 6 mois pour les productions d'envergure ou plateformes complètes."
      },
      {
        q: "Intervenez-vous en dehors de Dakar et du Sénégal ?",
        a: "Oui, nos équipes de tournage et nos directeurs techniques se déplacent dans toute l'Afrique, en Europe et aux États-Unis."
      }
    ];

    // Build Schema.org JSON-LD
    const schemaJsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["LocalBusiness", "EntertainmentBusiness", "ProfessionalService"],
          "@id": "https://tonssproduction.com/#organization",
          "name": "TONSS Production",
          "url": "https://tonssproduction.com/",
          "logo": "https://tonssproduction.com/logo.png",
          "image": "https://tonssproduction.com/logo.png",
          "description": "Studio média hybride à Dakar : cinéma, audiovisuel 4K/8K, ingénierie logicielle et application Waaxtu.",
          "telephone": ["+221338437735", "+221780128862"],
          "email": "contact@tonssproduction.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "PA1 02 des Parcelles Assainies",
            "addressLocality": "Dakar",
            "addressRegion": "Dakar",
            "addressCountry": "SN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 14.757,
            "longitude": -17.438
          },
          "priceRange": "$$"
        },
        {
          "@type": "WebPage",
          "@id": canonicalUrl,
          "url": canonicalUrl,
          "name": def.title,
          "description": metaDesc,
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://tonssproduction.com/#website",
            "url": "https://tonssproduction.com/",
            "name": "TONSS Production"
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Accueil",
                "item": "https://tonssproduction.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Services",
                "item": "https://tonssproduction.com/#services"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": def.title,
                "item": canonicalUrl
              }
            ]
          }
        },
        {
          "@type": "FAQPage",
          "mainEntity": faqItems.map((item: any) => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.a
            }
          }))
        }
      ]
    };

    return `<!DOCTYPE html>
<html lang="fr" class="dark scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${def.title}</title>
  <meta name="description" content="${metaDesc}">
  <meta name="keywords" content="${[def.primaryKeyword, ...def.secondaryKeywords, 'TONSS Production', 'Dakar', 'Sénégal'].join(', ')}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph / Social -->
  <meta property="og:site_name" content="TONSS Production">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${def.title}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:image" content="https://tonssproduction.com/logo.png">
  <meta property="og:locale" content="fr_SN">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${def.title}">
  <meta name="twitter:description" content="${metaDesc}">
  <meta name="twitter:image" content="https://tonssproduction.com/logo.png">

  <!-- Structured Data JSON-LD for Google Search Console & Rich Snippets -->
  <script type="application/ld+json">
  ${JSON.stringify(schemaJsonLd, null, 2)}
  </script>

  <link rel="icon" type="image/png" href="/logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    body {
      background-color: #0c0c0c;
      color: #e2e8f0;
      font-family: 'Poppins', sans-serif;
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    .gold-text {
      color: #FFD700;
    }
    .gold-border {
      border-color: rgba(255, 215, 0, 0.3);
    }
    .gold-bg {
      background-color: #FFD700;
      color: #000;
    }
    .gold-btn {
      background-color: #FFD700;
      color: #000;
      font-family: 'Montserrat', sans-serif;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 12px 28px;
      border-radius: 8px;
      text-decoration: none;
      display: inline-block;
      transition: all 0.2s ease;
    }
    .gold-btn:hover {
      background-color: #ffe44d;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(255, 215, 0, 0.25);
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 24px 20px;
    }
    .card {
      background-color: #141414;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 28px;
      margin-bottom: 24px;
    }
    .tag {
      display: inline-block;
      background-color: rgba(255, 215, 0, 0.1);
      color: #FFD700;
      border: 1px solid rgba(255, 215, 0, 0.2);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 16px;
    }
    h1, h2, h3 {
      font-family: 'Montserrat', sans-serif;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.25;
    }
    a {
      color: #FFD700;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .faq-item {
      background: #111111;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 12px;
    }
    .faq-q {
      font-weight: 700;
      font-family: 'Montserrat', sans-serif;
      color: #ffffff;
      margin-top: 0;
      margin-bottom: 8px;
    }
    .faq-a {
      color: #cbd5e1;
      font-size: 14px;
      margin: 0;
    }
  </style>
</head>
<body>

  <!-- Top Bar Navigation -->
  <header style="background: #080808; border-bottom: 1px solid rgba(255,255,255,0.08); padding: 16px 0;">
    <div class="container" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
      <a href="/" style="display: flex; align-items: center; gap: 12px; text-decoration: none;">
        <img src="/logo.png" alt="Logo TONSS Production" width="36" height="36" style="border-radius: 6px;">
        <span style="font-family: 'Montserrat', sans-serif; font-weight: 900; color: #fff; font-size: 18px; letter-spacing: 1px;">
          TONSS <span class="gold-text">PRODUCTION</span>
        </span>
      </a>
      <nav style="display: flex; gap: 18px; font-size: 13px; font-weight: 600;">
        <a href="/">Accueil</a>
        <a href="/production-audiovisuelle">Audiovisuel</a>
        <a href="/cinema-longs-metrages">Cinéma</a>
        <a href="/developpement-applications">Technologie</a>
        <a href="/faq">FAQ</a>
        <a href="/#contact" class="gold-text">Contact</a>
      </nav>
    </div>
  </header>

  <!-- Main Article Content -->
  <main class="container" style="margin-top: 36px; margin-bottom: 60px;">
    
    <!-- Breadcrumb visual -->
    <div style="font-size: 12px; color: #94a3b8; margin-bottom: 20px;">
      <a href="/" style="color: #94a3b8;">Accueil</a> &nbsp;>&nbsp; 
      <span style="color: #FFD700;">${def.title}</span>
    </div>

    <div class="tag">Studio Média Hybride Dakar • Google Index Page</div>
    
    <h1 style="font-size: 32px; margin-bottom: 16px;">${def.h1}</h1>
    <p style="font-size: 16px; color: #cbd5e1; margin-bottom: 32px; max-width: 800px; font-weight: 300;">
      ${metaDesc}
    </p>

    <!-- Key Highlights Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 36px;">
      ${highlights.map((h: string) => `
        <div style="background: #121212; border: 1px solid rgba(255,215,0,0.2); border-radius: 8px; padding: 16px;">
          <div class="gold-text" style="font-size: 20px; font-weight: 900; margin-bottom: 6px;">✦</div>
          <div style="font-size: 13px; color: #e2e8f0; font-weight: 500;">${h}</div>
        </div>
      `).join('')}
    </div>

    <!-- Editorial Article Content -->
    <article class="card">
      <div style="font-size: 15px; color: #e2e8f0;">
        ${articleHtml}
      </div>

      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <a href="/#contact" class="gold-btn">Démarrer un projet avec TONSS</a>
        <a href="/" style="font-size: 14px; font-weight: 600; color: #cbd5e1;">Explorer toutes nos réalisations &rarr;</a>
      </div>
    </article>

    <!-- FAQ Accordion Block for Google Search Snippets -->
    <section class="card" style="border-color: rgba(255,215,0,0.25);">
      <h2 style="font-size: 22px; margin-bottom: 16px;">Questions Fréquentes sur cette prestation</h2>
      <p style="font-size: 13px; color: #94a3b8; margin-bottom: 24px;">
        Ces informations sont certifiées par l'équipe de direction de TONSS Production à Dakar.
      </p>

      ${faqItems.map((item: any) => `
        <div class="faq-item">
          <h3 class="faq-q">${item.q}</h3>
          <p class="faq-a">${item.a}</p>
        </div>
      `).join('')}
    </section>

    <!-- Keywords & Local Context for Crawlers -->
    <div style="font-size: 11px; color: #64748b; margin-top: 24px; line-height: 1.8;">
      <strong>Mots-clés associés :</strong> ${[def.primaryKeyword, ...def.secondaryKeywords].join(', ')} • 
      <strong>Zone d'intervention :</strong> Dakar, Parcelles Assainies, Almadies, Sénégal, UEMOA, Afrique de l'Ouest, Diaspora Internationale.
    </div>

  </main>

  <!-- Footer -->
  <footer style="background: #080808; border-top: 1px solid rgba(255,255,255,0.08); padding: 32px 0; font-size: 12px; color: #64748b;">
    <div class="container" style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
      <div>
        <p style="color: #fff; font-weight: 700; margin: 0 0 6px 0;">TONSS PRODUCTION</p>
        <p style="margin: 0;">Studio Média Hybride & Innovation Technologique • Dakar, Sénégal</p>
        <p style="margin: 4px 0 0 0;">PA1 02 des Parcelles Assainies • Téléphone : +221 33 843 77 35</p>
      </div>
      <div>
        <a href="/sitemap.xml" style="color: #FFD700; margin-right: 16px;">Plan du site (sitemap.xml)</a>
        <a href="/robots.txt" style="color: #94a3b8; margin-right: 16px;">Directives d'indexation (robots.txt)</a>
        <a href="/#contact" style="color: #94a3b8;">Contact direct</a>
      </div>
    </div>
  </footer>

</body>
</html>`;
  }
}
