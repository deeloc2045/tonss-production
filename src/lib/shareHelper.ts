export const handleShare = (platform: 'whatsapp' | 'linkedin' | 'instagram', projectTitle: string) => {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`Découvrez le projet : ${projectTitle}`);
  
  if (platform === 'whatsapp') {
    window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
  } else if (platform === 'linkedin') {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  } else if (platform === 'instagram') {
    navigator.clipboard.writeText(`Découvrez le projet : ${projectTitle} ${window.location.href}`);
    alert('Lien copié dans le presse-papier pour Instagram !');
  }
};
