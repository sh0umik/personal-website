import React from "react";
import { promises as fs } from "fs";
import path from "path";
import { marked } from "marked";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Tail } from "@/components/sections/Tail";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { KeyboardManager } from "@/components/KeyboardManager";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import type { Metadata } from "next";
import cvData from "@/data/cv.json";
import type { CV } from "@/types";

const cv = cvData as unknown as CV;
const { name, url } = cv.basics;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getBlogPost(slug: string) {
  const filePath = path.join(
    process.cwd(),
    "src",
    "app",
    "blog",
    "content",
    `${slug}.md`
  );
  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    return fileContents;
  } catch (error: any) {
    console.error("Error reading blog post:", error?.message || error);
    return null;
  }
}

async function getBlogPostSlugs() {
  const contentDir = path.join(process.cwd(), "src", "app", "blog", "content");
  try {
    const files = await fs.readdir(contentDir);
    return files
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.replace(".md", ""));
  } catch (error) {
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

function getBlogMetadata(slug: string) {
  const metadata: Record<
    string,
    { title: string; description: string; date: string; tags: string[] }
  > = {
    "microservices-ken-kokhon-kibhabe-part-2": {
      title: "মাইক্রোসার্ভিস কেন ? কখন ? কিভাবে ? | পর্ব ২",
      description:
        "মাইক্রোসার্ভিস আর্কিটেকচার ব্যবহার করার আগে জানা উচিত কেন এবং কখন এটি ব্যবহার করতে হবে।",
      date: "2018-08-28",
      tags: ["Microservices", "Architecture", "Golang", "Bengali"],
    },
    "continuous-integration-of-golang-with-gitlab-pipeline-part-1": {
      title: "Continuous Integration of Golang with Gitlab Pipeline | পর্ব ১",
      description:
        "Golang প্রোজেক্টের জন্য GitLab Pipeline ব্যবহার করে CI/CD সেটআপ করার গাইড।",
      date: "2018-02-22",
      tags: ["Golang", "CI/CD", "GitLab", "DevOps", "Bengali"],
    },
    "nosql-database-part-1": {
      title: "NoSQL ডাটাবেস | পর্ব ১",
      description:
        "NoSQL ডাটাবেস সম্পর্কে একটি বিস্তারিত গাইড, এর ব্যবহার এবং সুবিধা।",
      date: "2018-02-03",
      tags: ["NoSQL", "Database", "MongoDB", "Bengali"],
    },
    "web-development-docker-php-oracle-part-2-1": {
      title: "ওয়েব ডেভেলপমেন্ট ও ডকার (Docker) | পিএইচপি | ওরাকল | পর্ব ২.১",
      description: "ওয়েব ডেভেলপমেন্টে Docker ব্যবহারের সুবিধা এবং উদাহরণ।",
      date: "2017-07-03",
      tags: ["Docker", "Web Development", "PHP", "Oracle", "Bengali"],
    },
    "microservices-architecture-part-1": {
      title: "মাইক্রোসার্ভিস আর্কিটেক্টচার – পর্ব ১",
      description:
        "মাইক্রোসার্ভিস আর্কিটেকচার কী এবং কেন এটি ব্যবহার করা হয় তার একটি বিস্তারিত আলোচনা।",
      date: "2017-06-25",
      tags: ["Microservices", "Architecture", "Bengali"],
    },
    "docker-ki-part-1": {
      title: "ডকার (Docker) কি | পর্ব – ১",
      description:
        "Docker কী, এটি কীভাবে কাজ করে এবং কেন এটি ব্যবহার করা হয় তার একটি বিস্তারিত গাইড।",
      date: "2017-04-04",
      tags: ["Docker", "Containerization", "DevOps", "Bengali"],
    },
  };

  return metadata[slug] || null;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const metadata = getBlogMetadata(slug);

  if (!metadata) {
    return {
      title: "Post Not Found",
    };
  }

  const postUrl = `${url}/blog/${slug}`;
  const isoDate = new Date(metadata.date).toISOString();

  return {
    title: `${metadata.title} | ${name} Blog`,
    description: metadata.description,
    keywords: metadata.tags.join(", "),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      type: "article",
      title: metadata.title,
      description: metadata.description,
      url: postUrl,
      siteName: `${name} Portfolio`,
      locale: "en_US",
      publishedTime: isoDate,
      modifiedTime: isoDate,
      authors: [name],
      tags: metadata.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const content = await getBlogPost(slug);
  const metadata = getBlogMetadata(slug);

  if (!content || !metadata) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="relative grid max-w-7xl gap-12 p-8 max-sm:py-16 md:grid-cols-6 md:p-16 xl:gap-24 print:max-w-none print:grid-cols-1 print:gap-6 flex-1 mx-auto w-full">
          <div className="space-y-6 md:col-span-2 print:col-span-1 print:grid print:grid-cols-2 print:gap-5 print:space-y-0">
            <Hero />
            <About />
            <ThemeSwitch />
          </div>
          <div className="space-y-8 md:col-span-4 print:col-span-1 print:grid print:grid-cols-4 print:gap-2 print:space-y-0">
            <div className="md:col-span-4">
              <Navigation />
            </div>
            <div className="md:col-span-4">
              <h1 className="text-3xl font-bold text-skin-base mb-4">
                Post Not Found
              </h1>
              <p className="text-skin-muted mb-4">
                The blog post you're looking for doesn't exist.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-skin-hue hover:underline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Blog
              </Link>
            </div>
          </div>
        </main>
        <Tail />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Configure marked options
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // Remove the first H1 from markdown content to avoid duplication
  // Since we already have the title as H1 in the component, remove it from markdown
  let processedContent = content;
  // Match H1 at the start of the file (may have leading whitespace/newlines)
  const h1Pattern = /^#\s+(.+)$/m;
  if (h1Pattern.test(processedContent)) {
    // Remove the H1 line entirely instead of converting to H2
    processedContent = processedContent.replace(h1Pattern, "");
  }

  const htmlContent = marked.parse(processedContent);
  const isoDate = new Date(metadata.date).toISOString();

  // JSON-LD Schema for Article
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: metadata.title,
    description: metadata.description,
    author: {
      "@type": "Person",
      name: name,
      url: url,
    },
    datePublished: isoDate,
    dateModified: isoDate,
    keywords: metadata.tags.join(", "),
    url: `${url}/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col min-h-screen">
        <main className="relative grid max-w-7xl gap-12 p-8 max-sm:py-16 md:grid-cols-6 md:p-16 xl:gap-24 print:max-w-none print:grid-cols-1 print:gap-6 flex-1 mx-auto w-full">
          <div className="space-y-6 md:col-span-2 print:col-span-1 print:grid print:grid-cols-2 print:gap-5 print:space-y-0">
            <Hero />
            <About />
            <ThemeSwitch />
          </div>
          <div className="space-y-8 md:col-span-4 print:col-span-1 print:grid print:grid-cols-4 print:gap-2 print:space-y-0">
            <div className="md:col-span-4">
              <Navigation />
            </div>
            <article className="md:col-span-4">
              <div className="mb-6">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-medium text-skin-muted hover:text-skin-hue mb-4 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back to Blog
                </Link>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h1 className="text-3xl font-bold text-skin-base">
                    {metadata.title}
                  </h1>
                  <time
                    className="text-xs text-skin-muted whitespace-nowrap"
                    dateTime={isoDate}
                  >
                    {formatDate(metadata.date)}
                  </time>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-md bg-skin-button-muted text-skin-muted border border-skin-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </article>
          </div>
          <KeyboardManager />
        </main>
        <Tail />
      </div>
    </>
  );
}
