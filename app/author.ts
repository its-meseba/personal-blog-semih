// Author configuration for the blog

export const author = {
    name: "Mehmet Semih Babacan",
    handle: "@its_meseba",
    avatar: "/avatar.jpg", // Add your avatar image to public folder
    bio: "Software engineer & tech entrepreneur. Ex-CEO of Solace Technology. Building AI-native products.",
    links: {
        twitter: "https://x.com/its_meseba",
        linkedin: "https://www.linkedin.com/in/mehmetsemihbabacan",
        github: "https://github.com/koltukutsu",
    },
};

// Calculate estimated reading time based on word count
export const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
};

// Default read times for posts (add entries when creating new posts)
export const defaultReadTimes: Record<string, string> = {
    // Add entries like: "post-slug": "5 min read"
};

// Get read time for a post
export const getReadTime = (postId: string): string => {
    return defaultReadTimes[postId] || "5 min read";
};
