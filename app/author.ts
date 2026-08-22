// Author configuration for the blog

export const author = {
  name: "Mehmet Semih Babacan",
  handle: "@its_meseba",
  avatar: "/avatar.jpg", // Add your avatar image to public folder
  /** Short role line — the positioning. Rendered under the name on bylines. */
  role: "AI Technical Product Manager",
  bio: "AI Technical Product Manager. Ex-CEO of Solace Technology. Building AI-native products, and writing about how they actually get built.",
  links: {
    twitter: "https://x.com/its_meseba",
    linkedin: "https://www.linkedin.com/in/mehmetsemihbabacan",
    github: "https://github.com/its-meseba",
  },
};

// Calculate estimated reading time based on word count
export const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};
