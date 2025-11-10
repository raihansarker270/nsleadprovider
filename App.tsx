
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

// --- SVG Icons ---
const StarIcon = () => (
    <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
    </svg>
);

// --- Component Definitions ---

const Header = () => (
    <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <StarIcon />
                <span className="text-2xl font-bold text-slate-800">Nsleadprovider</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8 text-slate-600 font-medium">
                <a href="#" className="hover:text-indigo-600">Our Clients</a>
                <a href="#" className="hover:text-indigo-600">Process</a>
                <a href="#" className="hover:text-indigo-600">Our Work</a>
                <a href="#" className="hover:text-indigo-600">Pricing</a>
                <a href="#" className="hover:text-indigo-600">FAQs</a>
                <a href="#" className="hover:text-indigo-600">Reviews</a>
            </nav>
            <a href="#" className="hidden md:block bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Get Started
            </a>
            <button className="md:hidden text-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </div>
    </header>
);

const Hero = () => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <section ref={ref} className="bg-slate-50 py-16 md:py-24 overflow-hidden">
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                    <h1 className={`text-3xl md:text-5xl font-extrabold text-slate-800 leading-tight transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        Get One Stop<br />
                        <span className="text-indigo-600">Hand-Curated Elite Prospect Data</span><br />
                        & Multichannel Cold Outreach with Guaranteed Results
                    </h1>
                    <p className={`mt-6 text-lg text-slate-600 transition-all duration-700 ease-out delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        Effortlessly target, validate, and engage prospects through multichannel outreach to get positive responses straight to your inbox. Enjoy a fully managed experience!
                    </p>
                    <div className={`mt-8 flex justify-center md:justify-start space-x-4 transition-all duration-700 ease-out delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <a href="#" className="bg-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                            Let's Talk
                        </a>
                        <a href="#" className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                            Full Services & Pricing
                        </a>
                    </div>
                </div>
                <div className={`transition-all duration-1000 ease-out delay-100 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <img src="https://i.imgur.com/uSOiO3q.png" alt="Team working on outreach" className="w-full h-auto" />
                </div>
            </div>
        </section>
    );
};

const statsData = [
    { value: '11yrs', label: 'in business' },
    { value: '7M+', label: 'Prospects' },
    { value: '500+', label: 'Campaigns' },
    { value: '15M+', label: 'Email Sent' },
    { value: '10K+', label: 'Qualified Leads' },
    { value: '170M+', label: 'Revenue' },
];

const Stats = () => (
    <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                {statsData.map((stat, index) => (
                    <div key={index} className="bg-slate-50/50 shadow-md rounded-2xl p-6">
                        <p className="text-3xl font-bold text-indigo-900">{stat.value}</p>
                        <p className="text-slate-500 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const celebrityClientsData = [
    {
        name: 'Josh Braun',
        company: 'SalesDNA',
        testimonial: 'Nsleadprovider is very professional. Delivered contacts and email addresses in a timely manner - no hiccups along the way. I would recommend working with Nsleadprovider.',
        image: 'https://picsum.photos/id/1005/100/100',
        bgColor: 'bg-violet-200'
    },
    {
        name: 'Bruce Merrill',
        company: 'Cleverly',
        testimonial: 'Nsleadprovider did excellent. I am highly recommending them as good LeadGen team. I will hire them for my next project, definitely. Highly recommended to anyone',
        image: 'https://picsum.photos/id/1011/100/100',
        bgColor: 'bg-pink-200'
    },
    {
        name: 'Justin Michael',
        company: 'JMM',
        testimonial: 'Nsleadprovider did a fantastic job and I will use their services again in the future! I would definitely recommend giving them a try. Enthusiastic and quality job delivered on time.',
        image: 'https://picsum.photos/id/1027/100/100',
        bgColor: 'bg-sky-200'
    },
];

const CelebrityClients = () => (
    <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-slate-800">Our Celebrity Clients</h2>
            <p className="mt-4 text-slate-600">You must be familiar, right? We helping their businesses with our services.</p>
            <div className="mt-12 grid md:grid-cols-3 gap-10">
                {celebrityClientsData.map((client, index) => (
                    <div key={index} className="relative pt-12">
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-48 ${client.bgColor} rounded-2xl`}></div>
                        <div className="relative bg-white shadow-lg rounded-2xl p-6 pt-0">
                            <img src={client.image} alt={client.name} className="w-24 h-24 rounded-full mx-auto -mt-12 border-4 border-white" />
                            <p className="mt-6 text-slate-600 italic">"{client.testimonial}"</p>
                            <p className="mt-6 font-bold text-slate-800">{client.name} | {client.company}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const whoWeHelpData = [
    { title: 'Who Run a Business', image: 'https://picsum.photos/seed/business/400/300' },
    { title: 'Who Manage Sales', image: 'https://picsum.photos/seed/sales/400/300' },
    { title: 'Who Drive Marketing', image: 'https://picsum.photos/seed/marketing/400/300' },
];

const WhoWeHelp = () => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-slate-800">Who We Help</h2>
            <div className="mt-12 grid md:grid-cols-3 gap-8">
                {whoWeHelpData.map((item, index) => (
                    <div key={index}>
                        <p className="text-lg font-semibold text-slate-700 mb-4">{item.title}</p>
                        <img src={item.image} alt={item.title} className="rounded-lg shadow-md w-full h-auto aspect-[4/3] object-cover" />
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const TrustedBy = () => (
    <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-slate-800">Trusted By 1500+ Global Clients</h2>
            <p className="mt-4 text-slate-600 max-w-3xl mx-auto">
                We deliver expert solutions tailored to your needs. Experience excellence and innovation with our dedicated team. Join our global network of satisfied partners
            </p>
            <div className="mt-12 flex flex-wrap justify-center">
                {Array.from({ length: 12 }).map((_, i) => (
                    <img key={i} src={`https://picsum.photos/seed/face${i}/100/100`} alt="Client" className="w-20 h-20 object-cover -ml-2 first:ml-0" />
                ))}
            </div>
        </div>
    </section>
);

const servicesData = [
    { title: 'Targeted Custom Contact List Building', description: 'Transform your outreach with our expertly curated, high-quality prospect contact lists. We meticulously research and verify each contact, ensuring precision and reliability.', image: 'https://i.imgur.com/gKHYsPj.png' },
    { title: 'Data Entry & Web Research', description: 'Our Data Entry & Web Research service offers precise data finding & input, thorough online research to enhance your business operations.', image: 'https://i.imgur.com/7bJdY3t.png' },
    { title: 'CRM Data Appending & Enrichment', description: 'Supercharge your CRM with our specialized email and phone number enrichment services. We enhance your customer data with accurate details.', image: 'https://i.imgur.com/K9R7b2j.png' },
    { title: 'Verified Email Finding', description: 'Unlock verified email discovery with our specialized service. We deliver accurate, validated email addresses to enhance your outreach strategy.', image: 'https://i.imgur.com/02xXk5o.png' },
    { title: 'Phone Number Finding', description: 'Discover verified phone numbers with our dedicated service. We provide accurate, validated phone contacts to strengthen your outreach efforts.', image: 'https://i.imgur.com/eBwFjR3.png' },
    { title: 'Hire Dedicated Research Team', description: 'Expand your reach with our dedicated research team focused on prospect contact data. We provide tailored solutions, ensuring accurate and targeted information.', image: 'https://i.imgur.com/c6D8w1a.png' },
];

const WhatWeOffer = () => (
    <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white">What We Offer?</h2>
            <div className="w-20 h-1 bg-yellow-400 mx-auto mt-4"></div>
            <div className="mt-12 grid md:grid-cols-1 gap-8 text-left">
                {servicesData.map((service, index) => (
                    <div key={index} className="bg-white rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-lg">
                        <img src={service.image} alt={service.title} className="w-48 h-auto flex-shrink-0" />
                        <div className="flex-grow">
                            <h3 className="text-2xl font-bold text-slate-800">{service.title}</h3>
                            <p className="mt-2 text-slate-600">{service.description}</p>
                        </div>
                        <a href="#" className="bg-slate-800 text-white font-semibold px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors flex-shrink-0 whitespace-nowrap mt-4 md:mt-0">
                            Pricing & Details
                        </a>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const workFilters = ['All', 'Lead Lists', 'Email & Phone Finding', 'Cold Email', 'Linkedin Outreach', 'Data Enrichment', 'Email Validation'];
const workImages = [
    'https://i.imgur.com/rN9m8bM.png',
    'https://i.imgur.com/2s4L5kE.png',
    'https://i.imgur.com/d7T7eXp.png',
    'https://i.imgur.com/w9z2v5E.png',
    'https://i.imgur.com/yFz4x0a.png',
];

const OurWork = () => {
    const [activeFilter, setActiveFilter] = useState('All');

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-slate-800">Our Work</h2>
                <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-4">
                    {workFilters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-5 py-2 font-semibold rounded-full transition-colors ${activeFilter === filter ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workImages.map((src, index) => (
                        <div key={index} className="bg-slate-100 rounded-lg shadow-md overflow-hidden">
                           <img src={src} alt={`Work sample ${index + 1}`} className="w-full h-auto object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const About = () => (
    <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 text-center max-w-4xl">
            <h2 className="text-4xl font-bold text-slate-800">About The Nsleadprovider</h2>
            <p className="mt-6 text-slate-600 leading-relaxed">
                Nsleadprovider – A powerhouse of 85+ data researchers & outbound experts across Bangladesh, India, & the USA. We build precision-targeted prospect databases and offer cold email & Linkedin outreach campaign management with guaranteed lead qualification & appointment setting.
            </p>
            <div className="mt-12 aspect-video bg-black rounded-lg shadow-xl flex items-center justify-center">
                 <p className="text-white text-2xl font-bold">Video Placeholder</p>
            </div>
        </div>
    </section>
);

const happyClientsData = [
    { name: 'Ryan Kelly', company: 'Co-Founder & Partner - Lendzi', review: 'What a pleasure it is to work with Nsleadprovider - We gave a complicated email list collection task and he over delivered as usual great quality! Great work done! Highly recommended!', image: 'https://picsum.photos/id/237/100/100', color: 'bg-pink-400' },
    { name: 'Matthew Quinn', company: 'VP of Sales at WorkEQ', review: 'Really excellent work, and will definitely rehire for future work. Nsleadprovider now the company where I contact first if I have something that needs to be done well. Great job!', image: 'https://picsum.photos/id/238/100/100', color: 'bg-green-400' },
    { name: 'John Barrows', company: 'Founder & CEO at JB Sales', review: 'Nsleadprovider is the best when it comes to email scraping and data mining! They provides the best quality of work in short time. I say go with them! You will not regret it!', image: 'https://picsum.photos/id/239/100/100', color: 'bg-purple-500' },
];

const HappyClients = () => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-slate-800">Our Happy Clients?</h2>
            <div className="w-20 h-1 bg-indigo-500 mx-auto mt-4"></div>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Our 98% of clients leave 5/5 star reviews with their high satisfaction. Other 2% made it at least 4 stars</p>
            <div className="mt-12 grid md:grid-cols-3 gap-8">
                {happyClientsData.map((client, index) => (
                    <div key={index} className={`${client.color} text-white rounded-2xl p-8 text-left shadow-lg relative`}>
                        <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-4xl font-serif opacity-80">
                            ”
                        </div>
                        <div className="flex items-center space-x-4">
                            <img src={client.image} alt={client.name} className="w-16 h-16 rounded-full border-2 border-white" />
                            <div>
                                <p className="font-bold text-lg">{client.name}</p>
                                <p className="text-sm opacity-90">{client.company}</p>
                            </div>
                        </div>
                        <div className="flex space-x-1 my-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                            ))}
                        </div>
                        <p className="font-semibold italic">"{client.review}"</p>
                    </div>
                ))}
            </div>
             <div className="mt-8 flex justify-center space-x-2">
                <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
            </div>
        </div>
    </section>
);


const Footer = () => (
    <footer className="bg-slate-900 text-slate-300">
        <div className="container mx-auto px-6 py-16 grid md:grid-cols-4 gap-12">
            <div>
                <div className="flex items-center space-x-2">
                    <div className="bg-white p-1 rounded-md"><StarIcon/></div>
                    <span className="text-2xl font-bold text-white">Nsleadprovider</span>
                </div>
                <p className="mt-4 text-sm">
                    We help businesses to build high quality hand curated contact list on their target criteria & outreach on them to generate qualified leads
                </p>
            </div>
            <div>
                <h4 className="font-bold text-white text-lg">Important Link</h4>
                <ul className="mt-4 space-y-2 text-sm">
                    <li><a href="#" className="hover:text-white">Home</a></li>
                    <li><a href="#" className="hover:text-white">Services</a></li>
                    <li><a href="#" className="hover:text-white">Portfolio</a></li>
                    <li><a href="#" className="hover:text-white">Testimonial</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-white text-lg">Our Services</h4>
                <ul className="mt-4 space-y-2 text-sm">
                    <li><a href="#" className="hover:text-white">Custom Contact List Building</a></li>
                    <li><a href="#" className="hover:text-white">Data Enrichment</a></li>
                    <li><a href="#" className="hover:text-white">Cold Email Outreach</a></li>
                    <li><a href="#" className="hover:text-white">Linkedin Campaign</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-white text-lg">Contact Us</h4>
                <ul className="mt-4 space-y-2 text-sm">
                    <li><a href="#" className="hover:text-white">+1 561-228-4003</a></li>
                    <li><a href="#" className="hover:text-white">+8807776111677</a></li>
                    <li><a href="#" className="hover:text-white">info@nsleadprovider.com</a></li>
                    <li><a href="#" className="hover:text-white">nazmul_it</a></li>
                </ul>
            </div>
        </div>
        <div className="border-t border-slate-700">
            <div className="container mx-auto px-6 py-4 text-center text-sm text-slate-400">
                &copy; 2024 All rights reserved by Nsleadprovider
            </div>
        </div>
    </footer>
);


const App: React.FC = () => {
    return (
        <div className="bg-white">
            <Header />
            <main>
                <Hero />
                <Stats />
                <CelebrityClients />
                <WhoWeHelp />
                <TrustedBy />
                <WhatWeOffer />
                <OurWork />
                <About />
                <HappyClients />
            </main>
            <Footer />
        </div>
    );
};

export default App;
