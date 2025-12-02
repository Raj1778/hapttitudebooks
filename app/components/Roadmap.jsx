"use client";
import { motion } from "framer-motion";
import {
  Book,
  Gift,
  Brain,
  MessageCircle,
  Trophy,
  UserCheck,
  Rocket,
} from "lucide-react";

const steps = [
  { id: 1, text: "Register for the Program", icon: <Book className="w-6 h-6" /> },
  { id: 2, text: "Receive Your Hapttitude Kit", icon: <Gift className="w-6 h-6" /> },
  { id: 3, text: "Immerse Yourself in Engaging Stories", icon: <Brain className="w-6 h-6" /> },
  { id: 4, text: "Reflect and Analyze Key Learnings", icon: <MessageCircle className="w-6 h-6" /> },
  { id: 5, text: "Share Your Experience with Us", icon: <UserCheck className="w-6 h-6" /> },
  { id: 6, text: "Receive Your Personalized Growth Guide", icon: <Trophy className="w-6 h-6" /> },
  { id: 7, text: "Step into the Journey of Future Leadership", icon: <Rocket className="w-6 h-6" /> },
];

export default function SELRoadmap() {
  return (
    <section className="bg-gradient-to-b from-orange-50 via-white to-orange-100 py-16">
      {/* ================= SEL SECTION ================= */}
      <div className="max-w-5xl mx-auto px-6 mb-24">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold text-orange-700 text-center mb-4 uppercase"
        >
          Social Emotional Learning (SEL)
        </motion.h1>

        <p className="text-center text-orange-500 font-medium mb-10">
          Our curriculum incorporates SEL to help children develop essential life skills, including:
        </p>

        <div className="grid md:grid-cols-2 gap-4 text-center font-semibold text-gray-800">
          <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-100">
            <p className="text-gray-900 font-bold">Self-Awareness:</p>
            <p className="text-gray-600 font-normal">
              Recognizing one's emotions and values.
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-100">
            <p className="text-gray-900 font-bold">Self-Management:</p>
            <p className="text-gray-600 font-normal">
              Regulating emotions and behaviors in different situations.
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-100">
            <p className="text-gray-900 font-bold">Social Awareness:</p>
            <p className="text-gray-600 font-normal">
              Showing empathy and understanding for others.
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-100">
            <p className="text-gray-900 font-bold">Relationship Skills:</p>
            <p className="text-gray-600 font-normal">
              Forming positive relationships, working in teams, and dealing effectively with conflict.
            </p>
          </div>
        </div>

        <div className="bg-orange-100 mt-6 py-4 px-6 rounded-xl shadow-sm text-center border border-orange-200">
          <p className="text-gray-800 font-bold">
            Responsible Decision-Making:
          </p>
          <p className="text-gray-700">
            Making ethical, constructive choices about personal and social behavior.
          </p>
        </div>
      </div>

      {/* ================= ROADMAP SECTION ================= */}
      <div className="relative max-w-4xl mx-auto mt-24">
        <h2 className="text-center text-4xl font-extrabold text-orange-700 mb-20 uppercase tracking-wide">
          Roadmap
        </h2>

        {/* ✅ FIXED: Road path moved slightly lower and extended fully */}
        <svg
          className="absolute left-1/2 -translate-x-1/2 top-[130px] h-[calc(100%-100px)] w-16 z-0"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M30 0 Q60 100, 30 200 T30 400 T30 600 T30 800"
            stroke="#d1d5db"
            strokeWidth="6"
            fill="none"
            strokeDasharray="12 12"
          />
        </svg>

        <div className="relative z-10 flex flex-col items-center space-y-20 mt-10">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex items-center gap-6 w-full md:w-[80%] ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="relative flex flex-col items-center justify-center">
                <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg border-4 border-white z-10">
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-full w-[3px] h-12 bg-gradient-to-b from-orange-400 to-transparent md:hidden"></div>
                )}
              </div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className={`bg-white p-5 rounded-2xl shadow-lg flex items-center gap-3 max-w-sm ${
                  index % 2 === 0
                    ? "text-left md:ml-10"
                    : "text-right md:mr-10 ml-auto"
                }`}
              >
                <span className="text-orange-600">{step.icon}</span>
                <p className="text-gray-700 font-semibold leading-snug">
                  {step.text}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= BOTTOM BANNER ================= */}
      <div className="mt-24 text-center bg-yellow-200 border-t-4 border-yellow-400 py-4 rounded-lg w-[90%] md:w-[60%] mx-auto shadow-md">
        <p className="text-gray-800 font-bold">
          Registration fee from Class 1st - 9th | Each Book ₹499
        </p>
      </div>
    </section>
  );
}
