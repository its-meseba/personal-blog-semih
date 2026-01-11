// Structured data helpers for SEO
export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mehmet Semih Babacan",
    "alternateName": "Semih Babacan",
    "description": "Software engineer with 3 years of experience and dual degrees in Computer Science & Industrial Engineering. Ex-CEO of Solace Technology, building AI-native products and scalable systems.",
    "url": "https://semihbabacan.com",
    "sameAs": [
      "https://linkedin.com/in/mehmetsemihbabacan",
      "https://github.com/its-meseba",
      "https://www.researchgate.net/profile/Mehmet-Semih-Babacan"
    ],
    "jobTitle": "Software Engineer",
    "worksFor": {
      "@type": "Organization",
      "name": "Seeking New Opportunities"
    },
    "alumniOf": [
      {
        "@type": "EducationalOrganization",
        "name": "Yıldız Technical University",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Istanbul",
          "addressCountry": "Turkey"
        }
      }
    ],
    "knowsAbout": [
      "Software Engineering",
      "Artificial Intelligence",
      "Machine Learning",
      "Full Stack Development",
      "Python",
      "TypeScript",
      "React",
      "Next.js",
      "LangChain",
      "FastAPI",
      "Blockchain",
      "Smart Contracts",
      "Entrepreneurship",
      "Product Management"
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Bachelor of Science in Industrial Engineering",
        "credentialCategory": "degree",
        "educationalLevel": "bachelor",
        "recognizedBy": {
          "@type": "EducationalOrganization",
          "name": "Yıldız Technical University"
        }
      },
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Bachelor of Science in Computer Science",
        "credentialCategory": "degree",
        "educationalLevel": "bachelor",
        "recognizedBy": {
          "@type": "EducationalOrganization",
          "name": "Yıldız Technical University"
        }
      }
    ],
    "award": [
      "TÜBİTAK 1507 Grant Recipient",
      "STAR Presidential Research Program Participant"
    ]
  }
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Mehmet Semih Babacan",
    "description": "Personal website and thoughts of Mehmet Semih Babacan - Software Engineer & Tech Entrepreneur",
    "url": "https://semihbabacan.com",
    "author": {
      "@type": "Person",
      "name": "Mehmet Semih Babacan"
    },
    "inLanguage": "en-US",
    "copyrightYear": 2025,
    "genre": ["Technology", "Software Engineering", "Entrepreneurship", "AI"],
    "keywords": "software engineer, full stack developer, AI, machine learning, TypeScript, Python, React, Next.js, entrepreneur, startup founder, blockchain, smart contracts",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://semihbabacan.com/thoughts?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }
}

export function generateThoughtsSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Mehmet Semih Babacan's Thoughts",
    "description": "Insights on software engineering, AI, entrepreneurship, and technology innovation",
    "url": "https://semihbabacan.com/thoughts",
    "author": {
      "@type": "Person",
      "name": "Mehmet Semih Babacan",
      "url": "https://semihbabacan.com/about"
    },
    "publisher": {
      "@type": "Person",
      "name": "Mehmet Semih Babacan"
    },
    "inLanguage": "en-US",
    "genre": ["Technology", "Software Engineering", "Entrepreneurship"],
    "keywords": "technology thoughts, software engineering, AI insights, startup advice, full stack development"
  }
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "url": article.url,
    "datePublished": article.datePublished,
    "dateModified": article.dateModified || article.datePublished,
    "author": {
      "@type": "Person",
      "name": "Mehmet Semih Babacan",
      "url": "https://semihbabacan.com/about"
    },
    "publisher": {
      "@type": "Person",
      "name": "Mehmet Semih Babacan",
      "logo": {
        "@type": "ImageObject",
        "url": "https://semihbabacan.com/icon.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
    },
    "image": article.image || "https://semihbabacan.com/opengraph-image",
    "inLanguage": "en-US",
    "genre": "Technology",
    "keywords": "software engineering, technology, AI, entrepreneurship"
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Solace Technology",
    "description": "AI-driven conversational platform transforming complex digital processes into natural human dialogues",
    "url": "https://www.solace.com.tr",
    "founder": {
      "@type": "Person",
      "name": "Mehmet Semih Babacan",
      "url": "https://semihbabacan.com"
    },
    "foundingDate": "2023",
    "location": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Istanbul",
        "addressCountry": "Turkey"
      }
    },
    "industry": "Artificial Intelligence",
    "productOrService": [
      "Ensi - Smart Home Assistant",
      "EMA - Interactive Customer Assistant"
    ]
  }
}
