"use client";

import { useState } from "react";
import NextImage from "next/image";

interface BlogImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
}

export function BlogImage({ src, alt, width, height, className = "" }: BlogImageProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="relative">
            {isLoading && (
                <div
                    className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"
                    style={{ aspectRatio: `${width}/${height}` }}
                />
            )}
            <NextImage
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
}
