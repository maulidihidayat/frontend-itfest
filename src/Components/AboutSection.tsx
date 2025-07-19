// components/AboutSection.tsx
"use client";
import React from "react";
import { BrainCircuit, Rocket, ShieldCheck } from "lucide-react";

const aboutCards = [
  {
    icon: BrainCircuit,
    title: "Visi Kami",
    content:
      "MindSlide diciptakan untuk mempermudah siapa pun menyulap dokumen menjadi presentasi yang menarik dan profesional hanya dalam hitungan detik. Dengan teknologi AI, kami ingin mempercepat proses berpikir, merangkum ide, dan menyampaikannya dalam format visual yang powerful—tanpa repot.",
  },
  {
    icon: Rocket,
    title: "Cara Kerja",
    content:
      "Cukup unggah file PDF, DOCX, atau TXT kamu—dan biarkan AI kami bekerja. MindSlide membaca, menganalisis, dan merangkum inti dari isi dokumen lalu mengubahnya menjadi slide PowerPoint otomatis. Cepat, akurat, dan bisa disesuaikan.",
  },
  {
    icon: ShieldCheck,
    title: "Kenapa MindSlide?",
    content:
      "Hemat waktu bikin presentasi, didukung AI canggih untuk ekstraksi ide, dan output PowerPoint yang siap pakai. MindSlide hadir untuk pelajar, dosen, pekerja profesional, atau siapa saja yang ingin presentasi tanpa drama.",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="w-full  bg-white dark:bg-[#0f172a] py-24 px-6 md:px-10 transition-colors duration-500 "
    >
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold  text-sky-400 mb-4">
          Tentang Kami
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-sm md:text-base mb-14">
          Pelajari bagaimana MindSlide bekerja dan mengapa kamu akan menyukainya.
        </p>

        {/* Card Grid */}
        <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {aboutCards.map((card, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-[#0f172a] p-8 rounded-3xl shadow-xl hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300"
            >
              {/* Icon */}
              <div className="absolute -top-6 left-6 w-14 h-14 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <card.icon size={26} className="text-indigo-600 dark:text-indigo-300" />
              </div>

              {/* Title & Content */}
              <div className="mt-10">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {card.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
