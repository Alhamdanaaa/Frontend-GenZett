// components/user/FAQItem.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((o) => !o);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={toggle}
        className="w-full flex justify-between items-center text-left"
      >
        <span className="font-medium text-gray-800">{question}</span>
        {isOpen 
          ? <ChevronUp className="w-5 h-5 text-gray-600" /> 
          : <ChevronDown className="w-5 h-5 text-gray-600" />
        }
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
              collapsed: { height: 0, opacity: 0, transition: { duration: 0.3 } },
            }}
            style={{ overflow: "hidden" }}
            className="mt-2 text-gray-600 text-sm"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
