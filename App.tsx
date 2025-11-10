import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

// --- Type Definitions ---
interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface CartItem extends Service {}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
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
    { id: 1, title: 'Targeted Custom Contact List Building', description: 'Transform your outreach with our expertly curated, high-quality prospect contact lists.', image: '/images/services/service-1.png' },
    { id: 2, title: 'Data Entry & Web Research', description: 'Our Data Entry & Web Research service offers precise data finding & input.', image: '/images/services/service-2.png' },
    { id: 3, title: 'CRM Data Appending & Enrichment', description: 'Supercharge your CRM with our specialized email and phone number enrichment services.', image: '/images/services/service-3.png' },
    { id: 4, title: 'Verified Email Finding', description: 'Unlock verified email discovery with our specialized service.', image: '/images/services/service-4.png' },
    { id: 5, title: 'Phone Number Finding', description: 'Discover verified phone numbers with our dedicated service.', image: '/images/services/service-5.png' },
    { id: 6, title: 'Hire Dedicated Research Team', description: 'Expand your reach with our dedicated research team focused on prospect contact data.', image: '/images/services/service-6.png' },
    { id: 7, title: 'God Level Email Validation', description: 'Ensure flawless email validation with our ‘God Level’ service by sending test email 1 by 1 from public server.', image: '/images/services/service-7.png' },
    { id: 8, title: 'Email Personalization', description: 'We specialize in writing captivating opening lines for personalized emails.', image: '/images/services/service-8.png' },
    { id: 9, title: 'Apollo Data Scrapping', description: 'Get hassle-free Apollo.io data export, reformatting, cleaning, and validation at an unbeatable price!', image: '/images/services/service-9.png' },
    { id: 10, title: 'Done-For-You Cold Email Outreach', description: 'Effortlessly execute cold email outreach with our ‘Done-For-You’ service.', image: '/images/services/service-10.png' },
    { id: 11, title: 'Done-For-You Linkedin Outreach', description: 'Transform your outreach with our ‘Done-For-You’ Linkedin outreach service.', image: '/images/services/service-11.png' },
];

// --- Sub-Components (Defined outside App) ---

const Header = ({ onGetStarted, isLoggedIn, onLogout, onCartClick, cartItemCount }: { onGetStarted: () => void, isLoggedIn: boolean, onLogout: () => void, onCartClick: () => void, cartItemCount: number }) => (
    <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-indigo-700">
                <span className="text-yellow-500">⭐</span> Nsleadprovider
            </div>
            <nav className="hidden md:flex space-x-8 items-center">
                <a href="#" className="text-gray-600 hover:text-indigo-600">Our Clients</a>
                <a href="#" className="text-gray-600 hover:text-indigo-600">Process</a>
                <a href="#" className="text-gray-600 hover:text-indigo-600">Our Work</a>
                <a href="#" className="text-gray-600 hover:text-indigo-600">Pricing</a>
                <a href="#" className="text-gray-600 hover:text-indigo-600">FAQs</a>
                <a href="#" className="text-gray-600 hover:text-indigo-600">Reviews</a>
            </nav>
            <div>
                {isLoggedIn ? (
                    <div className="flex items-center gap-4">
                        <button onClick={onCartClick} className="text-white focus:outline-none p-2 rounded-full bg-indigo-600 hover:bg-indigo-700">
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

const CelebrityClients = () => (
    <section className="py-20 bg-gray-50">
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

const WhatWeOffer = () => (
    <section className="py-20 bg-indigo-900">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-white mb-2">What We Offer?</h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-12"></div>
            <div className="space-y-8">
                {services.slice(0, 6).map(service => (
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

const OurWork = () => (
    <section className="py-20 bg-white">
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
                <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
        </div>
    </section>
);

const HappyClients = () => (
    <section className="py-20 bg-white">
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
                        <li>+1 561-228-4003</li>
                        <li>+8807776111677</li>
                        <li>info@nsleadprovider.com</li>
                        <li>nazmul__it</li>
                    </ul>
                </div>
            </div>
            <div className="text-center text-indigo-300 border-t border-indigo-700 mt-8 pt-6">
                © 2024 All rights reserved by Nsleadprovider
            </div>
        </div>
    </footer>
);

const AuthModal = ({ onClose, onAuthSuccess }: { onClose: () => void, onAuthSuccess: () => void }) => {
    // Simulated auth
    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        onAuthSuccess();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                <h2 className="text-2xl font-bold text-center mb-6">Welcome!</h2>
                <form onSubmit={handleAuth}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email Address</label>
                        <input className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" type="email" id="email" placeholder="you@example.com" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                        <input className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" type="password" id="password" placeholder="********" required />
                    </div>
                    <div className="flex flex-col gap-4">
                         <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">Login</button>
                         <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">Register</button>
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
const OrderHistory = ({ orders }: { orders: Order[] }) => (
    <div className="container mx-auto px-6 py-12 mt-10 border-t-2 border-gray-200">
        <h2 className="text-3xl font-bold mb-8">My Order History</h2>
        {orders.length === 0 ? (
            <p className="text-gray-600 bg-gray-100 p-6 rounded-lg">You have no past orders.</p>
        ) : (
            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                           <h3 className="text-xl font-semibold text-indigo-700">Order #{order.id.substring(0, 8)}</h3>
                           <p className="text-gray-500">{order.date}</p>
                        </div>
                        <ul className="space-y-2">
                           {order.items.map(item => (
                               <li key={item.id} className="flex items-center gap-4 p-2 bg-gray-50 rounded">
                                   <img src={item.image} alt={item.title} className="w-12 h-12 object-contain" />
                                   <span className="font-medium text-gray-800">{item.title}</span>
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
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
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

// --- Main App Component ---
function App() {
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartModalOpen, setCartModalOpen] = useState(false);
    const [isCheckoutSuccessOpen, setCheckoutSuccessOpen] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);


    const handleGetStarted = () => setAuthModalOpen(true);
    const handleCloseAuthModal = () => setAuthModalOpen(false);
    const handleAuthSuccess = () => {
        setLoggedIn(true);
        setAuthModalOpen(false);
    };
    const handleLogout = () => {
        setLoggedIn(false);
        setCart([]); // Clear cart on logout
        setOrders([]); // Clear order history on logout
    };

    const handleAddToCart = (service: Service) => {
        if (!cart.some(item => item.id === service.id)) {
            setCart([...cart, service]);
        }
    };
    const handleRemoveFromCart = (id: number) => {
        setCart(cart.filter(item => item.id !== id));
    };



    const handleCheckout = () => {
        const newOrder: Order = {
            id: new Date().toISOString(),
            date: new Date().toLocaleDateString(),
            items: [...cart],
        };
        setOrders([...orders, newOrder]);
        setCart([]);
        setCartModalOpen(false);
        setCheckoutSuccessOpen(true);
    }

    return (
        <div className="bg-white">
            <Header
                onGetStarted={handleGetStarted}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                onCartClick={() => setCartModalOpen(true)}
                cartItemCount={cart.length}
             />
            <main>
                {isLoggedIn ? (
                    <>
                        <Dashboard onAddToCart={handleAddToCart} cart={cart}/>
                        <OrderHistory orders={orders} />
                    </>

                ) : (
                   <>
                        <Hero />
                        <Stats />
                        <CelebrityClients />
                        <WhoWeHelp />
                        <TrustedClients />
                        <WhatWeOffer />
                        <OurWork />
                        <About />
                        <HappyClients />
                        <FreePilotCTA />
                   </>
                )}
            </main>
            {!isLoggedIn && <Footer />}

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