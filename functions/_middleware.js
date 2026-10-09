// Redirige l'ancienne adresse Cloudflare (ecrommerce-nextgen.pages.dev) et la version www
// vers le domaine principal, pour qu'il n'existe qu'une seule version du site (SEO).
// Les URL de prévisualisation (xxxx.ecrommerce-nextgen.pages.dev) ne sont pas redirigées.
const CANONICAL_HOST = 'ecrommerce-nextgen.fr';
const REDIRECT_HOSTS = ['ecrommerce-nextgen.pages.dev', 'www.ecrommerce-nextgen.fr'];

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (REDIRECT_HOSTS.includes(url.hostname)) {
    url.hostname = CANONICAL_HOST;
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
