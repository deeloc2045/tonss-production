import React, { useEffect } from 'react';

interface LegalPageProps {
  type: 'legal' | 'privacy';
}

export function LegalPage({ type }: LegalPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  const isLegal = type === 'legal';

  return (
    <div className="w-full bg-[#121212] pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 p-8 md:p-12 rounded-xl">
        <h1 className="text-3xl md:text-5xl font-black text-white font-['Montserrat'] tracking-tight mb-8">
          {isLegal ? 'Mentions Légales' : 'Politique de Confidentialité'}
        </h1>

        {isLegal ? (
          <div className="space-y-8 text-slate-300 font-['Poppins'] leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. Éditeur du site</h2>
              <p>
                Le présent site est édité par <strong>TONSS PRODUCTION</strong>, 
                Studio Média Hybride basé à Dakar, Sénégal.<br />
                Adresse : PA1 02 des Parcelles Assainies<br />
                Téléphone : +221 33 843 77 35 / +221 78 012 88 62<br />
                Email : contact@tonssproduction.com
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. Propriété intellectuelle</h2>
              <p>
                L'ensemble de ce site relève de la législation sénégalaise et internationale sur le droit d'auteur 
                et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les 
                documents téléchargeables et les représentations iconographiques, photographiques, et audiovisuelles.
              </p>
              <p className="mt-2">
                La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est 
                formellement interdite sauf autorisation expresse du directeur de la publication.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. Hébergement</h2>
              <p>
                Le site est hébergé sur des serveurs sécurisés garantissant une haute disponibilité et la 
                protection des données.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-8 text-slate-300 font-['Poppins'] leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. Collecte des données personnelles</h2>
              <p>
                Dans le cadre de l'utilisation de notre site, notamment lors de l'utilisation de notre formulaire de 
                contact, nous pouvons être amenés à vous demander de nous communiquer des informations personnelles 
                (nom, adresse email, téléphone). Ces informations sont nécessaires pour répondre à vos demandes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. Utilisation des données</h2>
              <p>
                Les informations que vous nous communiquez sont destinées exclusivement à TONSS PRODUCTION. 
                Elles ne seront en aucun cas cédées, vendues ou louées à des tiers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. Vos droits</h2>
              <p>
                Conformément à la législation en vigueur sur la protection des données personnelles, vous disposez 
                d'un droit d'accès, de rectification, de modification et de suppression concernant les données qui 
                vous concernent. Vous pouvez exercer ce droit en nous contactant à l'adresse email suivante : 
                contact@tonssproduction.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">4. Cookies</h2>
              <p>
                Le site peut collecter automatiquement des informations standards telles que votre adresse IP 
                et votre type de navigateur à des fins de statistiques de consultation, via l'utilisation de cookies.
                Vous avez la possibilité de désactiver les cookies à partir des paramètres de votre navigateur.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
