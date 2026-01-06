// Series configuration for blog posts

export type Series = {
    id: string;
    name: string;
    color: string;
    bgColor: string;
    description?: string;
};

export const series: Record<string, Series> = {
    "Founder Insights": {
        id: "founder-insights",
        name: "Founder Insights",
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        description: "Insights and lessons from the founder journey",
    },
    "Tech Deep Dives": {
        id: "tech-deep-dives",
        name: "Tech Deep Dives",
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
        description: "Technical explorations and engineering insights",
    },
    "Agentic Coding": {
        id: "agentic-coding",
        name: "Agentic Coding",
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
        description: "Exploring AI-assisted development and agentic tools",
    },
};

export const getSeriesConfig = (seriesName?: string): Series | undefined => {
    if (!seriesName) return undefined;
    return series[seriesName];
};

export const getAllSeries = (): Series[] => {
    return Object.values(series);
};
