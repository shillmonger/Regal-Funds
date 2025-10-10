"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";

import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

// Define a type for a team member to include their category
interface TeamMember {
  name: string;
  title: string;
  img: string;
  category: "Long/Short Equities" | "Private Markets/Pre-IPO" | "Credit & Royalties" | "Contact";
}

// Helper component for rendering a single team card
const TeamCard = ({ member }: { member: TeamMember }) => (
  <div className="space-y-3">
    {/* Image Wrapper */}
    <div className="relative bg-gray-100 mx-auto 
                    w-[270px] sm:w-[260px] md:w-full aspect-[3/4]">
      <Image
        src={member.img}
        alt={member.name}
        fill
        className="object-cover"
      />
      {/* Plus Icon */}
      <div className="absolute bottom-0 right-0 bg-[#448D96] p-2">
        <Plus className="text-white w-6 h-6" />
      </div>
    </div>

    {/* Text Info */}
    <div className="text-center md:text-left">
      <h4 className="text-base font-semibold text-gray-800">
        {member.name}
      </h4>
      <p className="text-sm text-gray-600">{member.title}</p>
    </div>
  </div>
);

// Helper component for the Contact Us box
const ContactUsCard = () => (
  <div className="min-h-[100px] p-6 bg-[#373E501A] flex flex-col justify-center items-start border-none">
    <h4 className="text-lg font-semibold text-gray-800 mb-2">Contact Us</h4>
    <p className="text-sm text-gray-600 mb-4">
      If you have any questions about Regal, please contact our investor relations team.
    </p>
    <Link href="#" className="text-sm font-semibold text-[#448D96] hover:underline">
      CONTACT US <span aria-hidden="true"></span>
    </Link>
  </div>
);

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // TEAM DATA
  const team: TeamMember[] = [
    // --- Long/Short Equities (8 members) ---
    {
      name: "Philip King",
      title: "Chief Investment Officer – Long/Short Equities",
      img: "https://www.regalfm.com/irmbiographyfile/1/philipking.png",
      category: "Long/Short Equities",
    },
    {
      name: "Henry Renshaw",
      title: "Portfolio Manager",
      img: "https://www.regalfm.com/irmbiographyfile/33/Henry.jpg",
      category: "Long/Short Equities",
    },
    {
      name: "James Sioud",
      title: "Portfolio Manager",
      img: "https://www.regalfm.com/irmbiographyfile/21/JamesSioud.jpg",
      category: "Long/Short Equities",
    },
    {
      name: "Jovita Khilnani",
      title: "Portfolio Manager",
      img: "https://www.regalfm.com/irmbiographyfile/4/jovita.jpg",
      category: "Long/Short Equities",
    },
    {
      name: "Mark Nathan",
      title: "Head of Fundamental Research",
      img: "https://www.regalfm.com/irmbiographyfile/22/MarkNathan.jpg",
      category: "Long/Short Equities",
    },
    {
      name: "Jessica Farr-Jones",
      title: "Portfolio Manager",
      img: "https://www.regalfm.com/irmbiographyfile/11/JessFarrJones.jpg",
      category: "Long/Short Equities",
    },
    {
      name: "Tim Elliott",
      title: "Portfolio Manager",
      img: "https://www.regalfm.com/irmbiographyfile/9/tim2.png",
      category: "Long/Short Equities",
    },
    {
      name: "Vale, Todd Guyot",
      title: "1967–2024",
      img: "https://www.regalfm.com/irmbiographyfile/36/ValeToddGuyot.png",
      category: "Long/Short Equities",
    },

    // --- Private Markets/Pre-IPO (3 members) ---
    {
      name: "Philip King",
      title: "Chief Investment Officer – Long/Short Equities",
      img: "https://www.regalfm.com/irmbiographyfile/1/philipking.png",
      category: "Private Markets/Pre-IPO",
    },
    {
      name: "Ben McCallum",
      title: "Portfolio Manager",
      img: "https://www.regalfm.com/irmbiographyfile/10/BEN.jpg",
      category: "Private Markets/Pre-IPO",
    },
    {
      name: "Jessica Farr-Jones",
      title: "Portfolio Manager",
      img: "https://www.regalfm.com/irmbiographyfile/11/JessFarrJones.jpg",
      category: "Private Markets/Pre-IPO",
    },

    // --- Credit & Royalties (4 members) ---
    {
      name: "Gavin George",
      title: "Portfolio Manager",
      img: "https://www.regalfm.com/irmbiographyfile/17/Gavin.jpg",
      category: "Credit & Royalties",
    },
    {
      name: "Jacob Poke",
      title: "Portfolio Manager",
      img: "https://www.regalfm.com/irmbiographyfile/19/jacob.jpg",
      category: "Credit & Royalties",
    },
    {
      name: "James Morrison",
      title: "Portfolio Manager",
      img: "https://www.regalfm.com/irmbiographyfile/20/JamesMorrison.jpg",
      category: "Credit & Royalties",
    },
    {
      name: "Simon Kline",
      title: "Portfolio Manager",
      img: "https://www.regalfm.com/irmbiographyfile/23/SimonKlimtC.jpg",
      category: "Credit & Royalties",
    },
  ];

  // Group members by category
  const categories = {
    "Long/Short Equities": team.filter(m => m.category === "Long/Short Equities"),
    "Private Markets/Pre-IPO": team.filter(m => m.category === "Private Markets/Pre-IPO"),
    "Credit & Royalties": team.filter(m => m.category === "Credit & Royalties"),
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <Header />

      {/* HERO SECTION */}
      <section className="relative min-h-[800px] flex items-center overflow-hidden">
        {/* Background Image with overlay */}
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

        {/* Hero Content */}
        <div className="relative z-10 text-white px-6 sm:px-10 md:px-20 max-w-5xl mt-[100px]">
          <h1 className="text-3xl font-serif sm:text-4xl md:text-4xl font-bold leading-snug">
            Investment and Investor Relations team
          </h1>
        </div>
      </section>

      {/* OVERVIEW SECTION */}
      <section className="max-w-7xl mx-auto py-20 px-6 md:px-10 lg:px-16">
        <div className="grid md:grid-cols-[250px_1fr] gap-12">
          {/* Sidebar */}
          <aside>
            <div className="bg-[#f5f7f7] w-full lg:sticky lg:top-24 self-start h-fit border border-gray-200 rounded-none overflow-hidden">
              <nav className="flex flex-col">
                <Link
                  href="#"
                  className="bg-[#448D96] text-white font-medium py-3 px-4 border-b border-white"
                >
                  Investment Management
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:bg-gray-100 py-3 px-4 border-b border-gray-200 transition"
                >
                  Investor Relations
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <section className="max-w-7xl mx-auto px-0 md:px-10 lg:px-10">
            {/* Section Title */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                Investment team
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Regal is home to one of the largest fundamental investment teams in the
                Asia-Pacific region. We are one of Australia’s most active public and
                private market investors and a significant provider of capital to
                Australian corporates.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our team of portfolio managers and analysts bring deep specialist sector
                expertise and a strong track record of performance to Regal’s
                capabilities across long/short equities, private markets and credit &
                royalties.
              </p>
            </div>

            {/* --- Long/Short Equities --- */}
            <h3 className="text-lg font-semibold text-gray-800 mb-8">
              Portfolio Managers – Long/Short Equities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-12">
              {categories["Long/Short Equities"].map((member, i) => (
                <TeamCard key={i} member={member} />
              ))}
            </div>

            {/* --- Private Markets/Pre-IPO --- */}
            <h3 className="text-lg font-semibold text-gray-800 mb-8 mt-8">
              Portfolio Managers – Private Markets/Pre-IPO
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-12">
              {categories["Private Markets/Pre-IPO"].map((member, i) => (
                <TeamCard key={i} member={member} />
              ))}
            </div>

            {/* --- Credit & Royalties --- */}
            <h3 className="text-lg font-semibold text-gray-800 mb-8 mt-8">
              Portfolio Managers – Credit & Royalties
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 items-stretch">
              {categories["Credit & Royalties"].map((member, i) => (
                <TeamCard key={i} member={member} />
              ))}

              {/* Contact Us card (in same row) */}
              <ContactUsCard />
            </div>
          </section>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
