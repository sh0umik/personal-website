import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Tail } from "@/components/sections/Tail";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { KeyboardManager } from "@/components/KeyboardManager";
import { Navigation } from "@/components/Navigation";
import { promises as fs } from "fs";
import path from "path";
import cvData from "@/data/cv.json";
import type { CV } from "@/types";

const cv = cvData as unknown as CV;
const { name, url } = cv.basics;

export const metadata: Metadata = {
  title: `Blog | ${name}`,
  description: `Blog posts by ${name} about backend engineering, Golang, microservices, and software architecture.`,
  alternates: {
    canonical: `${url}/blog`,
  },
};

async function getBlogPosts() {
  const contentDir = path.join(process.cwd(), "src", "app", "blog", "content");
  try {
    const files = await fs.readdir(contentDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    const posts = mdFiles.map((file) => {
      const slug = file.replace(".md", "");
      // Metadata mapping - in a real app, you might extract this from frontmatter
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
          title:
            "Continuous Integration of Golang with Gitlab Pipeline | পর্ব ১",
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
          title:
            "ওয়েব ডেভেলপমেন্ট ও ডকার (Docker) | পিএইচপি | ওরাকল | পর্ব ২.১",
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

      return {
        slug,
        ...metadata[slug],
      };
    });

    // Sort by date descending
    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    return [];
  }
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // JSON-LD Schema for Blog
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${name} Blog`,
    description: `Blog posts by ${name} about backend engineering, Golang, microservices, and software architecture.`,
    url: `${url}/blog`,
    author: {
      "@type": "Person",
      name: name,
      url: url,
    },
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
            <div className="space-y-6 md:col-span-4">
              <h1 className="text-3xl font-bold text-skin-base">Blog</h1>
              <p className="text-skin-muted">
                Welcome to my blog where I share insights about backend
                engineering, Golang, microservices, and software architecture.
              </p>
              <div className="space-y-6">
                {blogPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="group relative rounded-lg border border-skin-muted bg-skin-button-muted/30 p-6 transition-all hover:border-skin-hue/50 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-xl font-semibold text-skin-base group-hover:text-skin-hue transition-colors">
                          {post.title}
                        </h2>
                        <time className="text-xs text-skin-muted whitespace-nowrap">
                          {formatDate(post.date)}
                        </time>
                      </div>
                      <p className="text-sm text-skin-muted leading-relaxed">
                        {post.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded-md bg-skin-button-muted text-skin-muted border border-skin-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm font-medium text-skin-hue hover:underline inline-flex items-center gap-1 mt-2"
                      >
                        Read more
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
                          className="group-hover:translate-x-1 transition-transform"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <KeyboardManager />
        </main>
        <Tail />
      </div>
    </>
  );
}
