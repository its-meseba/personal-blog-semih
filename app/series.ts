// Series configuration for blog posts

export type Series = {
    id: string;
    name: string;
    description?: string;
};

export const series: Record<string, Series> = {
    "Founder Insights": {
        id: "founder-insights",
        name: "Founder Insights",
        description: "Insights and lessons from the founder journey",
    },
    "Tech Deep Dives": {
        id: "tech-deep-dives",
        name: "Tech Deep Dives",
        description: "Technical explorations and engineering insights",
    },
    "Agentic Coding": {
        id: "agentic-coding",
        name: "Agentic Coding",
        description: "Exploring AI-assisted development and agentic tools",
    },
    "AI Product Sense": {
        id: "ai-product-sense",
        name: "AI Product Sense",
        description:
            "Judgement calls about building AI products: what to ship, what to charge for, what agents change",
    },
};

export const getSeriesConfig = (seriesName?: string): Series | undefined => {
    if (!seriesName) return undefined;
    return series[seriesName];
};

export const getAllSeries = (): Series[] => {
    return Object.values(series);
};
