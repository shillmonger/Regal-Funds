"use client";

import { useRef, useState, useEffect } from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const sections = ["overview", "regal-partners", "news"];
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

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
      <section className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 py-20 px-4 lg:px-0 lg:py-16">
        <div className="grid md:grid-cols-[250px_1fr] gap-12">
          {/* Left Sidebar */}
          <aside>
            {/* <aside className="lg:w-1/4 w-full lg:sticky lg:top-24 self-start h-fit"> */}

            <div className="bg-[#f5f7f7] w-full lg:sticky lg:top-24 self-start h-fit border border-gray-200 rounded-none overflow-hidden w-full">
              <nav className="flex flex-col">
                {/* Overview */}
                <Link
                  href="#overview"
                  className={`font-medium py-3 px-4 border-b transition ${
                    activeSection === "overview"
                      ? "bg-[#448D96] text-white border-white"
                      : "text-gray-700 hover:bg-gray-100 border-gray-200"
                  }`}
                >
                  Overview
                </Link>

                {/* Regal Partners */}
                <Link
                  href="#regal-partners"
                  className={`font-medium py-3 px-4 border-b transition ${
                    activeSection === "regal-partners"
                      ? "bg-[#448D96] text-white border-white"
                      : "text-gray-700 hover:bg-gray-100 border-gray-200"
                  }`}
                >
                  Regal Partners (ASX:RPL)
                </Link>

                {/* News */}
                <Link
                  href="#news"
                  className={`font-medium py-3 px-4 transition ${
                    activeSection === "news"
                      ? "bg-[#448D96] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  News
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div id="overview" className="text-[15px] leading-relaxed text-gray-700">
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

          {/* REGAL PARTNERS (ASX:RPL) SECTION */}
          <div id="regal-partners" className="text-[15px] leading-relaxed text-gray-700 mt-16">
            <h2 className="text-[20px] md:text-[25px] font-semibold text-[#1a1a1a] mb-6 leading-snug">
              Regal Partners Limited (ASX: RPL)
            </h2>

            <p className="mb-4">
              Regal Partners Limited (ASX: RPL) is the parent company of a group of leading alternative investment managers, including Regal Funds Management, VGI Partners, Kilter Rural, and Taurus Funds Management. Listed on the ASX in June 2021, Regal Partners provides investors with exposure to a diversified platform of alternative investment strategies.
            </p>

            <p className="mb-4">
              The group manages approximately $19.2 billion of investor capital across offices around Australia and offshore, with a team of around 180 people working together to deliver attractive risk-adjusted returns.
            </p>

            {/* Subheading */}
            <p className="font-semibold text-[#1a1a1a] mt-6 mb-4">
              Our Investment Managers
            </p>

            {/* Feature list */}
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">
                  Regal Funds Management
                </h3>
                <p>
                  A multi-award winning specialist alternatives investment manager, pioneering the hedge fund, private markets and alternatives industry in Australia since 2004. Regal Funds Management specialises in long/short equities, private markets, real & natural assets, and credit & royalties.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">
                  VGI Partners
                </h3>
                <p>
                  A leading Australian investment manager with a focus on fundamental long/short equity investing. VGI Partners applies a rigorous investment process to identify undervalued companies and generate attractive risk-adjusted returns.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">
                  Kilter Rural
                </h3>
                <p>
                  A specialist in Australian agricultural and water assets, Kilter Rural manages real & natural assets with a focus on sustainable farming and water resource management. The firm combines deep agricultural expertise with institutional-grade investment management.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">
                  Taurus Funds Management
                </h3>
                <p>
                  A specialist credit and royalties investment manager, Taurus focuses on generating attractive risk-adjusted returns through investments in private credit, royalties, and other income-generating assets.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-10">
              <button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-5 py-5 text-sm uppercase tracking-wide transition cursor-pointer">
                VIEW ASX ANNOUNCEMENTS &rarr;
              </button>
            </div>
          </div>

          {/* NEWS SECTION */}
          <div id="news" className="text-[15px] leading-relaxed text-gray-700 mt-16">
            <h2 className="text-[20px] md:text-[25px] font-semibold text-[#1a1a1a] mb-6 leading-snug">
              News and Insights
            </h2>

            <p className="mb-6">
              Stay up to date with the latest news, insights, and developments from Regal Funds Management and the broader Regal Partners group.
            </p>

            {/* News Items */}
            <div className="space-y-4">
              <div className="py-4 border-b border-gray-200 group cursor-pointer hover:bg-gray-50 transition duration-150 px-4 -mx-4 rounded-sm">
                <p className="text-xs font-medium text-gray-500 mb-2">November 21st, 2024</p>
                <p className="text-gray-800 text-base group-hover:text-[#448D96] transition duration-150">
                  Regal Investment Fund Announces Successful Completion of $95.3 Million Placement
                </p>
              </div>

              <div className="py-4 border-b border-gray-200 group cursor-pointer hover:bg-gray-50 transition duration-150 px-4 -mx-4 rounded-sm">
                <p className="text-xs font-medium text-gray-500 mb-2">November 19th, 2024</p>
                <p className="text-gray-800 text-base group-hover:text-[#448D96] transition duration-150">
                  Regal Investment Fund (ASX:RF1) - Announced Placement and UPP
                </p>
              </div>

              <div className="py-4 border-b border-gray-200 group cursor-pointer hover:bg-gray-50 transition duration-150 px-4 -mx-4 rounded-sm">
                <p className="text-xs font-medium text-gray-500 mb-2">October 30th, 2024</p>
                <p className="text-gray-800 text-base group-hover:text-[#448D96] transition duration-150">
                  Regal Investment Fund (ASX:RF1) - Investor Update 30 October 2024
                </p>
              </div>

              <div className="py-4 border-b border-gray-200 group cursor-pointer hover:bg-gray-50 transition duration-150 px-4 -mx-4 rounded-sm">
                <p className="text-xs font-medium text-gray-500 mb-2">October 17th, 2024</p>
                <p className="text-gray-800 text-base group-hover:text-[#448D96] transition duration-150">
                  Regal Australian Small Companies Fund wins AFMA Award
                </p>
              </div>

              <div className="py-4 border-b border-gray-200 group cursor-pointer hover:bg-gray-50 transition duration-150 px-4 -mx-4 rounded-sm">
                <p className="text-xs font-medium text-gray-500 mb-2">September 23rd, 2024</p>
                <p className="text-gray-800 text-base group-hover:text-[#448D96] transition duration-150">
                  Regal wins APAC Hedge Fund Performance Awards
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-10">
              <button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-5 py-5 text-sm uppercase tracking-wide transition cursor-pointer">
                VIEW ALL NEWS &rarr;
              </button>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
