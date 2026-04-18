import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://xn--80aaa5cs.su';
const DEFAULT_OG = 'https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5c7dd87b-6724-4ae0-9a82-a6b7a36535ad/id-preview-5822b640--007c9296-2f23-4396-bea7-e9ac3305f58d.lovable.app-1775832101623.png';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  noindex?: boolean;
  canonical?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const SEO = ({ title, description, image, type = 'website', noindex, canonical, jsonLd }: SEOProps) => {
  const { pathname } = useLocation();
  const url = canonical || `${SITE_URL}${pathname}`;
  const ogImage = image || DEFAULT_OG;
  const fullTitle = title.includes('āsana') ? title : `${title} — āsana`;

  const lds = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:site_name" content="āsana" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {lds.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  );
};

export default SEO;
export { SITE_URL };
