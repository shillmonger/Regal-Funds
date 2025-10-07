"use client";

import React from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { Star, Crown, Zap, Check } from "lucide-react";

export default function PlansPage() {
  const plans = [
    {
      icon: <Star className="h-8 w-8 text-emerald-500" />,
      name: "Basic Plan",
      price: "$100 - $900",
      range: "Ideal for new investors starting small",
      description: "Includes:",
      features: [
        "Access to Forex & Crypto markets",
        "Basic analytics dashboard",
        "Standard trading support",
      ],
      button: "Get Started",
      recommended: false,
    },
    {
      icon: <Crown className="h-8 w-8 text-yellow-500" />,
      name: "Golden Plan",
      price: "$1,000 - $10,000",
      range: "Perfect for growing traders",
      description: "Everything in Basic, Plus:",
      features: [
        "Advanced analytics & insights",
        "Dedicated account manager",
        "Faster trade execution",
        "Exclusive trading signals",
      ],
      button: "Upgrade to Golden",
      recommended: true,
    },
    {
      icon: <Zap className="h-8 w-8 text-emerald-500" />,
      name: "Pro Plan",
      price: "$11,000 - $50,000",
      range: "For professionals & institutions",
      description: "Everything in Golden, Plus:",
      features: [
        "Institution-level market access",
        "1-on-1 mentorship sessions",
        "Priority support 24/7",
      ],
      button: "Go Pro",
      recommended: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="text-center py-16 px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Choose the Perfect Plan for You
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Whether you're just starting or scaling up, our plans are built to
          match your trading ambitions with transparency and trusted performance.
        </p>
      </section>

      {/* Plans Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 shadow-lg border transition-all duration-300 hover:scale-105 ${
                plan.recommended
                  ? "border-emerald-500 bg-emerald-50 dark:bg-gray-900"
                  : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-500 text-white text-sm px-6 py-1 rounded-full font-medium shadow">
                    Recommended
                  </span>
                </div>
              )}

              <div className="mb-6 text-center">
                <div className="flex justify-center mb-4">{plan.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {plan.name}
                </h3>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                  {plan.price}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {plan.range}
                </p>
              </div>

              <div className="mb-8">
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-4">
                  {plan.description}
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-600 dark:text-gray-300 text-sm"
                    >
                      <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`w-full py-3 rounded-full font-semibold text-white transition ${
                  plan.recommended
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-lg"
                    : "bg-emerald-500 hover:bg-emerald-600 shadow"
                }`}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
