"use client";

import Image from "next/image";
import Link from "next/link";
import { author } from "../author";

interface AuthorCardProps {
    showBio?: boolean;
    date?: string;
    readTime?: string;
}

export function AuthorCard({ showBio = false, date, readTime }: AuthorCardProps) {
    return (
        <div className="author-card">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {/* Fallback avatar with initials */}
                <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                    {author.name.split(" ").map(n => n[0]).join("")}
                </span>
            </div>
            <div className="author-info">
                <Link
                    href="/about"
                    className="author-name hover:underline"
                >
                    {author.name}
                </Link>
                <div className="author-meta">
                    {date && <span>{date}</span>}
                    {date && readTime && <span className="mx-1">·</span>}
                    {readTime && <span>{readTime}</span>}
                </div>
                {showBio && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {author.bio}
                    </p>
                )}
            </div>
        </div>
    );
}
