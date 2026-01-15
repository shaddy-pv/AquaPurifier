import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "product" | "article";
  price?: number;
  currency?: string;
  availability?: "in stock" | "out of stock";
}

const SEO = ({
  title,
  description,
  keywords,
  image = "/placeholder.svg",
  url = window.location.href,
  type = "website",
  price,
  currency = "INR",
  availability = "in stock",
}: SEOProps) => {
  const siteName = "AquaPure";
  const fullTitle = `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Product Schema for Products */}
      {type === "product" && price && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: title,
            description: description,
            image: image,
            offers: {
              "@type": "Offer",
              price: price,
              priceCurrency: currency,
              availability: `https://schema.org/${availability === "in stock" ? "InStock" : "OutOfStock"}`,
              url: url,
            },
          })}
        </script>
      )}

      {/* Organization Schema */}
      {type === "website" && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteName,
            url: "https://aquapure.com",
            logo: "https://aquapure.com/logo.png",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+91-1800-123-AQUA",
              contactType: "Customer Service",
            },
            sameAs: [
              "https://facebook.com/aquapure",
              "https://twitter.com/aquapure",
              "https://instagram.com/aquapure",
            ],
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
