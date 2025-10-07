"use client";

import React, { useState } from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { Phone, Mail, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Theme constants
const primaryColorClass = "bg-emerald-500";
const primaryDarkerClass = "bg-emerald-600";
const primaryRingClass = "focus:ring-emerald-500";
const primaryTextClass = "text-emerald-500";

const bgLight = "bg-white dark:bg-gray-950";
const cardBg = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-400";
const textLabel = "text-gray-700 dark:text-gray-200";
const borderLight = "border-gray-300 dark:border-gray-800";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactReason: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      contactReason: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.message
    ) {
      toast.error("Please fill out all required fields");
      return;
    }

    if (!formData.contactReason) {
      toast.warning("Please select a contact reason");
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Your message has been sent successfully!");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        contactReason: "",
        message: "",
      });
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />

      <div className={`min-h-screen ${bgLight} py-8 sm:py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h1
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${textDark} mb-4`}
            >
              Contact Us
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className={`shadow-lg border-0 ${cardBg}`}>
                <CardHeader>
                  <CardTitle
                    className={`text-xl sm:text-2xl font-semibold ${textDark}`}
                  >
                    Send us a message
                  </CardTitle>
                  <p className={`${textMedium} mt-2 text-sm sm:text-base`}>
                    Do you have a question? Let us know and we&apos;ll do our
                    best to answer it.
                  </p>
                </CardHeader>

                <CardContent>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className={`py-3 ${textLabel}`}>
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter your first name"
                          required
                          className={`py-6 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-400 ${primaryRingClass}`}
                        />
                      </div>

                      <div>
                        <Label htmlFor="lastName" className={`py-3 ${textLabel}`}>
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter your last name"
                          required
                          className={`py-6 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-400 ${primaryRingClass}`}
                        />
                      </div>
                    </div>

                    {/* Email & Contact Reason */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className={`py-3 ${textLabel}`}>
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                          required
                          className={`py-6 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-400 ${primaryRingClass}`}
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="contactReason"
                          className={`py-3 ${textLabel}`}
                        >
                          Contact Reason
                        </Label>
                        <Select
                          onValueChange={handleSelectChange}
                          value={formData.contactReason}
                        >
                          <SelectTrigger
                            className={`w-full h-11 rounded-md border ${borderLight} px-3 py-6 text-sm focus:outline-none focus:ring-2 ${primaryRingClass} focus:border-transparent cursor-pointer dark:bg-gray-800 dark:text-gray-100`}
                          >
                            <SelectValue placeholder="Select a reason" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
  <SelectItem
    value="general"
    className="dark:text-gray-100 dark:hover:bg-gray-700"
  >
    General Inquiry
  </SelectItem>
  <SelectItem
    value="account-support"
    className="dark:text-gray-100 dark:hover:bg-gray-700"
  >
    Account Support
  </SelectItem>
  <SelectItem
    value="verification"
    className="dark:text-gray-100 dark:hover:bg-gray-700"
  >
    Verification & KYC
  </SelectItem>
  <SelectItem
    value="transactions"
    className="dark:text-gray-100 dark:hover:bg-gray-700"
  >
    Deposits & Withdrawals
  </SelectItem>
  <SelectItem
    value="integration"
    className="dark:text-gray-100 dark:hover:bg-gray-700"
  >
    API / Platform Integration
  </SelectItem>
  <SelectItem
    value="security"
    className="dark:text-gray-100 dark:hover:bg-gray-700"
  >
    Security & Privacy
  </SelectItem>
  <SelectItem
    value="partnership"
    className="dark:text-gray-100 dark:hover:bg-gray-700"
  >
    Partnerships & Collaboration
  </SelectItem>
  <SelectItem
    value="billing"
    className="dark:text-gray-100 dark:hover:bg-gray-700"
  >
    Payments & Billing
  </SelectItem>
  <SelectItem
    value="career"
    className="dark:text-gray-100 dark:hover:bg-gray-700"
  >
    Careers / Internships
  </SelectItem>
  <SelectItem
    value="other"
    className="dark:text-gray-100 dark:hover:bg-gray-700"
  >
    Other
  </SelectItem>
</SelectContent>

                        </Select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message" className={`py-3 ${textLabel}`}>
                        Message
                      </Label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Enter your message"
                        className={`w-full rounded-md border ${borderLight} px-3 py-2 text-sm focus:outline-none focus:ring-2 ${primaryRingClass} focus:border-transparent resize-vertical dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400`}
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className={`inline-flex items-center gap-2 ${primaryColorClass} hover:${primaryDarkerClass} text-white font-medium py-6 cursor-pointer`}
                    >
                      <Send className="h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className={`rounded-3xl p-6 sm:p-8 text-white bg-emerald-600`}>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  We are always here to help you.
                </h3>
                <p className={`text-green-50 mb-6 sm:mb-8 text-sm sm:text-base`}>
                  Get in touch with us for any queries or support.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 ${primaryColorClass} rounded-full flex items-center justify-center`}
                    >
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">Hotline</p>
                      <p className={`text-green-50 text-sm`}>+84 906 088 009</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 ${primaryColorClass} rounded-full flex items-center justify-center`}
                    >
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">WhatsApp</p>
                      <p className={`text-green-50 text-sm`}>+84 374 559 209</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 ${primaryColorClass} rounded-full flex items-center justify-center`}
                    >
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">Email</p>
                      <p className={`text-green-50 text-sm`}>
                        info@cyberlearn.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
