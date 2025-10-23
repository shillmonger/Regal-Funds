"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Header from "@/components/ui/header"; // Assuming this component exists
import Footer from "@/components/ui/footer"; // Assuming this component exists
import { Button } from "@/components/ui/button"; // Assuming this component exists
import Image from "next/image";


/* HELPER COMPONENTS                           */

// Helper component for a document link
const DocumentLink = ({ title, href }: { title: string; href: string }) => (
  <Link href={href} className="flex justify-between items-center py-3 group">
    <span className="text-gray-700 group-hover:text-[#448D96] transition duration-200">
      {title}
    </span>
    {/* Simple arrow icon */}
    <span className="text-xl text-gray-400 group-hover:text-[#448D96] transition duration-200 ml-4">
      &rarr;
    </span>
  </Link>
);

// Helper component for a news item
const NewsItem = ({ date, title }: { date: string; title: string }) => (
  <div className="py-3 border-b border-gray-100 group cursor-pointer hover:bg-gray-50 transition duration-150 px-2 -mx-2 rounded-sm">
    <p className="text-xs font-medium text-gray-500 mb-1">{date}</p>
    <p className="text-gray-800 text-base group-hover:text-[#448D96] transition duration-150">
      {title}
    </p>
  </div>
);

// Helper component for a video card
const VideoCard = ({
  imageSrc,
  title,
  subTitle,
  href,
}: {
  imageSrc: string;
  title: string;
  subTitle?: string;
  href: string;
}) => (
  <Link href={href} className="block group">
    <div className="relative w-full aspect-video overflow-hidden mb-3 rounded-none shadow-md">
      <Image
        src={imageSrc}
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, 33vw"
        className="object-cover transition duration-300 ease-in-out group-hover:scale-105"
      />

      {/* ✅ Custom Play Button Image Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition duration-300">
        <Image
          src="/images/play-button.png"
          alt="Play Button"
          width={70}
          height={70}
          className="opacity-90 group-hover:opacity-100 transition duration-300"
        />
      </div>
    </div>

    <p className="text-base font-semibold text-gray-800 group-hover:text-[#448D96] transition">
      {title}
    </p>
    {subTitle && <p className="text-sm text-gray-500">{subTitle}</p>}
  </Link>
);


// Custom component for the Accordion Item (FAQ)
const FaqItem = ({ title, content }: { title: string; content: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full py-4 text-left group transition duration-300"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-medium text-gray-800 group-hover:text-[#448D96]">
          {title}
        </h3>
        <div className="w-10 h-10 flex items-center justify-center bg-[#448D96] text-white transition-transform duration-300">
          <span className="text-3xl font-light">
            {/* Simple plus/minus using CSS and Tailwind */}
            {isOpen ? '-' : '+'}
          </span>
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-gray-600 pr-10">{content}</p>
      </div>
    </div>
  );
};


/* MAIN PAGE COMPONENT */

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollTo({
        left:
          scrollContainerRef.current.scrollLeft +
          (direction === "left" ? -scrollAmount : scrollAmount),
        behavior: "smooth",
      });
    }
  };

  // Dummy content for the FAQ section
  const faqData = [
    {
      title: "About the Fund",
      content:
        "RF1 is a listed investment company (LIC) providing investors with exposure to a selection of alternative investment strategies managed by Regal. It aims to produce attractive risk-adjusted returns over the long term.",
    },
    {
      title: "Risks",
      content:
        "The Fund involves various risks, including market risk, liquidity risk, and strategy risk. Investors should refer to the Product Disclosure Statement (PDS) for a detailed explanation of all risks before investing.",
    },
    {
      title: "Fee Structure",
      content:
        "Fees typically include a management fee and a performance fee, which is subject to a high-water mark. Full details on the calculation and payment of fees are available in the PDS.",
    },
    {
      title: "Marketing",
      content:
        "We occasionally communicate updates and insights through email alerts and our website. We do not engage in cold calling or unsolicited advice regarding investment decisions.",
    },
    {
      title: "About the Manager",
      content:
        "Regal Funds Management is the investment manager for RF1, with a long history of managing alternative investment strategies in Australia and overseas.",
    },
    {
      title: "Other questions",
      content:
        "For any other questions, please refer to the relevant section of our website or use the contact details provided below to get in touch with our investor services team.",
    },
  ];


  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="container">
        <section className="relative min-h-[800px] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero.jpg"
              alt="Hero Background"
              fill
              className="object-cover"
              priority
            />
  <div className="absolute inset-0 bg-[#373E50]/50" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-white px-6 sm:px-10 md:px-20 max-w-5xl mt-[200px]">
            <h1 className="text-3xl font-serif sm:text-4xl md:text-5xl font-bold mb-6">
              Regal Investment Fund (ASX: RF1)
            </h1>

            <p className="text-[18px]  sm:text-[20px] mb-20 leading-relaxed">
              Listed on the ASX in June 2019, RF1 provides investors with
              exposure to a selection of alternative investment strategies,
              aiming to produce attractive risk-adjusted returns over more than
              five years with limited correlation to equity markets.
            </p>

<Link href="/auth/login">
            <Button
              size="lg"
              className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-7 text-[15px] transition-all hover:scale-105 cursor-pointer rounded-none"
            >
              START INVESTING TODAY
            </Button>
</Link>
          </div>
        </section>
      </div>

      {/* Investment Strategy Section (Section starts here, contains sidebar and main content) */}
      <section className="px-6 sm:px-10 md:px-20 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
<aside className="lg:w-1/4 w-full lg:sticky lg:top-24 self-start h-fit">
  <div className="border border-gray-200 rounded-none  bg-white shadow-sm">
    <ul className="divide-y divide-gray-200">
      <li className="p-4 hover:bg-gray-100 cursor-pointer">RFI Home</li>
      <li className="p-4 hover:bg-gray-100 cursor-pointer">Past Monthly Updates</li>
      <li className="p-4 hover:bg-gray-100 cursor-pointer">Share Price Information</li>
      <li className="p-4 hover:bg-gray-100 cursor-pointer">ASX Announcements</li>
      <li className="p-4 hover:bg-gray-100 cursor-pointer">Email Alerts</li>
      <li className="p-4 hover:bg-gray-100 cursor-pointer">Share Registry</li>
      <li className="p-4 hover:bg-gray-100 cursor-pointer">FAQ</li>
    </ul>
  </div>
</aside>


          {/* Main Content */}
          <main className="lg:w-3/4 w-full">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
              Exposure to a range of alternative investment strategies
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              The investment philosophy of RF1 is grounded in the belief that a
              diversified portfolio of assets, using a range of investment
              strategies backed by long-term capital, is key to the potential of
              achieving greater risk-adjusted returns over the long term.
            </p>

            <p className="text-gray-700 leading-relaxed mb-8">
              In order to achieve its objective, RF1 will provide investors with
              exposure to a range of investment strategies managed by Regal,
              where strategy allocations are adjusted over time depending on
              prevailing market conditions.
            </p>

            {/* Placeholder for Image */}
            <div className="w-full rounded-md overflow-hidden mb-8">
              <Image
                src="/images/RF1.png" // 👈 path to your image
                alt="Investment Strategy Chart"
                width={500}
                height={450}
                className="object-contain"
              />
            </div>

            <h3 className="text-xl font-semibold mb-4">Investing with Regal</h3>

            <p className="text-gray-700 leading-relaxed mb-8">
              The Regal Investment Fund provides investors with exposure to
              Regal’s investment expertise, including our 20-year long track
              record of managing alternative investment strategies. The
              investment team members have, on average, over ten years’
              experience in financial markets both in Australia and overseas,
              with extensive experience of investing through many market cycles.
            </p>

            <Button
              size="lg"
              className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-5 py-6 text-[14px] transition-all hover:scale-105 cursor-pointer rounded-none"
            >
              VIEW TEAM &rarr;
            </Button>

            <h3 className="text-xl font-semibold mt-12 mb-4">Risk</h3>
            <p className="text-gray-700 leading-relaxed">
              The Fund may appeal to investors who are seeking risk-adjusted
              absolute returns from alternative investment strategies to
              diversify their investment portfolio. Investors should regard any
              investment in the Fund as a long-term proposition and be aware
              that substantial fluctuations in the value of the portfolio held
              by the Fund may occur on a month-to-month basis or over that
              period. A detailed explanation of risks is available in the{" "}
              <Link
                href="#"
                className="text-[#448D96] hover:underline transition"
              >
                Product Disclosure Statement
              </Link>
              .
            </p>

            {/* ASX Announcements & Share Price Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
              {/* ASX Announcements */}
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 border-b-2 border-[#4a7d82] pb-2">
                  ASX Announcements
                </h2>

                <ul className="divide-y divide-gray-200 text-gray-700">
                  {[
                    {
                      date: "09 Oct 2025",
                      title: "Update - Notification of buy-back - RF1",
                    },
                    {
                      date: "08 Oct 2025",
                      title: "Investor Update & Q&A Webinar - 8 Oct 2025",
                    },
                    {
                      date: "08 Oct 2025",
                      title: "Update - Notification of buy-back - RF1",
                    },
                    {
                      date: "07 Oct 2025",
                      title: "Update - Notification of buy-back - RF1",
                    },
                    {
                      date: "06 Oct 2025",
                      title: "Notification of cessation of securities - RF1",
                    },
                    {
                      date: "06 Oct 2025",
                      title:
                        "RF1 Weekly Estimate NAV for 03.10.2025: $3.70",
                    },
                  ].map((item, index) => (
                    <li key={index} className="flex justify-between py-3">
                      <span className="text-sm text-gray-500 w-32 shrink-0">{item.date}</span>
                      <span className="flex-1 ml-4 hover:text-[#448D96] transition duration-200 cursor-pointer">
                        {item.title}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="mt-6 bg-[#448D96] hover:bg-[#3a7d85] text-white px-8 py-6 text-sm rounded-none transition-all hover:scale-105"
                >
                  READ MORE &rarr;
                </Button>
              </div>

              {/* Share Price */}
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 border-b-2 border-[#4a7d82] pb-2">
                  Share Price
                </h2>

                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <p className="text-5xl font-bold mb-2">$3.33</p>
                    <p className="text-gray-700">RF1 Mkt Cap: -</p>
                    <p className="text-gray-500 text-sm mt-1">
                      The Market is currently Open
                    </p>
                  </div>

                  <div className="flex flex-col items-end mt-6 md:mt-0">
                    <Image
                      src="https://www.regalfm.com/site/content/images/asxLogo_80.png" // 👈 Replace with your ASX logo path
                      alt="ASX Logo"
                      width={60}
                      height={60}
                      className="mb-2"
                    />
                    <p className="text-sm text-gray-700">10th Oct 2025</p>
                    <p className="text-xs text-gray-500">Price Delay ~20min</p>
                  </div>
                </div>

                <Button
                  className="mt-8 bg-[#448D96] hover:bg-[#3a7d85] text-white px-8 py-6 text-sm rounded-none transition-all hover:scale-105"
                >
                  READ MORE &rarr;
                </Button>
              </div>
            </div>

            {/* -------------------------------------------------------------------------------------- */}
            {/* START OF ADDED CONTENT: Documents, News & Insights, Learn More */}
            {/* -------------------------------------------------------------------------------------- */}

            <div className="mt-16 pt-8 border-t border-gray-200">
              <h2 className="text-3xl font-semibold mb-8">Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <div className="space-y-2">
                  <DocumentLink
                    title="ANNUAL RG240 UPDATE"
                    href="#"
                  />
                  <DocumentLink
                    title="CORPORATE GOVERNANCE STATEMENT"
                    href="#"
                  />
                  <DocumentLink
                    title="POLICIES AND CHARTERS"
                    href="#"
                  />
                </div>
                <div className="space-y-2">
                  <DocumentLink
                    title="PRODUCT DISCLOSURE STATEMENT"
                    href="#"
                  />
                  <DocumentLink title="CONSTITUTION" href="#" />
                  <DocumentLink
                    title="DISTRIBUTION RE-INVESTMENT PLAN"
                    href="#"
                  />
                </div>
              </div>
              {/* Optional Divider for separation */}
              <div className="border-t border-gray-200 mt-8" />

              <h2 className="text-3xl font-semibold mt-12 mb-6">
                News and Insights
              </h2>
              <div className="max-w-xl">
                <div className="divide-y divide-gray-200">
                  <NewsItem
                    date="November 21st, 2024"
                    title="Regal Investment Fund Announces Successful Completion of $95.3 Million Placement"
                  />
                  <NewsItem
                    date="November 19th, 2024"
                    title="Regal Investment Fund (ASX:RF1) - Announced Placement and UPP"
                  />
                  <NewsItem
                    date="October 30th, 2024"
                    title="Regal Investment Fund (ASX:RF1) - Investor Update 30 October 2024"
                  />
                  <NewsItem
                    date="October 17th, 2024"
                    title="Regal Australian Small Companies Fund wins AFMA Award"
                  />
                  <NewsItem
                    date="September 23rd, 2024"
                    title="Regal wins APAC Hedge Fund Performance Awards"
                  />
                </div>
                <Button
                  className="mt-8 bg-[#448D96] hover:bg-[#3a7d85] text-white px-8 py-6 text-sm rounded-none transition-all hover:scale-105"
                >
                  READ MORE &rarr;
                </Button>
              </div>

              {/* SPACE FOR YOUR FULL PAGE IMAGE UPDATE (Removed Placeholder text as per your earlier request for a clean space) */}
              <div className="my-12 p-0">
                  {/* * YOUR FULL PAGE IMAGE UPDATE GOES HERE    */}
              </div>
              {/* END OF SPACE FOR YOUR FULL PAGE IMAGE UPDATE */}


              <h2 className="text-3xl font-semibold mt-12 mb-8">
                Learn more about RF1 and alternative investments
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <VideoCard
  imageSrc="/images/img1.jpeg"
  title="What is RF1? - Interview between David Wright, Zenith Investment Planners and Phil King, Regal"
  href="#"
/>
<VideoCard
  imageSrc="/images/img2.jpeg"
  title="How to use RF1 in portfolios - David Wright, Zenith Investment Planners"
  href="#"
/>
<VideoCard
  imageSrc="/images/img3.jpeg"
  title="Alternative Investments: What, how and why?"
  href="#"
/>

              </div>
            </div>

            {/* START OF ADDED CONTENT: FAQ and Contact Us */}

            <div className="mt-20 pt-8 border-t border-gray-200">
                <h2 className="text-3xl sm:text-4xl font-semibold mb-10 text-gray-800">
                    Frequently asked questions
                </h2>
                <div className="mb-16">
                    {faqData.map((item, index) => (
                        <FaqItem
                            key={index}
                            title={item.title}
                            content={item.content}
                        />
                    ))}
                </div>



                {/* Contact Us Section */}
                <div className="bg-[#373e501a] p-8 sm:p-10 rounded-none shadow-inner border border-gray-100">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                        Contact Us
                    </h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                        <p>
                            If you are a securityholder and require assistance, please contact us on whatsapp{" "}
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


            {/* END OF ADDED CONTENT: FAQ and Contact Us */}
            
          </main>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}