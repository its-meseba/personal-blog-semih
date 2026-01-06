"use client";

import { getSeriesConfig } from "../series";

interface SeriesBadgeProps {
    series?: string;
    size?: "sm" | "md";
}

export function SeriesBadge({ series, size = "sm" }: SeriesBadgeProps) {
    if (!series) return null;

    const config = getSeriesConfig(series);
    if (!config) return null;

    const sizeClasses = size === "sm"
        ? "text-[10px] px-1.5 py-0.5"
        : "text-xs px-2 py-1";

    return (
        <span
            className={`
        inline-flex items-center rounded-full font-medium
        ${config.color} ${config.bgColor}
        ${sizeClasses}
      `}
        >
            {config.name}
        </span>
    );
}
