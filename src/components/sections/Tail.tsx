"use client";

import React from "react";
import cvData from "@/data/cv.json";
import type { CV } from "@/types";

const cv = cvData as unknown as CV;
const { name } = cv.basics;
const currentYear = new Date().getFullYear();

export const Tail = () => {
  return (
    <footer className="w-full bg-black text-white py-3 print:hidden">
      <p className="text-xs text-center text-gray-400">
        © {currentYear} {name}. All rights reserved.
      </p>
    </footer>
  );
};
