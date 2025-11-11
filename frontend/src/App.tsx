// Fix: Add Vite client types to resolve issues with import.meta.env.
// The /// <reference> directive was removed as it was causing a type definition resolution error.
import React, { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

// --- Type Definitions ---
interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface CartItem extends Service {}

interface OrderItem {
    id: number;
    service_id: number;
    service_title: string;
    service_image: string;
}

interface Order {
  id: number;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  items: OrderItem[];
  user_email?: string; // For admin view
}


// Base URL for the API, configured via environment variables for deployment flexibility.
// Fix: Cast to 'unknown' before asserting type for import.meta.env to satisfy TypeScript.
const API_BASE_URL = (import.meta as unknown as { env: { VITE_API_URL?: string } }).env.VITE_API_URL || '';


// --- Helper Functions ---
function parseJwt(token: string) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

// --- SVG Icon Components ---
const StarIcon = () => (
    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.561-.955L10 0l2.95 5.955 6.561.955-4.756 4.635 1.123 6.545z" />
    </svg>
);

const CartIcon = ({ itemCount }: { itemCount: number }) => (
  <div className="relative">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    {itemCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {itemCount}
      </span>
    )}
  </div>
);


// --- Data ---
const services: Service[] = [
    { id: 1, title: 'Data Appending Enrichment', description: 'You Have a Lead List need Enrich with data Or contact person Email. We can help you to Enrich your Data. If You have an Old lead list And need to Update data then we can replace it with Update data. We can also Provide Missing Data From Various Sources and Valid Sources. We charge per row only 15 cents.', image: '/images/services/service-1.png' },
    { id: 2, title: 'Email Appending Enrichment', description: 'You Have a Lead List that needs Enrich with the Owner or Decision makers Name and Email. We Provide any Decision makers contact Details.', image: '/images/services/service-2.png' },
    { id: 3, title: 'Prospect List Building', description: 'We Have Some Targeted Companies. We are looking for their Decision makers Contact Details. We are here to help you to reach your goal. I Can Provide Linkedin Lead Generation Data.', image: '/images/services/service-3.png' },
    { id: 4, title: 'Any Industry Leads', description: 'Here we Ready to provide any industry data. You just tell us about your targeted Industry Locations and Title/Role. You will get 100% valid data. We provide 100% Data accuracy Guarantee with 99% Emails Delivery Guarantee.', image: '/images/services/service-4.png' },
    { id: 5, title: 'Email Finding', description: 'Do You Have a List? And Looking For their Valid Emails. Here We can provide 99% Delivery able Emails. Just Share your list with us. We provide valid emails for only 15 cents.', image: '/images/services/service-5.png' },
    { id: 6, title: 'Direct Number Finding', description: 'We are looking For Contact Person Direct Dials Number and cell phone number/Mobile Number. Here We provide any contact person direct dials number and cell phone number at only 15 cents.', image: '/images/services/service-6.png' },
    { id: 7, title: 'Skip Tracing', description: 'You only have a Person name and their Mailing address or home address. You are looking for their Cell/Direct phone number and Email. We can provide those contact details.', image: '/images/services/service-7.png' }
];

// --- Sub-Components (Defined outside App) ---
interface HeaderProps {
    onGetStarted: () => void;
    isLoggedIn: boolean;
    onLogout: () => void;
    onCartClick: () => void;
    cartItemCount: number;
    onNavigateHome: () => void;
    onNavigateDashboard: () => void;
    onNavigateAdmin: () => void;
    view: 'home' | 'dashboard' | 'admin';
    userRole: 'user' | 'admin' | null;
}


const Header = ({ onGetStarted, isLoggedIn, onLogout, onCartClick, cartItemCount, onNavigateHome, onNavigateDashboard, onNavigateAdmin, view, userRole }: HeaderProps) => (
    <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <button onClick={onNavigateHome} className="text-2xl font-bold text-indigo-700 flex items-center focus:outline-none" aria-label="Nsleadprovider, go to home page">
                <span className="text-yellow-500 mr-2">⭐</span> Nsleadprovider
            </button>
            <nav className="hidden md:flex space-x-8 items-center">
                {isLoggedIn && (
                    <>
                     <button 
                        onClick={onNavigateDashboard} 
                        className={`font-semibold transition-colors duration-200 ${view === 'dashboard' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                        aria-current={view === 'dashboard' ? 'page' : undefined}
                    >
                        Dashboard
                    </button>
                    {userRole === 'admin' && (
                         <button 
                            onClick={onNavigateAdmin} 
                            className={`font-semibold transition-colors duration-200 ${view === 'admin' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                            aria-current={view === 'admin' ? 'page' : undefined}
                        >
                            Admin Panel
                        </button>
                    )}
                    </>
                )}
                <a href="#clients" className="text-gray-600 hover:text-indigo-600">Our Clients</a>
                <a href="#" className="text-gray-600 hover:text-indigo-600">Process</a>
                <a href="#work" className="text-gray-600 hover:text-indigo-600">Our Work</a>
                <a href="#" className="text-gray-600 hover:text-indigo-600">Pricing</a>
                <a href="#" className="text-gray-600 hover:text-indigo-600">FAQs</a>
                <a href="#reviews" className="text-gray-600 hover:text-indigo-600">Reviews</a>
            </nav>
            <div>
                {isLoggedIn ? (
                    <div className="flex items-center gap-4">
                        <button onClick={onCartClick} className="text-white focus:outline-none p-2 rounded-full bg-indigo-600 hover:bg-indigo-700" aria-label={`View cart with ${cartItemCount} items`}>
                            <CartIcon itemCount={cartItemCount} />
                        </button>
                        <button onClick={onLogout} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300">
                            Logout
                        </button>
                    </div>
                ) : (
                    <button onClick={onGetStarted} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300">
                        Get Started
                    </button>
                )}
            </div>
        </div>
    </header>
);

const Hero = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    const getTransitionClass = (delay = 0) =>
        `transition-all duration-1000 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}` + ` delay-${delay}`;


    return (
        <section ref={ref} className="bg-gray-50 py-20">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left">
                        <h1 className={`text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight ${getTransitionClass()}`}>
                            Get One Stop<br />
                            <span className="text-indigo-600">Hand-Curated</span> Elite Prospect Data & Multichannel Cold Outreach with <span className="text-indigo-600">Guaranteed Results</span>
                        </h1>
                        <p className={`mt-6 text-lg text-gray-600 ${getTransitionClass(200)}`}>
                            Effortlessly target, validate, and engage prospects through multichannel outreach to get positive responses straight to your inbox. Enjoy a fully managed experience!
                        </p>
                        <div className={`mt-8 space-x-4 ${getTransitionClass(400)}`}>
                            <button className="bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 transition duration-300">Let's Talk</button>
                            <button className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition duration-300">Full Services & Pricing</button>
                        </div>
                    </div>
                    <div>
                        <img
                          src="/images/hero-team.png"
                          alt="B2B Lead Generation Team Collaboration"
                          className={`rounded-lg shadow-2xl transition-transform duration-1000 ease-out ${inView ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`} />
                    </div>
                </div>
            </div>
        </section>
    );
};
const Stats = () => (
    <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                {[{label: "11yrs", sub: "in business"}, {label: "7M+", sub: "Prospects"}, {label: "500+", sub: "Campaigns"}, {label: "15M+", sub: "Email Sent"}, {label: "10K+", sub: "Qualified Leads"}, {label: "170M+", sub: "Revenue"}].map((stat, i) => (
                    <div key={i} className="bg-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <p className="text-3xl font-bold text-indigo-600">{stat.label}</p>
                        <p className="text-gray-500">{stat.sub}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const CelebrityClients = ({ id }: { id?: string }) => (
    <section id={id} className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-2">Our Celebrity Clients</h2>
            <p className="text-gray-600 mb-12">You must be familiar with them, right? We're helping their businesses with our services.</p>
            <div className="grid md:grid-cols-3 gap-12">
                {[
                    {name: "Josh Braun", company: "SalesDNA", img: "/images/clients/josh-braun.jpg", text: "Nsleadprovider is very professional. Delivered contacts and email addresses in a timely manner - no hiccups along the way. I would recommend working with Nsleadprovider.", color: "purple-200"},
                    {name: "Bruce Merrill", company: "Cleverly", img: "/images/clients/bruce-merrill.jpg", text: "Nsleadprovider did excellent. I am highly recommending them as good LeadGen team. I will hire them for my next project, definitely. Highly recommended to anyone.", color: "pink-200"},
                    {name: "Justin Michael", company: "JMM", img: "/images/clients/justin-michael.jpg", text: "Nsleadprovider did a fantastic job and I will use their services again in the future! I would definitely recommend giving them a try. Enthusiastic and quality job delivered on time.", color: "blue-200"}
                ].map((client, i) => (
                    <div key={i} className={`bg-${client.color} p-8 rounded-3xl relative`}>
                        <div className="bg-white p-8 rounded-2xl shadow-lg relative -mt-16">
                            <img src={client.img} alt={client.name} className="w-24 h-24 rounded-full mx-auto -mt-20 mb-4 border-4 border-white shadow-md" />
                            <p className="text-gray-600 mb-4 italic">"{client.text}"</p>
                            <p className="font-bold text-indigo-700">{client.name} | {client.company}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const WhoWeHelp = () => (
     <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-12">Who We Help</h2>
            <div className="grid md:grid-cols-3 gap-8">
                 {[
                    {title: "Who Run a Business", img: "/images/who-we-help/business.jpg"},
                    {title: "Who Manage Sales", img: "/images/who-we-help/sales.jpg"},
                    {title: "Who Drive Marketing", img: "/images/who-we-help/marketing.jpg"}
                ].map((who, i) => (
                    <div key={i}>
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">{who.title}</h3>
                        <img src={who.img} alt={who.title} className="rounded-lg shadow-lg w-full h-auto object-cover" />
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const TrustedClients = () => (
    <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-2">Trusted By 1500+ Global Clients</h2>
            <p className="text-gray-600 mb-8 max-w-3xl mx-auto">We deliver expert solutions tailored to your needs. Experience excellence and innovation with our dedicated team. Join our global network of satisfied partners</p>
            <div className="flex flex-wrap justify-center">
                 {Array.from({length: 12}).map((_, i) => (
                     <img key={i} src={`/images/trusted-clients/client-${i+1}.jpg`} alt={`Client ${i+1}`} className="w-20 h-20 rounded-full object-cover m-2 border-2 border-white shadow-md transition-transform hover:scale-110" />
                 ))}
            </div>
        </div>
    </section>
);

const WhatWeOffer = () => {
    return (
        <section className="py-20 bg-indigo-900">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center text-white mb-2">What We Offer?</h2>
                <div className="w-24 h-1 bg-yellow-400 mx-auto mb-12"></div>
                <div className="space-y-8">
                    {services.map(service => (
                         <div key={service.id} className="bg-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-8">
                            <img src={service.image} alt={service.title} className="w-48 h-auto" />
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">{service.title}</h3>
                                <p className="text-gray-600 mb-6">{service.description}</p>
                            </div>
                            <button className="bg-indigo-800 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-900 transition duration-300 self-start md:self-center whitespace-nowrap">
                               Pricing & Details
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Why Choose Us Section Icons ---
const CheckBadgeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
);

const UserGroupIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const LightBulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4 4-4-4 5.293-5.293a1 1 0 011.414 0L10 13.586l1.293-1.293a1 1 0 011.414 0L15 15.01l2.293-2.293a1 1 0 011.414 0L21 15.01M12 3v4m-2-2h4" />
    </svg>
);

const WrenchScrewdriverIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const WhyChooseUs = () => {
    const points = [
        { icon: <SparklesIcon />, text: "OUR COMMITMENT LESS THAN 1% EMAIL BOUNCE RATE" },
        { icon: <CheckBadgeIcon />, text: "100% DATA ACCURACY GUARANTEE" },
        { icon: <LightBulbIcon />, text: "WE PROVIDE LATEST B2B LEADS" },
        { icon: <WrenchScrewdriverIcon />, text: "WE USE UPDATED TOOLS TO COLLECT AND VERIFY DATA" },
        { icon: <UserGroupIcon />, text: "500+ CUSTOMERS BELIEVE US" },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">WHY CHOOSE US</h2>
                <div className="w-24 h-1 bg-indigo-600 mx-auto mb-12"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                    {points.map((point, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out">
                            <div className="text-indigo-500 mb-4">
                                {point.icon}
                            </div>
                            <p className="text-md font-semibold text-gray-700 uppercase tracking-wide">{point.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


const OurWork = ({ id }: { id?: string }) => (
    <section id={id} className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">Our Work</h2>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
                {['All', 'Lead Lists', 'Email & Phone Finding', 'Cold Email', 'Linkedin Outreach', 'Data Enrichment', 'Email Validation'].map(cat =>(
                    <button key={cat} className={`py-2 px-6 rounded-full font-semibold transition-colors duration-300 ${cat === 'All' ? 'bg-indigo-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-indigo-700 hover:text-white'}`}>
                        {cat}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {Array.from({length: 6}).map((_, i) => (
                     <img key={i} src={`/images/work/sample-${i+1}.png`} alt={`Work sample ${i+1}`} className="rounded-lg shadow-lg w-full h-auto object-cover" />
                 ))}
            </div>
        </div>
    </section>
);
const About = () => (
     <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">About The Nsleadprovider</h2>
            <p className="text-gray-600 max-w-4xl mx-auto mb-12">Nsleadprovider – A powerhouse of 85+ data researchers & outbound experts across Bangladesh, India, & the USA. We build precision-targeted prospect databases and offer cold email & Linkedin outreach campaign management with guaranteed lead qualification & appointment setting.</p>
            <div className="aspect-w-16 aspect-h-9 max-w-4xl mx-auto rounded-lg shadow-2xl overflow-hidden">
                <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Nsleadprovider Introduction Video"></iframe>
            </div>
        </div>
    </section>
);

const HappyClients = ({ id }: { id?: string }) => (
    <section id={id} className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-2">Our Happy Clients?</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 mb-12">Our 98% of clients leave 5/5 star reviews with their high satisfaction. Other 2% made it at least 4 stars</p>
            <div className="grid md:grid-cols-3 gap-8">
                 {[
                    {name: "Ryan Kelly", company: "Co-Founder & Partner - Lendzi", img: "/images/happy-clients/ryan-kelly.jpg", text: "What a pleasure it is to work with Nsleadprovider - We gave a complicated email list collection task and he over delivered as usual great quality! Great work done! Highly recommended!", color: "pink-300"},
                    {name: "Matthew Quinn", company: "VP of Sales at WorkEQ", img: "/images/happy-clients/matthew-quinn.jpg", text: "Really excellent work, and will definitely rehire for future work. Nsleadprovider now the company where I contact first if I have something that needs to be done well. Great job!", color: "green-300"},
                    {name: "John Barrows", company: "Founder & CEO at JB Sales", img: "/images/happy-clients/john-barrows.jpg", text: "Nsleadprovider is the best when it comes to email scraping and data mining! They provides the best quality of work in short time. I say go with them! You will not regret it!", color: "purple-400"}
                 ].map((client, i) => (
                    <div key={i} className={`bg-${client.color} p-6 rounded-3xl shadow-lg`}>
                        <div className="relative">
                           <img src={client.img} alt={client.name} className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-md" />
                           <div className="absolute top-0 right-0 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-serif -mt-2 -mr-2">99</div>
                        </div>
                        <p className="font-bold text-gray-800">{client.name}</p>
                        <p className="text-sm text-gray-700 mb-2">{client.company}</p>
                        <div className="flex justify-center mb-4"><StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon /></div>
                        <p className="text-gray-800 font-semibold italic">"{client.text}"</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FreePilotCTA = () => (
     <section className="py-12 bg-cover bg-center" style={{backgroundImage: "url('/images/work/sample-1.png')"}}>
        <div className="container mx-auto px-6 text-center bg-black bg-opacity-50 py-12 rounded-lg">
            <h2 className="text-4xl font-bold text-white mb-4">Connect Us For Free Pilot</h2>
            <button className="bg-yellow-400 text-gray-900 font-bold py-4 px-10 rounded-lg text-xl hover:bg-yellow-500 transition duration-300">TEST US FREE</button>
        </div>
    </section>
);

const Footer = () => (
    <footer className="bg-indigo-900 text-white">
        <div className="container mx-auto px-6 py-12">
            <div className="grid md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-2xl font-bold mb-4">Nsleadprovider</h3>
                    <p className="text-indigo-200">We help businesses to build high quality hand curated contact list on their target criteria & outreach on them to generate qualified leads</p>
                </div>
                 <div>
                    <h4 className="font-bold text-lg mb-4">Important Link</h4>
                    <ul className="space-y-2 text-indigo-200">
                        <li><a href="#" className="hover:text-white">Home</a></li>
                        <li><a href="#" className="hover:text-white">Services</a></li>
                        <li><a href="#" className="hover:text-white">Portfolio</a></li>
                        <li><a href="#" className="hover:text-white">Testimonial</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-bold text-lg mb-4">Our Services</h4>
                    <ul className="space-y-2 text-indigo-200">
                        <li><a href="#" className="hover:text-white">Custom Contact List Building</a></li>
                        <li><a href="#" className="hover:text-white">Data Enrichment</a></li>
                        <li><a href="#" className="hover:text-white">Cold Email Outreach</a></li>
                        <li><a href="#" className="hover:text-white">Linkedin Campaign</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-bold text-lg mb-4">Contact Us</h4>
                    <ul className="space-y-2 text-indigo-200">
                        <li>+1 561-567-7603</li>
                        <li>+8801642815195</li>
                        <li>info@nsleadprovider.com</li>
                        <li>naim__it</li>
                    </ul>
                </div>
            </div>
            <div className="text-center text-indigo-300 border-t border-indigo-700 mt-8 pt-6">
                © 2024 All rights reserved by Nsleadprovider
            </div>
        </div>
    </footer>
);

const AuthModal = ({ onClose, onAuthSuccess }: { onClose: () => void, onAuthSuccess: (email: string, pass: string, isRegister: boolean) => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAuthSuccess(email, password, isRegister);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl" aria-label="Close authentication modal">&times;</button>
                <h2 className="text-2xl font-bold text-center mb-6">{isRegister ? 'Create Account' : 'Welcome Back!'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email Address</label>
                        <input className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" type="email" value={email} onChange={e => setEmail(e.target.value)} id="email" placeholder="you@example.com" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                        <input className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" type="password" value={password} onChange={e => setPassword(e.target.value)} id="password" placeholder="********" required />
                    </div>
                    <div className="flex flex-col gap-4">
                         <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">{isRegister ? 'Register' : 'Login'}</button>
                         <button type="button" onClick={() => setIsRegister(!isRegister)} className="w-full text-indigo-600 hover:underline">
                            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                         </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Dashboard = ({ onAddToCart, cart }: { onAddToCart: (service: Service) => void, cart: CartItem[] }) => {
    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold mb-8">Our Services Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map(service => {
                    const isInCart = cart.some(item => item.id === service.id);
                    return (
                        <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                            <img src={service.image} alt={service.title} className="w-full h-48 object-contain p-4" />
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                                <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
                                <button
                                    onClick={() => onAddToCart(service)}
                                    disabled={isInCart}
                                    className={`w-full mt-auto py-2 px-4 rounded-lg font-semibold transition-colors ${
                                        isInCart
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    }`}
                                >
                                    {isInCart ? '✓ Added to Cart' : 'Order Now'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const OrderStatusBadge = ({ status }: { status: Order['status'] }) => {
    const statusStyles = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${statusStyles[status]}`}>
            {status}
        </span>
    );
};

const OrderHistory = ({ orders }: { orders: Order[] }) => (
    <div className="container mx-auto px-6 py-12 mt-10 border-t-2 border-gray-200">
        <h2 className="text-3xl font-bold mb-8">My Order History</h2>
        {orders.length === 0 ? (
            <p className="text-gray-600 bg-gray-100 p-6 rounded-lg">You have no past orders.</p>
        ) : (
            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b">
                           <h3 className="text-xl font-semibold text-indigo-700">Order #{String(order.id).padStart(5, '0')}</h3>
                           <div className="flex items-center gap-4">
                                <p className="text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                <OrderStatusBadge status={order.status} />
                           </div>
                        </div>
                        <ul className="space-y-2">
                           {order.items.map(item => (
                               <li key={item.id} className="flex items-center gap-4 p-2 bg-gray-50 rounded">
                                   <img src={item.service_image} alt={item.service_title} className="w-12 h-12 object-contain" />
                                   <span className="font-medium text-gray-800">{item.service_title}</span>
                               </li>
                           ))}
                        </ul>
                    </div>
                ))}
            </div>
        )}
    </div>
);


const CartModal = ({ isOpen, onClose, cart, onRemoveFromCart, onCheckout }: { isOpen: boolean, onClose: () => void, cart: CartItem[], onRemoveFromCart: (id: number) => void, onCheckout: () => void }) => {
    if (!isOpen) return null;

    const totalItems = cart.length;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Your Cart ({totalItems})</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl" aria-label="Close cart modal">&times;</button>
                </div>
                {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div className="max-h-96 overflow-y-auto pr-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between mb-4 border-b pb-4">
                                <div className="flex items-center gap-4">
                                    <img src={item.image} alt={item.title} className="w-16 h-16 object-contain rounded-md" />
                                    <div>
                                        <h3 className="font-semibold">{item.title}</h3>
                                    </div>
                                </div>
                                <button onClick={() => onRemoveFromCart(item.id)} className="text-red-500 hover:text-red-700 font-semibold">Remove</button>
                            </div>
                        ))}
                    </div>
                )}
                 <div className="mt-8 flex justify-end">
                    {cart.length > 0 && (
                         <button onClick={onCheckout} className="bg-green-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                            Checkout
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const CheckoutSuccessModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm">
                 <h2 className="text-2xl font-bold text-green-600 mb-4">Order Placed!</h2>
                 <p className="text-gray-700 mb-6">Thank you for your purchase. We've received your order and will begin processing it shortly.</p>
                 <button onClick={onClose} className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    Continue
                </button>
            </div>
        </div>
    );
}

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
);

const AdminPanel = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/admin/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllOrders();
    }, [fetchAllOrders]);

    const handleUpdateStatus = async (orderId: number, status: 'approved' | 'rejected') => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ status }),
            });
            if (!response.ok) throw new Error('Failed to update status');
            // Update local state to reflect change immediately
            setOrders(prevOrders => prevOrders.map(order => 
                order.id === orderId ? { ...order, status } : order
            ));
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (isLoading) return <div className="container mx-auto px-6 py-12"><LoadingSpinner /></div>;
    if (error) return <div className="container mx-auto px-6 py-12 text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold mb-8">Admin Panel - All Orders</h1>
            {orders.length === 0 ? (
                <p className="text-gray-600 bg-gray-100 p-6 rounded-lg">No orders have been placed yet.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex flex-wrap justify-between items-center mb-4 pb-4 border-b">
                               <div>
                                  <h3 className="text-xl font-semibold text-indigo-700">Order #{String(order.id).padStart(5, '0')}</h3>
                                  <p className="text-sm text-gray-500">User: {order.user_email}</p>
                               </div>
                               <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                    <p className="text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                    <OrderStatusBadge status={order.status} />
                               </div>
                            </div>
                            <ul className="space-y-2 mb-6">
                               {order.items.map(item => (
                                   <li key={item.id} className="flex items-center gap-4 p-2 bg-gray-50 rounded">
                                       <img src={item.service_image} alt={item.service_title} className="w-12 h-12 object-contain" />
                                       <span className="font-medium text-gray-800">{item.service_title}</span>
                                   </li>
                               ))}
                            </ul>
                            {order.status === 'pending' && (
                                <div className="flex justify-end gap-4">
                                    <button onClick={() => handleUpdateStatus(order.id, 'approved')} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300">
                                        Approve
                                    </button>
                                     <button onClick={() => handleUpdateStatus(order.id, 'rejected')} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300">
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


// --- Main App Component ---
function App() {
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartModalOpen, setCartModalOpen] = useState(false);
    const [isCheckoutSuccessOpen, setCheckoutSuccessOpen] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'home' | 'dashboard' | 'admin'>('home');

    const fetchUserOrders = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Could not fetch orders');
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            console.error("Failed to fetch user orders:", err);
        }
    }, []);

    // Check session on initial load
    useEffect(() => {
        const checkSession = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                     const response = await fetch(`${API_BASE_URL}/api/session`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                     });
                     const data = await response.json();
                     if (data.loggedIn) {
                        const userData = parseJwt(token);
                        setLoggedIn(true);
                        setUserRole(userData?.role || 'user');
                        setView('dashboard');
                        fetchUserOrders();
                     } else {
                        localStorage.removeItem('token');
                     }
                }
            } catch (err) {
                 console.error("Session check failed:", err);
            } finally {
                setIsLoading(false);
            }
        };
        checkSession();
    }, [fetchUserOrders]);


    const handleGetStarted = () => setAuthModalOpen(true);
    const handleCloseAuthModal = () => setAuthModalOpen(false);
    
    const handleAuthSuccess = async (email: string, password: string, isRegister: boolean) => {
        const endpoint = isRegister ? `${API_BASE_URL}/api/register` : `${API_BASE_URL}/api/login`;
        try {
            setError(null); 
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                const userData = parseJwt(data.token);
                setLoggedIn(true);
                setUserRole(userData?.role || 'user');
                setView('dashboard');
                fetchUserOrders();
                setAuthModalOpen(false);
            } else {
                throw new Error(data.message || 'Authentication failed');
            }
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setLoggedIn(false);
        setUserRole(null);
        setView('home');
        setCart([]); 
        setOrders([]); 
    };

    const handleAddToCart = (service: Service) => {
        if (!cart.some(item => item.id === service.id)) {
            setCart([...cart, service]);
        }
    };
    const handleRemoveFromCart = (id: number) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const handleCheckout = async () => {
        try {
            setError(null);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ items: cart }),
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Checkout failed');
            }

            setCart([]);
            setCartModalOpen(false);
            setCheckoutSuccessOpen(true);
            fetchUserOrders(); // Refresh orders after checkout
        } catch (err: any) {
            setError(err.message);
        }
    }
    
    const navigateTo = (newView: 'home' | 'dashboard' | 'admin') => {
        // Prevent non-admins from accessing admin panel
        if (newView === 'admin' && userRole !== 'admin') {
            setView('dashboard');
            return;
        }
        setView(newView);
    };


    if (isLoading) {
        return <LoadingSpinner />;
    }

    const renderContent = () => {
        if (isLoggedIn) {
            switch(view) {
                case 'admin':
                    return userRole === 'admin' ? <AdminPanel /> : <Dashboard onAddToCart={handleAddToCart} cart={cart}/>;
                case 'dashboard':
                    return <>
                        <Dashboard onAddToCart={handleAddToCart} cart={cart}/>
                        <OrderHistory orders={orders} />
                    </>;
                case 'home':
                default:
                    // Logged in but wants to see home page
                    return (
                        <>
                           <Hero />
                            <Stats />
                            <CelebrityClients id="clients" />
                            <WhoWeHelp />
                            <TrustedClients />
                            <WhatWeOffer />
                            <WhyChooseUs />
                            <OurWork id="work" />
                            <About />
                            <HappyClients id="reviews" />
                            <FreePilotCTA />
                        </>
                    );
            }
        }
        // Not logged in, always show home page
        return (
            <>
                <Hero />
                <Stats />
                <CelebrityClients id="clients" />
                <WhoWeHelp />
                <TrustedClients />
                <WhatWeOffer />
                <WhyChooseUs />
                <OurWork id="work" />
                <About />
                <HappyClients id="reviews" />
                <FreePilotCTA />
            </>
        );
    };

    return (
        <div className="bg-white">
            <Header
                onGetStarted={handleGetStarted}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                onCartClick={() => setCartModalOpen(true)}
                cartItemCount={cart.length}
                onNavigateHome={() => navigateTo('home')}
                onNavigateDashboard={() => navigateTo('dashboard')}
                onNavigateAdmin={() => navigateTo('admin')}
                view={view}
                userRole={userRole}
             />
             {error && <div className="bg-red-500 text-white p-4 text-center" role="alert">{error}</div>}
            <main>
                {renderContent()}
            </main>
            {(!isLoggedIn || view === 'home') && <Footer />}

            {isAuthModalOpen && <AuthModal onClose={handleCloseAuthModal} onAuthSuccess={handleAuthSuccess} />}
            <CartModal
                isOpen={isCartModalOpen}
                onClose={() => setCartModalOpen(false)}
                cart={cart}
                onRemoveFromCart={handleRemoveFromCart}
                onCheckout={handleCheckout}
            />
            <CheckoutSuccessModal
                isOpen={isCheckoutSuccessOpen}
                onClose={() => setCheckoutSuccessOpen(false)}
            />
        </div>
    );
}

export default App;
