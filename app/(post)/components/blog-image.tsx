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
                    className="absolute inset-0 animate-pulse rounded-card bg-surface motion-reduce:animate-none"
                    style={{ aspectRatio: `${width}/${height}` }}
                />
            )}
            <NextImage
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={`rounded-card ${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-base ease-console`}
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
}
