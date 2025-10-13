"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Image from "next/image";
import Link from "next/link";

export default function ContactPage() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
 {/* Header */}
      <Header />

      {/* HERO SECTION */}
      <section className="relative min-h-[800px] flex items-center overflow-hidden">
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

        <div className="relative z-10 text-white px-6 sm:px-10 md:px-20 max-w-5xl mt-[100px]">
          <h1 className="text-3xl font-serif sm:text-4xl md:text-4xl font-bold leading-snug">
            Contact
          </h1>
        </div>
      </section>

      {/* General Enquiries Section */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-10 lg:px-12">
        <div className="grid md:grid-cols-2 gap-20">
          {/* Left Column */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              General Enquiries
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              For general enquiries, you can contact Regal's reception team by calling +43 6888 7993 7235, or completing the enquiry form.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              If you have any questions regarding Regal investment strategies, please contact our investor relations team using the details below. We have also included registry contact details for the listed investment vehicles managed by Regal: ASX: API and ASX: RGS; and our suite of Australian Unit Trusts.
            </p>
          </div>

          {/* Right Column - Form */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-6">
              Submit a general enquiry
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Please enter your name here*"
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:border-[#448D96]"
              />
              <input
                type="email"
                placeholder="Your email address here*"
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:border-[#448D96]"
              />
              <input
                type="tel"
                placeholder="Your phone number here"
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:border-[#448D96]"
              />
              <select className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-600 focus:outline-none focus:border-[#448D96]">
                <option>Method of contact*</option>
                <option>Email</option>
                <option>Phone</option>
              </select>
              <textarea
                placeholder="Please leave your message here*"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:border-[#448D96] resize-none"
              />
              <p className="text-xs text-gray-600 leading-relaxed">
                Regal may collect and use your personal information to offer you products and services we believe may interest you. Your personal information will be handled in accordance with our{" "}
                <Link href="#" className="text-[#448D96] hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
              <div className="flex items-start space-x-3">
                <input type="checkbox" id="recaptcha" className="mt-1" />
                <label htmlFor="recaptcha" className="text-xs text-gray-600">
                  I'm not a robot
                </label>
              </div>
              <Button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-6 rounded-none text-sm font-semibold transition">
                SEND MESSAGE
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion Sections */}
      <section className="max-w-7xl mx-auto pb-16 px-6 md:px-10 lg:px-12">
        <div className="border-t border-gray-300">
          {/* Investor relations */}
          <div className="border-b border-gray-300">
            <div 
              className="py-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
              onClick={() => toggleAccordion('investor')}
            >
              <h3 className="text-xl font-serif text-gray-800">
                Investor relations enquiries
              </h3>
              <button className="w-10 h-10 bg-[#448D96] text-white flex items-center justify-center text-2xl hover:bg-[#3a7d85] transition">
                {openAccordion === 'investor' ? '−' : '+'}
              </button>
            </div>
            {openAccordion === 'investor' && (
              <div className="pb-8 pt-2">
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Australia and New Zealand</h4>
                    <p className="text-sm text-gray-700 mb-1">+43 688 8799 37235</p>
                    <p className="text-sm text-gray-700 mb-6">donaldevens86@gmail.com</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">International</h4>
                    <p className="text-sm text-gray-700 mb-1">+43 688 8799 37235</p>
                    <p className="text-sm text-gray-700 mb-6">donaldevens86@gmail.com</p>
                  </div>
                </div>
                <Button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-6 rounded-none text-[15px] font-semibold transition">
                  SUBSCRIBE 
                </Button>
              </div>
            )}
          </div>

          {/* Registry enquiries */}
          <div className="border-b border-gray-300">
            <div 
              className="py-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
              onClick={() => toggleAccordion('registry')}
            >
              <h3 className="text-xl font-serif text-gray-800">Registry enquiries</h3>
              <button className="w-10 h-10 bg-[#448D96] text-white flex items-center justify-center text-2xl hover:bg-[#3a7d85] transition">
                {openAccordion === 'registry' ? '−' : '+'}
              </button>
            </div>
            {openAccordion === 'registry' && (
              <div className="pb-8 pt-2">
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Australian Unit Trusts</h4>
                    <p className="text-sm text-gray-700 mb-1">Boardroom Pty Limited</p>
                    <p className="text-sm text-gray-700 mb-1">1300 737 760 (within Australia)</p>
                    <p className="text-sm text-gray-700 mb-1">+43 688 8799 37235 (outside Australia)</p>
                    <p className="text-sm text-gray-700 mb-6">donaldevens86@gmail.com</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Regal Investment Fund (ASX:RF1)</h4>
                    <p className="text-sm text-gray-700 mb-1">Link Market Services</p>
                    <p className="text-sm text-gray-700 mb-1">1800 221 227 (within Australia)</p>
                    <p className="text-sm text-gray-700 mb-6">donaldevens86@gmail.com</p>
                    <Button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-6 rounded-none text-[15px] font-semibold transition">
                      SUBSCRIBE TO RF1 
                    </Button>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Regal Asian Investments Limited (ASX:RGI8)</h4>
                    <p className="text-sm text-gray-700 mb-1">Boardroom Pty Limited</p>
                    <p className="text-sm text-gray-700 mb-1">1300 737 760 (within Australia)</p>
                    <p className="text-sm text-gray-700 mb-1">+43 688 8799 37235 (outside Australia)</p>
                    <p className="text-sm text-gray-700 mb-6">donaldevens86@gmail.com</p>
                    <Button className="bg-[#448D96] hover:bg-[#3a7d85] text-white px-3 py-6 rounded-none text-[15px] font-semibold transition">
                      SUBSCRIBE TO RGI8 
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Companies seeking capital */}
          <div className="border-b border-gray-300">
            <div 
              className="py-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
              onClick={() => toggleAccordion('capital')}
            >
              <h3 className="text-xl font-serif text-gray-800">Companies seeking capital</h3>
              <button className="w-10 h-10 bg-[#448D96] text-white flex items-center justify-center text-2xl hover:bg-[#3a7d85] transition">
                {openAccordion === 'capital' ? '−' : '+'}
              </button>
            </div>
            {openAccordion === 'capital' && (
              <div className="pb-8 pt-2">
                <p className="text-sm text-gray-700">
                  Regal is a significant provider of debt and equity capital. For corporates seeking to contact us, please email info@regalfm.com.
                </p>
              </div>
            )}
          </div>

          {/* Careers at Regal */}
          <div className="border-b border-gray-300">
            <div 
              className="py-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
              onClick={() => toggleAccordion('careers')}
            >
              <h3 className="text-xl font-serif text-gray-800">Careers at Regal</h3>
              <button className="w-10 h-10 bg-[#448D96] text-white flex items-center justify-center text-2xl hover:bg-[#3a7d85] transition">
                {openAccordion === 'careers' ? '−' : '+'}
              </button>
            </div>
            {openAccordion === 'careers' && (
              <div className="pb-8 pt-2">
                <p className="text-sm text-gray-700 mb-4">
                  Regal is always open to discussions with high calibre fundamental analysts and portfolio managers. We are currently focusing on recruiting professionals with Asian equities experience for our Singapore office, but also have openings in Sydney and New York.
                </p>
                <p className="text-sm text-gray-700">
                  Please send your interest in working at Regal to donaldevens86@gmail.com.
                </p>
              </div>
            )}
          </div>

          {/* Offices */}
          <div className="border-b border-gray-300">
            <div 
              className="py-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
              onClick={() => toggleAccordion('offices')}
            >
              <h3 className="text-xl font-serif text-gray-800">Offices</h3>
              <button className="w-10 h-10 bg-[#448D96] text-white flex items-center justify-center text-2xl hover:bg-[#3a7d85] transition">
                {openAccordion === 'offices' ? '−' : '+'}
              </button>
            </div>
            {openAccordion === 'offices' && (
              <div className="pb-8 pt-2">
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Sydney</h4>
                    <p className="text-sm text-gray-700">L46 Gateway Building</p>
                    <p className="text-sm text-gray-700">1 Macquarie Place</p>
                    <p className="text-sm text-gray-700">Sydney, NSW, Australia 2000</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Singapore</h4>
                    <p className="text-sm text-gray-700">2 Central Boulevard #30-01A</p>
                    <p className="text-sm text-gray-700">IOI Central Boulevard West Tower</p>
                    <p className="text-sm text-gray-700">Singapore 018915</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">New York</h4>
                    <p className="text-sm text-gray-700">Suite 2101</p>
                    <p className="text-sm text-gray-700">600 Madison Avenue</p>
                    <p className="text-sm text-gray-700">New York, NY USA 10022</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

         {/* Footer */}
      <Footer />
    </div>
  );
}