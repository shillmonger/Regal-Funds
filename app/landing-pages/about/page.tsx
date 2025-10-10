"use client";

import { useRef } from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <Header />

      {/* HERO SECTION */}
      <section className="relative min-h-[800px] flex items-center overflow-hidden">
        {/* Background Image with #373E50 overlay */}
<div className="absolute inset-0 z-0">
  <Image
    src="/images/hero.jpg"
    alt="Hero Background"
    fill
    className="object-cover"
    priority
  />
  {/* Color overlay using #373E50 */}
  <div className="absolute inset-0 bg-[#373E50]/50" />
</div>


        {/* Hero Content */}
        <div className="relative z-10 text-white px-6 sm:px-10 md:px-20 max-w-5xl mt-[100px]">
          <h1 className="text-3xl font-serif sm:text-4xl md:text-4xl font-bold leading-snug">
            Regal strongly believes in alignment with investors. Principals and
            staff hold significant investments across all of Regal’s
            strategies.
          </h1>
        </div>
      </section>

      {/* OVERVIEW SECTION (Styled to Match Screenshot) */}
      <section className="max-w-7xl mx-auto py-20 px-6 md:px-10 lg:px-16">
        <div className="grid md:grid-cols-[250px_1fr] gap-12">
          {/* Left Sidebar */}
          <aside>
            {/* <aside className="lg:w-1/4 w-full lg:sticky lg:top-24 self-start h-fit"> */}

            <div className="bg-[#f5f7f7] w-full lg:sticky lg:top-24 self-start h-fit border border-gray-200 rounded-none overflow-hidden w-full">
              <nav className="flex flex-col">
                {/* Active item */}
                <Link
                  href="#"
                  className="bg-[#448D96] text-white font-medium py-3 px-4 border-b border-white"
                >
                  Overview
                </Link>

                {/* Inactive items */}
                <Link
                  href="#"
                  className="text-gray-700 hover:bg-gray-100 py-3 px-4 border-b border-gray-200 transition"
                >
                  Regal Partners (ASX:RPL)
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:bg-gray-100 py-3 px-4 transition"
                >
                  News
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="text-[15px] leading-relaxed text-gray-700">
            <h2 className="text-[20px] md:text-[25px] font-semibold text-[#1a1a1a] mb-6 leading-snug">
              Regal Funds Management is a multi-award winning specialist
              alternatives investment manager, pioneering the hedge fund,
              private markets and alternatives industry in Australia since it
              was founded in 2004
            </h2>

            <p className="mb-4">
              What started as a team of four, trading mostly long/short equities
              out of a small office in Sydney, is now a team of around 180
              people working together within the Regal Partners group to manage
              approximately $19.2 billion of investor capital across offices
              around Australia and offshore1. Four times awarded ‘Australian
              Alternative Investment Manager of the Year2’, Regal has expanded
              its strategies to include private markets, real & natural assets
              (via Kilter Rural, Attunga Capital, Argyle Group, Ark Capital
              Partners) and credit & royalties (via Regal Funds, Merricks
              Capital and Taurus Funds Management), in addition to our heritage
              in long/short equities (along with PM Capital).
            </p>

            {/* Subheading */}
            <p className="font-semibold text-[#1a1a1a] mt-6 mb-4">
              Our multi-asset investment capability leverages Regal’s
              operational capabilities, scale and infrastructure.
            </p>

            {/* Feature list */}
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">
                  1. Proprietary technology and operational infrastructure
                </h3>
                <p>
                  Proprietary operational, risk and trading infrastructure
                  provides an institutional-grade, back-office operating and
                  accounting platform for each team. Supported by real-time risk
                  monitoring and portfolio management tools, over 95% of global
                  exchanges are accessible, with a 24-hour daily trade cycle.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">
                  2. Extensive market relationships
                </h3>
                <p>
                  Deep relationships across global equity players, origination,
                  corporate access, and flow research broker networks. Our
                  investment team accesses 200+ global brokers and
                  counterparties daily.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">
                  3. Multi-asset product development, innovation and access
                </h3>
                <p>
                  The scale and sophistication of the platform enables the range
                  of Regal capabilities to be structured and accessed across a
                  broad number of pooled and single investment vehicles, both in
                  Australia and globally.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-10">
              <button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-5 py-5 text-sm uppercase tracking-wide transition cursor-pointer">
                VIEW CAPABILITIES &rarr;
              </button>
            </div>

            {/* Footnotes */}
            <div className="text-xs text-gray-500 mt-8 space-y-2 leading-snug">
              <p>
                1 Management estimate of funds under management (FUM) as at 31
                August 2024. FUM includes both Regal and external investors.
                Regal Partners Limited (ASX: RPL) is the parent company of Regal
                Funds Management, VGI Partners, Kilter Rural, and Taurus Funds
                Management.
              </p>
              <p>
                2 Australian Alternative Investment Manager of the Year —
                Australian Hedge Fund Awards 2016, 2018, 2019, 2020, 2023.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
