"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Section } from "../Section";
import cvData from "@/data/cv.json";
import type { CV } from "@/types";

const cv = cvData as unknown as CV;
const { skills } = cv;

// Map skill names to Iconify icon IDs
const SKILL_ICONS: Record<string, string> = {
  Golang: "simple-icons:go",
  gRPC: "simple-icons:grpc",
  Docker: "logos:docker-icon",
  Kubernetes: "logos:kubernetes",
  MongoDB: "logos:mongodb-icon",
  Couchbase: "simple-icons:couchbase",
  ArangoDB: "simple-icons:arangodb",
  Redis: "logos:redis",
  PostgreSQL: "logos:postgresql",
  TypeScript: "logos:typescript-icon",
  React: "logos:react",
  Dart: "logos:dart",
  Flutter: "logos:flutter",
  AWS: "logos:aws",
  GCP: "logos:google-cloud",
  "GitLab CI": "logos:gitlab",
  "GitHub Actions": "simple-icons:githubactions",
  Git: "logos:git-icon",
  GitHub: "logos:github-icon",
};

interface SkillsProps {
  className?: string;
}

export const Skills = ({ className }: SkillsProps) => {
  return (
    <Section className={className} title="Skills">
      <ul className="inline-flex flex-wrap gap-6 [&>li]:text-sm">
        {skills.map(({ name }) => {
          const iconId = SKILL_ICONS[name];

          return (
            <li
              key={name}
              className="border-skin-hue/20s bg-skin-button-accent/20s borders border-solids flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-skin-muted print:border-none print:bg-transparent print:p-0 print:text-zinc-800"
            >
              {iconId && (
                <Icon
                  icon={iconId}
                  className="size-5"
                  style={{ width: "1.25rem", height: "1.25rem" }}
                />
              )}
              <span>{name}</span>
            </li>
          );
        })}
      </ul>
    </Section>
  );
};
