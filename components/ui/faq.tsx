"use client";
import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const faqs = [
  {
    question: "What is Regal Funds Management?",
    answer: "Regal Funds Management is a multi-award winning specialist alternatives investment manager, pioneering the hedge fund, private markets and alternatives industry in Australia since 2004. We manage approximately $19.2 billion of investor capital across a range of alternative investment strategies including long/short equities, private markets, real & natural assets, and credit & royalties."
  },
  {
    question: "What is the Regal Investment Fund (RF1)?",
    answer: "RF1 is a listed investment company (LIC) on the ASX providing investors with exposure to a selection of alternative investment strategies managed by Regal. It aims to produce attractive risk-adjusted returns over the long term through diversified exposure to Regal's investment capabilities."
  },
  {
    question: "What investment strategies does Regal offer?",
    answer: "Regal offers a range of alternative investment strategies including long/short equities, private markets, real & natural assets (through Kilter Rural), and credit & royalties (through Taurus Funds Management). Our strategies are designed to generate attractive risk-adjusted returns across different market conditions."
  },
  {
    question: "Who is Regal Partners Limited?",
    answer: "Regal Partners Limited (ASX: RPL) is the parent company of Regal Funds Management, VGI Partners, Kilter Rural, and Taurus Funds Management. Listed on the ASX in June 2021, Regal Partners provides investors with exposure to a diversified platform of alternative investment strategies."
  },
  {
    question: "What is Regal's investment philosophy?",
    answer: "At Regal, we are benchmark unaware, absolute return investors. We seek to identify, understand and capitalise from pricing inefficiencies that occur across and within global capital markets. Our investment strategies are focused on specific sectors, markets or asset classes where our extensive investment in human capital, technology infrastructure and market relationships provide attractive sources of ongoing alpha."
  },
  {
    question: "How can I invest with Regal Funds Management?",
    answer: "Investors can access Regal's strategies through various investment vehicles including the Regal Investment Fund (ASX: RF1), wholesale funds, and bespoke portfolio solutions for institutional investors. You should consult with a financial advisor to determine which investment option is suitable for your circumstances."
  },
  {
    question: "What is the fee structure?",
    answer: "Fees typically include a management fee and a performance fee, which is subject to a high-water mark. The specific fee structure varies depending on the investment fund or strategy. Full details on the calculation and payment of fees are available in the relevant Product Disclosure Statement (PDS) or Information Memorandum."
  },
  {
    question: "Can I withdraw my investment at any time?",
    answer: "Withdrawal terms vary depending on the investment vehicle. For listed investments like RF1, shares can be sold on the ASX during market hours. For wholesale funds, there are typically specific redemption periods and notice requirements. Please refer to the specific fund's documentation for detailed withdrawal terms."
  },
  {
    question: "How is Regal different from traditional long-only managers?",
    answer: "Unlike traditional long-only managers, Regal is benchmark unaware and can take both long and short positions. We are absolute return focused, meaning we aim to generate positive returns regardless of market direction. Our strategies are designed to capitalise on market inefficiencies and protect capital in declining markets."
  },
  {
    question: "What is Regal's track record?",
    answer: "Regal has been recognised as Australian Alternative Investment Manager of the Year multiple times (2016, 2018, 2019, 2020, 2023). However, past performance is not indicative of future results. Investors should review the historical performance of specific funds in their PDS or Information Memorandum."
  },
  {
    question: "Who are the investment team at Regal?",
    answer: "Regal has a team of around 180 people working together across offices in Australia and offshore. Our investment team includes experienced portfolio managers, analysts, and researchers with deep expertise across different asset classes and markets. Key personnel include Philip King (Founder) and other senior investment professionals."
  },
  {
    question: "Does Regal integrate ESG considerations?",
    answer: "Yes, Regal is a signatory to the United Nations Principles for Responsible Investment (UNPRI). Environmental, Social, and Governance (ESG) considerations are integrated into our investment process where material. We believe that sustainable investing leads to better long-term investment outcomes."
  },
  {
    question: "How can I stay updated with Regal's news and insights?",
    answer: "You can stay updated through the News section of our website, where we publish regular updates, market insights, and company announcements. You can also subscribe to our newsletter or follow Regal Partners Limited (ASX: RPL) for ASX announcements and company news."
  },
  {
    question: "How can I contact Regal Funds Management?",
    answer: "For investment inquiries, you can contact us through the Contact page on our website. For existing investors, please refer to your fund's documentation for specific contact details. Our team is available to assist with general inquiries about our investment strategies and products."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  // Dynamically split FAQs into two balanced columns
  const halfwayPoint = Math.ceil(faqs.length / 2);
  const leftColumnFaqs = faqs.slice(0, halfwayPoint);
  const rightColumnFaqs = faqs.slice(halfwayPoint);

  return (
    <section id="faq" className="mx-auto max-w-[1400px] px-4 lg:px-8 py-15 mb-10 w-full">
      <div className="text-center mb-10 relative z-10">

        {/* Main Heading */}
        <h2 className="text-2xl sm:text-4xl font-semibold mb-3">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>

        {/* Centered Paragraph */}
        <p className="text-gray-700 max-w-2xl mx-auto text-base sm:text-lg">
          Everything you need to know about Regal Funds Management.
          From our investment strategies to the Regal Investment Fund (RF1).
        </p>
      </div>

      {/* Balanced Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Left Column */}
        <div className="space-y-4">
          {leftColumnFaqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {rightColumnFaqs.map((faq, index) => {
            const trueIndex = index + halfwayPoint;
            return (
              <FAQItem
                key={trueIndex}
                faq={faq}
                isOpen={openIndex === trueIndex}
                onClick={() => setOpenIndex(openIndex === trueIndex ? null : trueIndex)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ faq, isOpen, onClick }: { faq: any, isOpen: boolean, onClick: () => void }) {
  return (
    <div
      className={`group transition-all duration-300 rounded-[0] border ${
        isOpen
          ? "bg-card border-primary shadow-xl shadow-primary/5"
          : "bg-card/40 border-primary/10 hover:border-primary/30"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center cursor-pointer justify-between p-4 lg:p-5 text-left"
      >
        <span className={`text-sm md:text-[17px] font-semibold ${isOpen ? "text-primary" : "text-foreground"}`}>
          {faq.question}
        </span> 
        <div className="bg-[#448D96] hover:bg-[#3a7d85] text-white p-1 flex-shrink-0 ml-4 transition-transform duration-300">
          {isOpen ? (
            <X className="w-4 h-4 text-white" />
          ) : (
            <Plus className="w-4 h-4 text-white" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-8">
          <div className="h-px bg-primary/10 mb-6" />
          <p className="text-muted-foreground text-sm md:text-base">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}