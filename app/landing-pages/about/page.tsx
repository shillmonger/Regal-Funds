"use client";

import React from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { Shield, TrendingUp, Users2, Globe2, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Theme colors
const primary = "text-emerald-500";
const bg = "bg-white dark:bg-gray-950";
const text = "text-gray-900 dark:text-gray-100";
const subtext = "text-gray-600 dark:text-gray-400";

export default function AboutPage() {
  return (
    <div className={`min-h-screen ${bg}`}>
      <Header />

      {/* Hero / Intro Section */}
      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <h2 className={`text-sm uppercase font-semibold tracking-wider ${primary}`}>
          About US
        </h2>
        <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mt-3 ${text}`}>
          Redefining the Future of Global Trading
        </h1>
        <p
  className={`${subtext} mt-6 leading-relaxed text-base sm:text-lg text-left sm:text-center`}
>
  OctaveTrade is the next generation of visionaries continuing the legacy
  of financial pioneers who shaped the markets of the past century.
  We’re building on that foundation — with technology, transparency,
  and trust — to lead the financial world of tomorrow.
</p>

      </section>

      {/* Gradient Divider */}
      <div className="max-w-7xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
      </div>


      {/* Who We Are */}
      <section className="max-w-5xl mx-auto px-6 py-10 text-center">
        <h2 className={`text-2xl sm:text-3xl font-semibold mb-6 ${text}`}>
          Who We Are
        </h2>
        <p
  className={`${subtext} leading-relaxed text-base sm:text-lg max-w-3xl mx-auto text-left sm:text-center`}
>
  OctaveTrade is a global online trading platform committed to delivering
  seamless, secure, and transparent financial experiences. Since our
  founding, we’ve empowered traders worldwide with access to
  Forex, Stocks, ETFs, Binary Options, and Cryptocurrency markets — all
  through innovative tools and trusted expertise.
</p>

<p
  className={`${subtext} mt-6 leading-relaxed text-base sm:text-lg max-w-3xl mx-auto text-left sm:text-center`}
>
  What sets us apart is our philosophy: trading should be built on knowledge,
  strategy, and trust — not speculation. Our team brings years of experience
  in market analytics, risk management, and modern financial technologies
  to ensure that our clients trade with clarity and confidence.
</p>

      </section>

      {/* Gradient Divider */}
      <div className="max-w-7xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
      </div>


      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className={`text-center text-2xl sm:text-3xl font-semibold mb-12 ${text}`}>
          Our Core Values
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-0 shadow-md dark:bg-gray-900 bg-white text-center py-6 px-4">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Shield className={`h-10 w-10 ${primary}`} />
              </div>
              <CardTitle className={`text-lg font-semibold ${text}`}>
                Integrity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${subtext}`}>
                Every decision we make is rooted in transparency and trust,
                ensuring fairness and honesty in all our relationships.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md dark:bg-gray-900 bg-white text-center py-6 px-4">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <TrendingUp className={`h-10 w-10 ${primary}`} />
              </div>
              <CardTitle className={`text-lg font-semibold ${text}`}>
                Innovation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${subtext}`}>
                We embrace technology to enhance trading efficiency, security,
                and user experience staying ahead of market evolution.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md dark:bg-gray-900 bg-white text-center py-6 px-4">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Users2 className={`h-10 w-10 ${primary}`} />
              </div>
              <CardTitle className={`text-lg font-semibold ${text}`}>
                Partnership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${subtext}`}>
                We build long-term relationships with our clients growing
                together through shared goals and mutual trust.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md dark:bg-gray-900 bg-white text-center py-6 px-4">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Globe2 className={`h-10 w-10 ${primary}`} />
              </div>
              <CardTitle className={`text-lg font-semibold ${text}`}>
                Global Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${subtext}`}>
                Our reach is worldwide but our focus is personal. We empower
                traders everywhere to achieve success on their own terms.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>


      <Footer />
    </div>
  );
}
