"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  MessageSquare,
  Users,
  DollarSign,
  FileText,
  Briefcase,
  Building,
  Lightbulb,
  Share2,
  Headphones,
} from "lucide-react";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header/Navigation */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <button className="flex flex-row text-lg font-bold sm:text-xl">
            Fund<p className="text-[#2595BE]">Pitch</p>
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                // X icon when menu is open
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                // Hamburger icon when menu is closed
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-2 md:flex md:gap-6">
            <Link
              href="#features"
              className="text-sm text-gray-600 hover:text-gray-900 md:text-base"
            >
              Features
            </Link>
            <Link
              href="#user-types"
              className="text-sm text-gray-600 hover:text-gray-900 md:text-base"
            >
              Who It&apos;s For
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-gray-600 hover:text-gray-900 md:text-base"
            >
              How It Works
            </Link>
            <Link
              href="/login"
              className="flex items-center text-sm text-[#2595BE] hover:text-blue-700 md:text-base"
            >
              Login <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </nav>
        </div>

        {/* Mobile navigation */}
        <div
          className={`transform transition-all duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="flex flex-col space-y-4 border-t p-4">
            <Link
              href="#features"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#user-types"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Who It&apos;s For
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/login"
              className="flex items-center text-[#2595BE] hover:text-blue-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-blue-50 py-16 md:py-24">
        <div className="container mx-auto grid items-center gap-12 px-4 md:grid-cols-2">
          <div>
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
              Connect Startups with the Right Collaborators
            </h1>
            <p className="mb-8 text-xl text-gray-600">
              FundPitch helps founders showcase their ideas and connect with
              investors, merchant bankers, advisors, and service providers who
              can help their business grow.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/categories"
                className="rounded-md bg-[#2595BE] px-6 py-3 text-center font-medium text-white hover:bg-blue-600"
              >
                Start Your Journey
              </Link>
              <Link
                href="#how-it-works"
                className="rounded-md border border-gray-300 px-6 py-3 text-center font-medium hover:border-gray-400"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-[#2595BE]/20"></div>
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-[#2595BE]/10"></div>
            <div className="relative rounded-xl bg-white p-6 shadow-lg">
              <Image
                src="/assets/images/business.jpg"
                width={500}
                height={400}
                alt="Business funding meeting"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16" id="features">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">Why Choose FundPitch?</h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Our platform offers unique advantages for all participants in the
              business ecosystem
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-gray-100 p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 inline-flex rounded-full bg-[#2595BE] p-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Seamless Collaboration</h3>
              <p className="text-gray-600">
                Company founders can invite various stakeholders to collaborate
                and provide services directly through the platform.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 inline-flex rounded-full bg-[#2595BE] p-4">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Expressions</h3>
              <p className="text-gray-600">
                Users can express interest, share thoughts, and communicate
                funding offers directly to companies through our Expressions
                feature.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 inline-flex rounded-full bg-[#2595BE] p-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Document Sharing</h3>
              <p className="text-gray-600">
                Securely share files, pitch decks, and important documents with
                potential collaborators and track engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#2595BE]/5 py-16">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="overflow-hidden rounded-xl bg-white shadow-lg">
                <div className="bg-[#2595BE] px-6 py-4">
                  <h3 className="text-xl font-bold text-white">Expressions</h3>
                </div>
                <div className="space-y-6 p-6">
                  <div className="flex gap-4 rounded-lg bg-gray-50 p-4">
                    <img
                      src="/assets/images/endorseuser.png"
                      alt="User avatar"
                      className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex justify-between">
                        <p className="font-medium">Individual user</p>
                        <span className="text-sm text-gray-500">2 mins</span>
                      </div>
                      <p className="text-gray-600">
                        I like to invest the fund you&apos;re looking for xyz
                      </p>
                      <div className="mt-2 flex w-fit items-center gap-2 rounded-full bg-gray-100 p-1">
                        <div className="rounded-full bg-[#2595BE] p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                          >
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                        </div>
                        <div className="relative h-2 w-32 rounded-full bg-gray-200">
                          <div className="absolute left-0 top-0 h-full w-1/4 rounded-full bg-[#2595BE]"></div>
                        </div>
                        <span className="text-xs text-gray-500">0:05</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 rounded-lg bg-gray-50 p-4">
                    <img
                      src="/assets/images/endorseuser.png"
                      alt="User avatar"
                      className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex justify-between">
                        <p className="font-medium">Individual user</p>
                        <span className="text-sm text-gray-500">2 mins</span>
                      </div>
                      <p className="text-gray-600">
                        2 Files · Shared to Docs please view
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="mb-6 text-3xl font-bold">
                Express Interest and Share Resources
              </h2>
              <p className="mb-6 text-gray-600">
                Our unique Expressions feature allows stakeholders to
                communicate their interest, share thoughts, and offer funding
                directly to companies.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-500" />
                  <span>
                    Investors can express interest and specify funding amounts
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-500" />
                  <span>
                    Share documents, presentations, and resources securely
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-500" />
                  <span>
                    Record and share audio messages for personalized
                    communication
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-500" />
                  <span>
                    Track all communications in one organized interface
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="bg-white py-16" id="user-types">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">Who Uses FundPitch?</h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Our platform connects all stakeholders in the business ecosystem
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-xl bg-blue-100 p-8 transition-all hover:shadow-md">
              <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-bl-full bg-blue-200"></div>
              <div className="relative">
                <div className="mb-6 inline-flex rounded-full bg-[#2595BE] p-4">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">Company Founders</h3>
                <p className="mb-6 text-gray-700">
                  Showcase your startup, invite collaborators, and secure the
                  resources you need to grow.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Create compelling pitch decks</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Invite various stakeholders to collaborate</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Receive expressions of interest</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-blue-50 p-8 transition-all hover:shadow-md">
              <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-bl-full bg-blue-100"></div>
              <div className="relative">
                <div className="mb-6 inline-flex rounded-full bg-[#2595BE] p-4">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">Investors</h3>
                <p className="mb-6 text-gray-700">
                  Discover promising startups and express your interest in
                  funding opportunities.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Browse vetted opportunities</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Express funding interest directly</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Streamlined due diligence</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-green-50 p-8 transition-all hover:shadow-md">
              <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-bl-full bg-green-100"></div>
              <div className="relative">
                <div className="mb-6 inline-flex rounded-full bg-[#2595BE] p-4">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">Merchant Bankers</h3>
                <p className="mb-6 text-gray-700">
                  Find promising clients and offer your specialized financial
                  services.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Discover qualified clients</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Express interest in collaborating</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Share expertise and resources</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-purple-50 p-8 transition-all hover:shadow-md">
              <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-bl-full bg-purple-100"></div>
              <div className="relative">
                <div className="mb-6 inline-flex rounded-full bg-[#2595BE] p-4">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">Advisor/SME</h3>
                <p className="mb-6 text-gray-700">
                  Guide startups to success and share your industry expertise
                  with growing businesses.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Provide valuable feedback</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Connect with promising founders</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Share industry knowledge</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-yellow-50 p-8 transition-all hover:shadow-md">
              <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-bl-full bg-yellow-100"></div>
              <div className="relative">
                <div className="mb-6 inline-flex rounded-full bg-[#2595BE] p-4">
                  <Share2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">Service Provider</h3>
                <p className="mb-6 text-gray-700">
                  Offer your specialized services to businesses that need your
                  expertise.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Showcase your service offerings</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Find relevant clients</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Collaborate with businesses</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-red-50 p-8 transition-all hover:shadow-md">
              <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-bl-full bg-red-100"></div>
              <div className="relative">
                <div className="mb-6 inline-flex rounded-full bg-[#2595BE] p-4">
                  <Headphones className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">
                  Consultant/Facilitator
                </h3>
                <p className="mb-6 text-gray-700">
                  Facilitate connections and provide consulting services to help
                  businesses succeed.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Offer specialized consulting</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Connect businesses with resources</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Facilitate successful partnerships</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">How FundPitch Works</h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              A simple process to connect businesses with the right
              collaborators
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#2595BE] text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-xl font-bold">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and select your user type to build a tailored profile
                with all the relevant details.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#2595BE] text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-xl font-bold">Connect & Collaborate</h3>
              <p className="text-gray-600">
                Founders invite collaborators or stakeholders discover and
                express interest in opportunities.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#2595BE] text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-xl font-bold">Share & Express</h3>
              <p className="text-gray-600">
                Use Expressions to communicate interest, share documents, and
                offer services or funding.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#2595BE] text-2xl font-bold text-white">
                4
              </div>
              <h3 className="mb-3 text-xl font-bold">Grow Together</h3>
              <p className="text-gray-600">
                Form partnerships, secure funding, and access the services
                needed to grow your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Feature */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold">
                Invite Collaborators to Your Project
              </h2>
              <p className="mb-6 text-gray-600">
                Company founders can easily invite various stakeholders to
                collaborate on their projects, access shared resources, and
                provide specialized services.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-500" />
                  <span>
                    Invite merchant bankers, investors, advisors, and service
                    providers
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-500" />
                  <span>
                    Manage permissions and access to sensitive information
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-500" />
                  <span>Track collaboration history and engagement</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-500" />
                  <span>Streamline communication between all stakeholders</span>
                </li>
              </ul>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-lg">
              <div className="bg-[#2595BE] px-6 py-4">
                <h3 className="text-xl font-bold text-white">Invite History</h3>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Investor A</p>
                      <p className="text-sm text-gray-500">
                        Invited 2 days ago
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    Accepted
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Merchant Banker B</p>
                      <p className="text-sm text-gray-500">
                        Invited 3 days ago
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    Pending
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <Lightbulb className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Advisor C</p>
                      <p className="text-sm text-gray-500">
                        Invited 1 week ago
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    Accepted
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#2595BE] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white">
            Ready to Join the FundPitch Ecosystem?
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-white/90">
            Whether you&apos;re looking for funding, offering services, or
            seeking collaboration, FundPitch connects you with the right
            partners.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/categories"
              className="rounded-md bg-white px-8 py-3 text-center font-medium text-[#2595BE] hover:bg-gray-100"
            >
              Get Started Now
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-white bg-transparent px-8 py-3 text-center font-medium text-white hover:bg-blue-600"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-xl font-bold">
                <span className="text-white">Fund</span>
                <span className="text-[#2595BE]">Pitch</span>
              </h3>
              <p className="text-gray-400">
                Connecting businesses with financial partners and service
                providers for mutual growth.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row">
            <p className="text-gray-400">
              © 2025 FundPitch. All rights reserved.
            </p>
            <div className="mt-4 flex space-x-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              {/* <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
