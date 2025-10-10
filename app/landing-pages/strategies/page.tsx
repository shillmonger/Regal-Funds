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
            Regal seeks to be a leading provider of alternative investment
            strategies in Australia and Asia
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
                  All Strategies
                </Link>

                {/* Inactive items */}
                <Link
                  href="#"
                  className="text-gray-700 hover:bg-gray-100 py-3 px-4 border-b border-gray-200 transition"
                >
                  Multi Strategy
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:bg-gray-100 border-b border-gray-200 py-3 px-4 transition"
                >
                  Australian Equities
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:bg-gray-100 border-b border-gray-200 py-3 px-4 transition"
                >
                  Sector Equities
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:bg-gray-100 border-b border-gray-200 py-3 px-4 transition"
                >
                  Global Equities
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:bg-gray-100 border-b border-gray-200 py-3 px-4 transition"
                >
                  Private Markets/Pre-IPO
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:bg-gray-100 border-b border-gray-200 py-3 px-4 transition"
                >
                  Credit & Royalties
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:bg-gray-100 border-b border-gray-200 py-3 px-4 transition"
                >
                  ASX-Listed Investments
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:bg-gray-100 border-b border-gray-200 py-3 px-4 transition"
                >
                  Regal Investment Fund (ASX:RF1)
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:bg-gray-100 border-b border-gray-200 py-3 px-4 transition"
                >
                  Regal Asian Investments (ASX:RG8)
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:bg-gray-100 border-b border-gray-200 py-3 px-4 transition"
                >
                  Documents
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="text-[15px] leading-relaxed text-gray-700">
            <h2 className="text-[20px] md:text-[25px] font-semibold text-[#1a1a1a] mb-6 leading-snug">
              A diversified platform of alternative investment strategies
            </h2>

            {/* Subheading */}
            <p className="font-semibold text-[#1a1a1a] mt-6 mb-4">
              With a heritage in fundamental long/short investing, Regal are
              benchmark unaware, absolute return investors.
            </p>

            <p className="mb-4">
              We seek to identify, understand and capitalise from pricing
              inefficiencies that occur across and within global capital
              markets. Our investment strategies are focused on specific
              sectors, markets or asset classes where our extensive investment
              in human capital, technology infrastructure and market
              relationships provide attractive sources of ongoing alpha. A
              robust risk management framework exists at the core of every
              investment fund. Risk is carefully identified, measured and
              managed, utilising in-house and external risk systems, in
              conjunction with a dedicated risk committee.
            </p>



            {/* all about Multi Strategy down  */}
<section className="mb-16 mt-15">
        <h2 className="text-3xl font-serif text-gray-800 mb-8 pb-4 border-b border-gray-300">
          Multi Strategy
        </h2>

        <div className="mb-12">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Regal Partners Private Fund
          </h3>

          <div className="grid md:grid-cols-[180px_1fr] gap-8">
            {/* Left Column - Stats */}
            <div className="space-y-6">
              <div>
                <p className="text-xs text-gray-600 mb-1">
                  Unit price (mid price)<sup>1</sup>
                </p>
                <p className="text-2xl font-bold text-gray-900">$11.274</p>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">
                  Annualised return since inception<sup>2</sup>
                </p>
                <p className="text-2xl font-bold text-gray-900">17.1%</p>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Inception</p>
                <p className="text-xl font-semibold text-gray-900">December 2023</p>
              </div>
            </div>

            {/* Right Column - Description */}
            <div className="space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                The Regal Partners Private Fund aims to generate attractive risk adjusted absolute returns by investing in a range of Regal's high-performing alternative investment strategies. It is intended that the investment strategies will be highly diversified, with capital allocated across long / short equities, private credit, royalties, ventures and pre-IPO investments, and other uncorrelated asset classes.
              </p>

              <p className="text-sm text-gray-700 leading-relaxed">
                The Fund is grounded in the belief that a diversified portfolio, investing across a range of alternative asset classes and investment strategies, is key to achieving superior risk adjusted returns over the long term. Accessing a diversified range of alternative strategies via one investment vehicle is difficult, requiring scale, access, investment expertise and an institutional-grade platform.
              </p>

              <p className="text-sm text-gray-700 leading-relaxed">
                The Fund is open to applications and redemptions monthly and is suitable for wholesale and sophisticated investors who have a longer-term investment horizon.
              </p>

              <p className="text-sm text-gray-700 leading-relaxed">
                The strategy can be accessed via an Australian unit trust or a USD Cayman vehicle.
              </p>

              <div className="flex items-center justify-between mt-8">
                <p className="text-xs text-gray-600">
                  Wholesale & sophisticated investors<sup>3</sup>
                </p>
                <Button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-6 rounded-none text-xs font-semibold transition">
                  MORE INFORMATION 
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Long/Short Equities Section */}
      <section className="mb-16 border-b border-gray-300 pb-12">
        <h2 className="text-3xl font-serif text-gray-800 mb-8 pb-4 border-b border-gray-300">
          Long/Short Equities
        </h2>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Regal Australian Small Companies Fund
          </h3>

          <div className="grid md:grid-cols-[180px_1fr] gap-8">
            {/* Left Column - Stats */}
            <div className="space-y-6">
              <div>
                <p className="text-xs text-gray-600 mb-1">
                  Unit price (mid price)<sup>1</sup>
                </p>
                <p className="text-2xl font-bold text-gray-900">$3.52</p>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">
                  Annualised return since inception<sup>2</sup>
                </p>
                <p className="text-2xl font-bold text-gray-900">22.4%</p>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">
                  Annualised alpha since inception<sup>2</sup>
                </p>
                <p className="text-2xl font-bold text-gray-900">13.9%</p>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Inception</p>
                <p className="text-xl font-semibold text-gray-900">February 2015</p>
              </div>
            </div>

            {/* Right Column - Description */}
            <div className="space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                The Regal Australian Small Companies Fund aims to materially outperform the S&P/ASX Small Ordinaries Accumulation Index, net of fees over a rolling five-year period, utilising a 150/50 long/short investment approach with a primary focus on listed equities in Australia, typically outside the ASX 100.
              </p>

              <p className="text-sm text-gray-700 leading-relaxed">
                Since inception in 2015, the Fund has consistently ranked within the top performing Small Companies Funds in the Mercer peer group.
              </p>

              <p className="text-sm text-gray-700 leading-relaxed">
                The Fund is open to applications and redemptions daily and is suitable for wholesale and sophisticated investors who have a longer-term investment horizon.
              </p>

              <div className="flex items-center justify-between mt-8">
                <p className="text-xs text-gray-600">
                  Wholesale & sophisticated investors<sup>3</sup>
                </p>
                <Button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-6 rounded-none text-xs font-semibold transition">
                  MORE INFORMATION
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>


<section>
  <div className="space-y-12">
    {/* Regal Australian Long Short Equity Fund */}
    <div className="border-b border-gray-300 pb-12">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Regal Australian Long Short Equity Fund
      </h3>

      <div className="grid md:grid-cols-[180px_1fr] gap-8">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-600 mb-1">
              Unit price (mid price)<sup>1</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">$1.57</p>
          </div>

          <div>
            <p className="text-xs text-gray-600 mb-1">
              Annualised return since inception<sup>2</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">13.8%</p>
          </div>

          <div>
            <p className="text-xs text-gray-600 mb-1">
              Annualised alpha since inception<sup>5</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">4.6%</p>
          </div>

          <div>
            <p className="text-xs text-gray-600 mb-1">Inception</p>
            <p className="text-xl font-semibold text-gray-900">August 2009</p>
          </div>

          <p className="text-[10px] text-gray-600 pt-2">
            Performance, unit prices and inception dates reflect the Australian wholesale unit trust
          </p>
        </div>

        {/* Right Column - Description */}
        <div className="space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            The Regal Australian Long Short Equity Fund aims to outperform the S&P/ASX 300 Accumulation Index net of fees over a rolling five-year period, utilising a long/short, active extension investment approach in listed equities in Australia.
          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
            The Fund uses a 130/30 style and applies Regal’s fundamental investment process.
          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
            The Fund is open to applications and redemptions daily and is suitable for wholesale and sophisticated investors who have a longer-term investment horizon.
          </p>

          <div className="flex items-center justify-between mt-8">
            <p className="text-xs text-gray-600">
              Wholesale & sophisticated investors<sup>3</sup>
            </p>
            {/* Assuming a Button component similar to the sample */}
            <Button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-6 rounded-none text-xs font-semibold transition">
              MORE INFORMATION
            </Button>
          </div>
        </div>
      </div>
    </div>
    

    {/* Regal Resources Long Short Fund */}
    <div className="border-b border-gray-300 pb-12">

    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Regal Resources Long Short Fund
      </h3>

      <div className="grid md:grid-cols-[180px_1fr] gap-8">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-600 mb-1">
              Unit price (mid price)<sup>1</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">$1.20</p>
          </div>

          <div>
            <p className="text-xs text-gray-600 mb-1">
              Annualised return since inception<sup>2</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">12.4%</p>
          </div>

          {/* Note: Annualised alpha is missing for this fund in the image */}
          {/* A blank space or an equivalent element could be placed here if structure must be identical */}
          <div className="h-10"></div> 
          
          <div>
            <p className="text-xs text-gray-600 mb-1">Inception</p>
            <p className="text-xl font-semibold text-gray-900">November 2021</p>
          </div>

          <p className="text-[10px] text-gray-600 pt-2">
            Performance, unit prices and inception dates reflect the Australian unit trust
          </p>
        </div>

        {/* Right Column - Description */}
        <div className="space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            The Regal Resources Long Short Fund seeks to generate strong risk adjusted absolute returns over the medium to long term irrespective of underlying equity market movements.
          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
            The Fund seeks to benefit from the significant opportunities for value creation within the mining sector, while mitigating exposure to cyclical selloffs by generally running a low net market exposure.
          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
            The Fund is closed to new applications and offers redemptions monthly. It is suitable for wholesale and sophisticated investors who have a longer-term investment horizon.
          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
            The strategy can be accessed via an Australian unit trust or a USD Cayman vehicle.
          </p>


          <div className="flex items-center justify-between mt-8">
            <p className="text-xs text-gray-600">
              Wholesale & sophisticated investors<sup>3</sup>
            </p>
            {/* Assuming a Button component similar to the sample */}
            <Button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-6 rounded-none text-xs font-semibold transition">
              MORE INFORMATION
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</section>



<section>
  <div className="space-y-12 mt-12">
    {/* Regal Resources High Conviction Fund */}
    <div className="border-b border-gray-300 pb-12">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Regal Resources High Conviction Fund
      </h3>

      <div className="grid md:grid-cols-[180px_1fr] gap-8">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-600 mb-1">
              Unit price (mid price)<sup>1</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">$1.16</p>
          </div>

          <div>
            <p className="text-xs text-gray-600 mb-1">
              Annualised return since inception<sup>2</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">10.7%</p>
          </div>

          {/* This section for Annualised alpha is missing in the image for this fund, so we'll leave it out or add a placeholder for structural consistency if needed. Leaving out for exact replication. */}

          <div>
            <p className="text-xs text-gray-600 mb-1">Inception</p>
            <p className="text-xl font-semibold text-gray-900">December 2023</p>
          </div>
        </div>

        {/* Right Column - Description */}
        <div className="space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            The Regal Resources High Conviction Fund is a fundamentally driven long/short resources strategy, which aims to deliver strong absolute returns over a medium to long term investment horizon.
          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
            The Fund is built on our belief that the resources sector is set to outperform in the years ahead with numerous structural drivers contributing to looming deficits across a range of commodities, including those essential for decarbonisation. The Fund seeks to take advantage of volatility across the resources and commodity complex, concentrating on Regal's best long term high conviction long / short ideas.
          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
            The Fund is open to applications and redemptions monthly and is suitable for wholesale and sophisticated investors who have a longer-term investment horizon.
          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
            The strategy can be accessed via an Australian unit trust.
          </p>

          <div className="flex items-center justify-between mt-8">
            <p className="text-xs text-gray-600">
              Wholesale & sophisticated investors<sup>3</sup>
            </p>
            {/* Assuming a Button component similar to the sample */}
            <Button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-6 rounded-none text-xs font-semibold transition flex items-center">
              MORE INFORMATION 
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Regal Tactical Opportunities Fund */}
    <div className="border-b border-gray-300 pb-12">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Regal Tactical Opportunities Fund
      </h3>

      <div className="grid md:grid-cols-[180px_1fr] gap-8">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-600 mb-1">
              Unit price (mid price)<sup>1</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">$1.81</p>
          </div>

          <div>
            <p className="text-xs text-gray-600 mb-1">
              Annualised return since inception<sup>2</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">37.4%</p>
          </div>

          {/* This section for Annualised alpha is missing in the image for this fund, so we'll leave it out or add a placeholder for structural consistency if needed. Leaving out for exact replication. */}

          <div>
            <p className="text-xs text-gray-600 mb-1">Inception</p>
            <p className="text-xl font-semibold text-gray-900">July 2020</p>
          </div>
        </div>

        {/* Right Column - Description */}
        <div className="space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            The Regal Tactical Opportunities Fund seeks to generate absolute returns by identifying pricing inefficiencies in global markets.
          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
            The Fund’s strategy is grounded in the belief that while global capital markets are largely efficient, pricing anomalies can exist over the short to medium term as a result of external events or situations. The Fund seeks to identify and exploit these pricing inefficiencies, with an aim to generate consistent, positive absolute returns, regardless of movements in underlying markets.
          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
            The Fund utilises systematic, discretionary and tactical investment strategies primarily focused on global equity markets and futures. The Fund may also selectively invest in private and public credit opportunities.
          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
            The Fund is open to applications and redemptions monthly and is suitable for wholesale and sophisticated investors who have a longer-term investment horizon.
          </p>


          <div className="flex items-center justify-between mt-8">
            <p className="text-xs text-gray-600">
              Wholesale & sophisticated investors<sup>3</sup>
            </p>
            {/* Assuming a Button component similar to the sample */}
            <Button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-6 rounded-none text-xs font-semibold transition flex items-center">
              MORE INFORMATION 
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>



<section>
  <div className="space-y-12 mt-12">
    {/* Regal Resources High Conviction Fund */}
    <div className="border-b border-gray-300 pb-12">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
Regal Atlantic Absolute Return Fund
      </h3>

      <div className="grid md:grid-cols-[180px_1fr] gap-8">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-600 mb-1">
              Unit price (mid price)<sup>1</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">$1.81</p>
          </div>

          <div>
            <p className="text-xs text-gray-600 mb-1">
              Annualised return since inception<sup>2</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">37.4%</p>
          </div>

          {/* This section for Annualised alpha is missing in the image for this fund, so we'll leave it out or add a placeholder for structural consistency if needed. Leaving out for exact replication. */}

          <div>
            <p className="text-xs text-gray-600 mb-1">Inception</p>
            <p className="text-xl font-semibold text-gray-900">July 2020</p>
          </div>
        </div>

        {/* Right Column - Description */}
        <div className="space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
The Regal Tactical Opportunities Fund seeks to generate absolute returns by identifying pricing inefficiencies in global markets.          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
The Fund’s strategy is grounded in the belief that while global capital markets are largely efficient, pricing anomalies can exist over the short to medium term as a result of external events or situations. The Fund seeks to identify and exploit these pricing inefficiencies, with an aim to generate consistent, positive absolute returns, regardless of movements in underlying markets.          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
The Fund utilises systematic, discretionary and tactical investment strategies primarily focused on global equity markets and futures. The Fund may also selectively invest in private and public credit opportunities          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
The Fund is open to applications and redemptions monthly and is suitable for wholesale and sophisticated investors who have a longer-term investment horizon.          </p>

          <div className="flex items-center justify-between mt-8">
            <p className="text-xs text-gray-600">
              Wholesale & sophisticated investors<sup>3</sup>
            </p>
            {/* Assuming a Button component similar to the sample */}
            <Button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-6 rounded-none text-xs font-semibold transition flex items-center">
              MORE INFORMATION 
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Regal Tactical Opportunities Fund */}
    <div className="border-b border-gray-300 pb-12">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Regal Tactical Regal Atlantic Absolute Return Fund
      </h3>

      <div className="grid md:grid-cols-[180px_1fr] gap-8">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-600 mb-1">
              Unit price (mid price)<sup>1</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">$4.55</p>
          </div>

          <div>
            <p className="text-xs text-gray-600 mb-1">
              Annualised return since inception<sup>2</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">20.4%</p>
          </div>

          {/* This section for Annualised alpha is missing in the image for this fund, so we'll leave it out or add a placeholder for structural consistency if needed. Leaving out for exact replication. */}

          <div>
            <p className="text-xs text-gray-600 mb-1">Inception</p>
            <p className="text-xl font-semibold text-gray-900">March 2004</p>
          </div>
        </div>

        {/* Right Column - Description */}
        <div className="space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
The Regal Atlantic Absolute Return Fund aims to achieve high levels of absolute returns by pursuing an aggressive investment approach with an elevated level of risk.           </p>

          <p className="text-sm text-gray-700 leading-relaxed">
The Fund utilises a long/short strategy and is able to vary its exposure to markets and sectors over time, though will generally have a significant positive exposure to markets over the cycle.  It is managed using Regal’s fundamental investment process with the majority of companies listed in Australia and other Asian markets. The Fund may also have exposure to emerging markets.           </p>

          <p className="text-sm text-gray-700 leading-relaxed">
The Fund is open to applications monthly and redemptions quarterly and is suitable for wholesale and sophisticated investors who have a longer-term investment horizon.          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
The strategy can be accessed via an Australian unit trust or a USD Cayman vehicle.</p>


          <div className="flex items-center justify-between mt-8">
            <p className="text-xs text-gray-600">
              Wholesale & sophisticated investors<sup>3</sup>
            </p>
            {/* Assuming a Button component similar to the sample */}
            <Button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-6 rounded-none text-xs font-semibold transition flex items-center">
              MORE INFORMATION 
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>




<section>
  <div className="space-y-12 mt-12">
    {/* Regal Resources High Conviction Fund */}
    <div className="border-b border-gray-300 pb-12">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
Regal Tasman Market Neutral Fund
      </h3>

      <div className="grid md:grid-cols-[180px_1fr] gap-8">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-600 mb-1">
              Unit price (mid price)<sup>1</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">$2.34</p>
          </div>

          <div>
            <p className="text-xs text-gray-600 mb-1">
              Annualised return since inception<sup>2</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">12.7%</p>
          </div>

          {/* This section for Annualised alpha is missing in the image for this fund, so we'll leave it out or add a placeholder for structural consistency if needed. Leaving out for exact replication. */}

          <div>
            <p className="text-xs text-gray-600 mb-1">Inception</p>
            <p className="text-xl font-semibold text-gray-900">May 2007</p>
          </div>
        </div>

        {/* Right Column - Description */}
        <div className="space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
The multi award-winning Regal Market Neutral Strategy invests in Australian and pan-Asian markets with a high-conviction, fundamental long-short approach </p>
          <p className="text-sm text-gray-700 leading-relaxed">
The Fund maintains a low overall net market exposure (typically +/- 30% net exposure) and seeks to generate positive absolute returns over the medium to long term, with limited correlation to underlying equity markets.</p>

          <p className="text-sm text-gray-700 leading-relaxed">
The Fund is open to applications and redemptions monthly and is suitable for wholesale and sophisticated investors who have a longer-term investment horizon.        </p>

          <p className="text-sm text-gray-700 leading-relaxed">
The strategy can be accessed via an Australian unit trust or a USD Cayman vehicle.
   </p>

          <div className="flex items-center justify-between mt-8">
            <p className="text-xs text-gray-600">
              Wholesale & sophisticated investors<sup>3</sup>
            </p>
            {/* Assuming a Button component similar to the sample */}
            <Button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-6 rounded-none text-xs font-semibold transition flex items-center">
              MORE INFORMATION 
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Regal Tactical Opportunities Fund */}
    <div className="border-b border-gray-300 pb-12">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
Regal Global Small Companies Fund
      </h3>

      <div className="grid md:grid-cols-[180px_1fr] gap-8">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-600 mb-1">
              Unit price (mid price)<sup>1</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">$1.53</p>
          </div>

          <div>
            <p className="text-xs text-gray-600 mb-1">
              Return since inception<sup>2</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">55.4%</p>
          </div>

          {/* This section for Annualised alpha is missing in the image for this fund, so we'll leave it out or add a placeholder for structural consistency if needed. Leaving out for exact replication. */}

          <div>
            <p className="text-xs text-gray-600 mb-1">Inception</p>
            <p className="text-xl font-semibold text-gray-900">April 2025
</p>
          </div>
        </div>

        {/* Right Column - Description */}
        <div className="space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
The Fund aims to deliver strong, positive absolute returns over the medium to long term. The Fund will utilise a fundamental investment approach to construct a long / short portfolio, typically consisting of listed global small and mid-cap companies, with a bias towards investing in developed markets, including the US, Europe and Australia.    </p>

          <p className="text-sm text-gray-700 leading-relaxed">
 The Fund will typically seek to invest in long exposures that meet ‘quality’ and ‘growth’ criteria such as a strong revenue and earnings growth profile, attractive unit economics, conservative balance sheet position, exceptional management team, globally addressable market and structural growth tailwinds.
       </p>

          <p className="text-sm text-gray-700 leading-relaxed">
The Fund seeks to identify and benefit from the significant opportunities for value creation that consistently arise within the small mid-cap universe by identifying and exploiting pricing and research inefficiencies. To fulfil the Fund’s objective, it is expected that gross exposure will generally be between 150% and 250% and net exposure will generally be between -25% and +125%. The Fund may also invest in large cap companies, microcap companies, unlisted companies, pre-IPO investments, derivatives and futures to fulfil its objective.          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
The Fund is open to applications and redemptions monthly and is suitable for wholesale and sophisticated investors who have a medium-long term investment horizon.
</p>


          <div className="flex items-center justify-between mt-8">
            <p className="text-xs text-gray-600">
              Wholesale & sophisticated investors<sup>3</sup>
            </p>
            {/* Assuming a Button component similar to the sample */}
            <Button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-6 rounded-none text-xs font-semibold transition flex items-center">
              MORE INFORMATION
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>




<section>
  <div className="space-y-12 mt-12">
    {/* Regal Resources High Conviction Fund */}
    <div className="border-b border-gray-300 pb-12">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
Regal Emerging Companies Opportunities Fund
      </h3>

      <div className="grid md:grid-cols-[180px_1fr] gap-8">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-600 mb-1">
              Unit price (mid price)<sup>1</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">$1.66</p>
          </div>

          <div>
            <p className="text-xs text-gray-600 mb-1">
              Annualised return since inception<sup>2</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">13.5%</p>
          </div>

          {/* This section for Annualised alpha is missing in the image for this fund, so we'll leave it out or add a placeholder for structural consistency if needed. Leaving out for exact replication. */}

          <div>
            <p className="text-xs text-gray-600 mb-1">Inception</p>
            <p className="text-xl font-semibold text-gray-900">August 2020</p>
          </div>
        </div>

        {/* Right Column - Description */}
        <div className="space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
The Regal Emerging Companies Opportunities Fund is the fourth and final Fund in Regal’s highly successful Emerging Companies series. 
</p>
          <p className="text-sm text-gray-700 leading-relaxed">
Focused on identifying the next generation of leading Australian companies, the Fund invests in listed and unlisted microcap companies, pre-IPO opportunities, IPOs and secondary capital raisings.
</p>

          <p className="text-sm text-gray-700 leading-relaxed">
The Fund is open to applications quarterly and redemptions semi-annually and is suitable for wholesale and sophisticated investors who have a longer-term investment horizon.
    </p>

          <p className="text-sm text-gray-700 leading-relaxed">
The strategy can be accessed via an Australian unit trust or a USD Cayman vehicle.
   </p>

          <div className="flex items-center justify-between mt-8">
            <p className="text-xs text-gray-600">
              Wholesale & sophisticated investors<sup>3</sup>
            </p>
            {/* Assuming a Button component similar to the sample */}
            <Button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-6 rounded-none text-xs font-semibold transition flex items-center">
              MORE INFORMATION 
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Regal Tactical Opportunities Fund */}
    <div className="border-b border-gray-300 pb-12">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
Regal Private Credit Opportunities Fund
      </h3>

      <div className="grid md:grid-cols-[180px_1fr] gap-8">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-600 mb-1">
              Unit price (mid price)<sup>1</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">$1.03</p>
          </div>

          <div>
            <p className="text-xs text-gray-600 mb-1">
              Annualised Return since inception<sup>2</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">9.6%</p>
          </div>

          {/* This section for Annualised alpha is missing in the image for this fund, so we'll leave it out or add a placeholder for structural consistency if needed. Leaving out for exact replication. */}

          <div>
            <p className="text-xs text-gray-600 mb-1">Inception</p>
            <p className="text-xl font-semibold text-gray-900">October 2022
</p>
          </div>
        </div>

        {/* Right Column - Description */}
        <div className="space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
The Regal Private Credit Opportunities Fund targets returns of 8-12% p.a. through the cycle by focusing on private credit investments. It targets targeting bilaterally originated and negotiated loans to middle market companies, corporates owned by financial sponsors, as well as other idiosyncratic opportunities and credit solutions.          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
With a primary focus on first lien senior and secured floating rate loans, the Fund runs a flexible mandate and will tactically allocate capital across the credit spectrum depending on the most attractive risk adjusted return opportunities.       </p>


          <p className="text-sm text-gray-700 leading-relaxed">
The Fund pays distributions quarterly, is open to applications monthly, redemptions semi-annually (from July 2025 onwards) and is suitable for wholesale and sophisticated investors.</p>


          <div className="flex items-center justify-between mt-8">
            <p className="text-xs text-gray-600">
              Wholesale & sophisticated investors<sup>3</sup>
            </p>
            {/* Assuming a Button component similar to the sample */}
            <Button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-6 rounded-none text-xs font-semibold transition flex items-center">
              MORE INFORMATION
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>





<section>
  <div className="space-y-12 mt-12">
    {/* Regal Resources High Conviction Fund */}
    <div className="border-b border-gray-300 pb-12">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
Regal Resources Royalties Fund
      </h3>

      <div className="grid md:grid-cols-[180px_1fr] gap-8">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-600 mb-1">
              Unit price (mid price)<sup>1</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">$2.06</p>
          </div>

          <div>
            <p className="text-xs text-gray-600 mb-1">
              Annualised return since inception<sup>2</sup>
            </p>
            <p className="text-2xl font-bold text-gray-900">25.3%</p>
          </div>

          {/* This section for Annualised alpha is missing in the image for this fund, so we'll leave it out or add a placeholder for structural consistency if needed. Leaving out for exact replication. */}

          <div>
            <p className="text-xs text-gray-600 mb-1">Inception</p>
            <p className="text-xl font-semibold text-gray-900">August 2019</p>
          </div>
        </div>

        {/* Right Column - Description */}
        <div className="space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
The Regal Resources Royalties Fund seeks to provide investors with exposure to an attractive risk-adjusted asset class, providing a unique opportunity to gain exposure to an income stream uncorrelated to equity markets.
</p>
          <p className="text-sm text-gray-700 leading-relaxed">
The Fund invests in natural and renewable resource royalties, commodity streams and royalty related structure solutions, with an aim of building a portfolio of investments that provide both income and growth while seeking to minimize the downside risk usually associated with investing in mining activities such as costs and exploration expenditure
</p>

          <p className="text-sm text-gray-700 leading-relaxed">
The Fund is open to applications monthly and redemptions annually and is suitable for wholesale and sophisticated investors who have a longer-term investment horizon.
    </p>


          <div className="flex items-center justify-between mt-8">
            <p className="text-xs text-gray-600">
              Wholesale & sophisticated investors<sup>3</sup>
            </p>
            {/* Assuming a Button component similar to the sample */}
            <Button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-6 rounded-none text-xs font-semibold transition flex items-center">
              MORE INFORMATION
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Regal Tactical Opportunities Fund */}
    <div className="border-b border-gray-300 pb-12">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
Regal Investment Fund (ASX:RF1)
      </h3>

      <div className="grid md:grid-cols-[180px_1fr] gap-8">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-600 mb-1">
              Listed
            </p>
            <p className="text-2xl font-bold text-gray-900">June 2019</p>
          </div>
        </div>

        {/* Right Column - Description */}
        <div className="space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
ASX-listed Regal Investment Fund provides investors with an exposure to a selection of alternative investment strategies managed across Regal, with an objective to produce attractive risk-adjusted absolute returns over a period of more than five years with limited correlation to equity markets
       </p>
          <p className="text-sm text-gray-700 leading-relaxed">
RF1 is invested across nine alternative investment strategies, covering long/short equities, private markets, water, resources royalties and private credit.
   </p>


          <div className="flex items-center justify-between mt-8">
            <p className="text-xs text-gray-600">
              Wholesale & sophisticated investors<sup>3</sup>
            </p>
            {/* Assuming a Button component similar to the sample */}
            <Button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-6 rounded-none text-xs font-semibold transition flex items-center">
              VIEW WEBPAGE
            </Button>
          </div>
        </div>
      </div>
    </div>





 {/* Regal Tactical Opportunities Fund */}
    <div >
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
Regal Asian Investments (ASX:RG8)
      </h3>

      <div className="grid md:grid-cols-[180px_1fr] gap-8">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-600 mb-1">
              Listed
            </p>
            <p className="text-2xl font-bold text-gray-900">November 2019</p>
          </div>
        </div>

        {/* Right Column - Description */}
        <div className="space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
ASX-listed Regal Asian Investments provides investors with access to an actively-managed, concentrated portfolio, comprising long investments and short positions in Asian listed securities and companies with significant exposure to the Asian market.
       </p>
          <p className="text-sm text-gray-700 leading-relaxed">
In June 2022, portfolio management responsibilities transitioned from the VGI Partners investment team to Regal. Utilising a fundamental, bottom-up investment approach, the portfolio leverages Regal’s extensive experience, network and specialist investment team.
   </p>


          <div className="flex items-center justify-between mt-8">
            <p className="text-xs text-gray-600">
              Wholesale & sophisticated investors<sup>3</sup>
            </p>
            {/* Assuming a Button component similar to the sample */}
            <Button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-6 rounded-none text-xs font-semibold transition flex items-center">
              VIEW WEBPAGE
            </Button>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>



{/* Contact Us Section */}
                <div className="bg-[#373e501a] p-8 sm:p-10 rounded-none shadow-inner border border-gray-100 mt-20">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                        Contact Us
                    </h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                        <p>
                            If you are a securityholder and require assistance, please contact{" "}
                            <span className="text-[#448D96]">
                                +43 6888 7993 7235 
                            </span> (within Australia)
                            <br />
                            8:30am to 5:30pm Monday to Friday (Sydney time) or email{" "}
                            <Link
                                href="mailto:regalfund@cm.mpms.mufg.com"
                                className="text-[#448D96] hover:underline transition"
                            >
                                donaldevens86@gmail.com
                            </Link>
                        </p>

                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm">
                                As a result of the Corporations Amendment (Meetings and Documents) Act 2022, we will be sending you shareholder communications (including notices of meetings, other meeting-related documents and annual financial reports) ("Communications") electronically where you have provided us with an email address, unless you have specifically elected or requested otherwise.
                            </p>
                            <p className="text-sm mt-3">
                                You have the right to elect whether to receive some or all of these Communications in electronic or physical form and the right to elect not to receive annual financial reports at all. You also have the right to elect to receive a single specified Communication on an ad hoc basis, in an electronic or physical form.
                            </p>
                        </div>
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
