"use client";
import { IconChevronDown } from "@tabler/icons-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import React, { useRef, useState } from "react";
import { BoxReveal } from "./ui/box-reveal";

interface FAQItemProps {
  question: string;
  answer: string | React.ReactNode;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-neutral-200 dark:border-white/[0.2] rounded-xl overflow-hidden bg-white dark:bg-black mb-4 shadow-input dark:shadow-primary/20 transition-all duration-200 hover:shadow-lg">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 text-left"
        whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
        whileTap={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      >
        <h3 className="text-sm md:text-lg font-medium text-neutral-800 dark:text-neutral-200">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-neutral-500"
        >
          <IconChevronDown size={20} />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 text-neutral-600 dark:text-neutral-400 md:text-sm text-xs bg-neutral-50 dark:bg-neutral-900/50">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function FAQSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, {
    once: true,
    margin: "0px 0px -400px 0px",
  });

  return (
    <div
      className="pb-48 px-4 max-w-5xl mx-auto min-h-screen pt-40"
      id="faq"
      ref={containerRef}
    >
      <div className="flex flex-col items-center">
        <BoxReveal>
          <h2 className="mx-auto text-3xl md:text-7xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-bl from-primary to-primary-foreground">
            FAQ
          </h2>
        </BoxReveal>
      </div>
      <p className="text-sm md:text-lg text-center text-neutral-600 dark:text-neutral-400 mb-12 mx-auto">
        Beberapa pertanyaan yang sering ditanyakan oleh pengguna baru MINDSLIDE.AI
      </p>

      <div className="space-y-2 md:space-y-4">
        {faqItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      delay: index * 0.15, // Sequential delay based on item index
                      ease: [0.22, 1, 0.36, 1], // Custom spring-like easing
                    },
                  }
                : {}
            }
          >
            <FAQItem question={item.question} answer={item.answer} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const faqItems = [
  {
    question: "Apa sih Mind Slide itu?",
    answer:
      "Mind Slide adalah platform berbasis AI yang membantu mengubah dokumen PDF menjadi file presentasi PowerPoint (PPTX) secara otomatis. Dengan memahami isi dan struktur dokumen, Mind Slide menyusun ulang poin-poin penting ke dalam format slide yang rapi, informatif, dan siap digunakan. Cocok untuk pelajar, dosen, profesional, atau siapa pun yang ingin menghemat waktu dalam membuat presentasi dari dokumen teks yang sudah ada.",
  },
  {
    question: "Gimana cara join Himpunan ini?",
    answer: (
      <div className="space-y-2">
        <p className="text-gray-600 mb-8">
      Ikuti langkah mudah berikut untuk mengubah dokumen PDF menjadi presentasi PowerPoint (.pptx) dengan cepat dan otomatis menggunakan Mind Slide.
    </p>
    <ol className="text-left text-gray-700 space-y-4 list-decimal list-inside">
      <li><strong>Buka situs Mind Slide</strong> di <a href="https://mindslide.ai" className="text-blue-500 underline" target="_blank">mindslide.ai</a>.</li>
      <li><strong>Login</strong> atau daftar jika diperlukan.</li>
      <li><strong>Unggah file PDF</strong> yang ingin diubah menjadi presentasi.</li>
      <li><strong>Tunggu proses AI</strong> menyusun konten ke dalam bentuk slide otomatis.</li>
      <li><strong>Review & edit</strong> slide jika perlu untuk menyesuaikan.</li>
      <li><strong>Download</strong> hasilnya sebagai file PowerPoint (.pptx).</li>
    </ol>
      </div>
    ),
  },
  {
    question: "Apakah MINDSLIDE.AI gratis?",
    answer:(

      <div>
        <p className="text-gray-700 text-lg">
          Ya, <strong>Mind Slide bisa digunakan secara gratis!</strong> Kamu cukup unggah file PDF, dan dalam hitungan detik file tersebut akan diubah menjadi presentasi PowerPoint (PPTX) secara otomatis tanpa biaya.
        </p>
        <p className="text-gray-600 mt-4">
          Tidak perlu login atau langganan—langsung pakai dan nikmati kemudahannya!
        </p>
      </div>
    )
  },
  {
    question: "Format file apa saja yang didukung?",
    answer: "Umumnya PDF, tapi bisa ditambahkan jika ada dukungan lain seperti DOCX.",
  },
  {
    question: "Apakah perlu koneksi internet untuk menggunakan Mind Slide?",
    answer:"Ya, karena ini adalah aplikasi berbasis web."
    
  },
];