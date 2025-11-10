import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

// Helper component for animated sections
const AnimatedSection = ({ children, customClass = '' }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${customClass} ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {children}
    </div>
  );
};


// --- AUTHENTICATION & DASHBOARD COMPONENTS ---

const AuthModal = ({ setShowModal, handleLogin }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome Back!</h2>
            <p className="mb-6 text-gray-600">Please login or register to continue.</p>
            <div className="space-y-4">
                 <button onClick={() => handleLogin('user@example.com', 'password')} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                    Login
                </button>
                <button onClick={() => handleLogin('newuser@example.com', 'password')} className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300">
                    Register
                </button>
            </div>
            <button onClick={() => setShowModal(false)} className="mt-6 text-gray-500 hover:text-gray-700 transition-colors">
                Close
            </button>
        </div>
    </div>
);

const CartModal = ({ cart, removeFromCart, setShowCart, handleCheckout }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Cart</h2>
            {cart.length === 0 ? (
                <p className="text-gray-600">Your cart is empty.</p>
            ) : (
                <div className="space-y-4">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center border-b pb-2">
                            <span className="text-gray-700">{item.title}</span>
                             <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 font-semibold">
                                Remove
                            </button>
                        </div>
                    ))}
                    <button onClick={handleCheckout} className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                        Checkout
                    </button>
                </div>
            )}
            <button onClick={() => setShowCart(false)} className="mt-6 w-full text-center text-gray-500 hover:text-gray-700 transition-colors">
                Close
            </button>
        </div>
    </div>
);

const CheckoutModal = ({ setShowCheckoutModal }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center w-full max-w-sm">
             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Order Placed!</h2>
            <p className="text-gray-600 mb-6">Thank you for your purchase.</p>
            <button onClick={() => setShowCheckoutModal(false)} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Continue
            </button>
        </div>
    </div>
);

const OrderHistory = ({ orders }) => (
    <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">My Order History</h2>
        {orders.length === 0 ? (
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">You have no past orders.</p>
        ) : (
            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="font-bold text-lg text-blue-700">Order #{order.id}</h3>
                             <span className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <ul className="space-y-2">
                           {order.items.map(item => (
                               <li key={item.id} className="flex items-center text-gray-700">
                                   <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                   {item.title}
                               </li>
                           ))}
                        </ul>
                    </div>
                ))}
            </div>
        )}
    </div>
);

const Dashboard = ({ user, services, cart, addToCart, orders }) => (
    <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome, {user.email}!</h1>
        <p className="text-lg text-gray-600 mb-8">Here are our available services. You can add them to your cart.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(service => {
                const isInCart = cart.some(item => item.id === service.id);
                return (
                     <div key={service.id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 transition-transform hover:scale-105">
                        <h3 className="text-xl font-bold mb-2 text-blue-800">{service.title}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                         <button
                            onClick={() => !isInCart && addToCart(service)}
                            disabled={isInCart}
                            className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                                isInCart
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {isInCart ? '✓ Added to Cart' : 'Order Now'}
                        </button>
                    </div>
                );
            })}
        </div>
        <OrderHistory orders={orders} />
    </div>
);


// --- LANDING PAGE COMPONENTS ---

const Header = ({ setShowModal, isLoggedIn, handleLogout, setShowCart, cartItemCount }) => (
    <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
             <div className="text-2xl font-bold text-blue-900">
                <span className="text-yellow-500">&#9733;</span> Nsleadprovider
            </div>
            <nav className="hidden md:flex items-center space-x-8 text-gray-600 font-medium">
                <a href="#clients" className="hover:text-blue-600 transition-colors">Our Clients</a>
                <a href="#process" className="hover:text-blue-600 transition-colors">Process</a>
                <a href="#work" className="hover:text-blue-600 transition-colors">Our Work</a>
                <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
                <a href="#faqs" className="hover:text-blue-600 transition-colors">FAQs</a>
                <a href="#reviews" className="hover:text-blue-600 transition-colors">Reviews</a>
            </nav>
            <div className="flex items-center space-x-4">
            {isLoggedIn ? (
                <>
                    <button onClick={() => setShowCart(true)} className="relative text-gray-600 hover:text-blue-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
                        )}
                    </button>
                    <button onClick={handleLogout} className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors">
                        Logout
                    </button>
                </>
            ) : (
                <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                    Get Started
                </button>
            )}
            </div>
        </div>
    </header>
);

const Hero = () => {
    const { ref: textRef, inView: textInView } = useInView({ triggerOnce: true, threshold: 0.5 });
    const { ref: imgRef, inView: imgInView } = useInView({ triggerOnce: true, threshold: 0.5 });

    return (
        <section className="bg-gray-50 py-20">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                <div ref={textRef} className={`transition-all duration-700 ease-out ${textInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
                        Get One Stop <br />
                        <span className="text-blue-600">Hand-Curated Elite Prospect Data</span> & Multichannel Cold Outreach with <span className="text-blue-600">Guaranteed Results</span>
                    </h1>
                    <p className="mt-6 text-lg text-gray-600">
                        Effortlessly target, validate, and engage prospects through multichannel outreach to get positive responses straight to your inbox. Enjoy a fully managed experience!
                    </p>
                    <div className="mt-8 space-x-4">
                         <button className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors">Let's Talk</button>
                         <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">Full Services & Pricing</button>
                    </div>
                </div>
                 <div ref={imgRef} className={`transition-all duration-700 ease-in-out ${imgInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <img src="https://i.imgur.com/8Q14a7A.png" alt="Team working on outreach" className="w-full h-auto" />
                </div>
            </div>
        </section>
    );
};

const Stats = () => (
    <AnimatedSection customClass="py-12 bg-white">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                {['11yrs in business', '7M+ Prospects', '500+ Campaigns', '15M+ Email Sent', '10K+ Qualified Leads', '170M+ Revenue'].map((stat, i) => (
                    <div key={i} className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                        <p className="text-3xl font-bold text-blue-600">{stat.split(' ')[0]}</p>
                        <p className="text-gray-500">{stat.split(' ').slice(1).join(' ')}</p>
                    </div>
                ))}
            </div>
        </div>
    </AnimatedSection>
);

const CelebrityClients = () => (
     <AnimatedSection customClass="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-800">Our Celebrity Clients</h2>
            <p className="mt-4 text-gray-600">You must be familiar with them, right? We're helping their businesses with our services.</p>
            <div className="mt-12 grid md:grid-cols-3 gap-12">
                 {[
                    { name: 'Josh Braun', company: 'SalesDNA', img: 'https://i.imgur.com/uJGm1na.jpg', text: "Nsleadprovider is very professional. Delivered contacts and email addresses in a timely manner - no hiccups along the way. I would recommend working with Nsleadprovider.", color: 'purple-200' },
                    { name: 'Bruce Merrill', company: 'Cleverly', img: 'https://i.imgur.com/o1Qk3aI.jpg', text: "Nsleadprovider did excellent. I am highly recommending them as good LeadGen team. I will hire them for my next project, definitely. Highly recommended to anyone.", color: 'pink-200' },
                    { name: 'Justin Michael', company: 'JMM', img: 'https://i.imgur.com/W2q2s2q.jpg', text: "Nsleadprovider did a fantastic job and I will use their services again in the future! I would definitely recommend giving them a try. Enthusiastic and quality job delivered on time.", color: 'blue-200' }
                ].map((client, i) => (
                    <div key={i} className={`relative p-8 bg-${client.color} rounded-3xl`}>
                        <div className="relative bg-white p-8 rounded-2xl shadow-lg mt-[-4rem]">
                            <img src={client.img} alt={client.name} className="w-24 h-24 rounded-full mx-auto -mt-16 border-4 border-white"/>
                            <p className="mt-6 text-gray-600 italic">"{client.text}"</p>
                            <p className="mt-6 font-bold text-gray-800">{client.name} | {client.company}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </AnimatedSection>
);

const WhoWeHelp = () => (
    <AnimatedSection customClass="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-800">Who We Help</h2>
            <div className="mt-12 grid md:grid-cols-3 gap-8">
                 {[
                    { title: 'Who Run a Business', img: 'https://i.imgur.com/R3pE2T6.jpg' },
                    { title: 'Who Manage Sales', img: 'https://i.imgur.com/mO24T65.jpg' },
                    { title: 'Who Drive Marketing', img: 'https://i.imgur.com/tHqgL1a.jpg' }
                ].map((who, i) => (
                    <div key={i}>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">{who.title}</h3>
                        <img src={who.img} alt={who.title} className="rounded-lg shadow-lg w-full h-auto"/>
                    </div>
                ))}
            </div>
        </div>
    </AnimatedSection>
);

const GlobalClients = () => (
    <AnimatedSection customClass="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-800">Trusted By 1500+ Global Clients</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">We deliver expert solutions tailored to your needs. Experience excellence and innovation with our dedicated team. Join our global network of satisfied partners.</p>
            <div className="mt-12 flex flex-wrap justify-center">
                <img src="https://i.imgur.com/lZ2jYxL.png" alt="Global clients collage" className="w-full max-w-5xl h-auto" />
            </div>
        </div>
    </AnimatedSection>
);


const WhatWeOffer = ({ services }) => (
    <AnimatedSection customClass="py-20 bg-blue-900">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white">What We Offer?</h2>
             <div className="w-24 h-1 bg-yellow-400 mx-auto mt-4 mb-12"></div>
             <div className="space-y-8">
                {services.map((service) => (
                    <div key={service.id} className="bg-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center text-left gap-8">
                        <img src={service.img} alt={service.title} className="w-48 h-auto flex-shrink-0" />
                        <div className="flex-grow">
                             <h3 className="text-2xl font-bold text-gray-800">{service.title}</h3>
                             <p className="mt-2 text-gray-600">{service.description}</p>
                        </div>
                        <button className="bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-900 transition-colors w-full md:w-auto mt-4 md:mt-0">
                             &#9737; Pricing & Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </AnimatedSection>
);

const OurWork = () => (
    <AnimatedSection customClass="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-800">Our Work</h2>
             <div className="mt-8 flex flex-wrap justify-center gap-4">
                {['All', 'Lead Lists', 'Email & Phone Finding', 'Cold Email', 'Linkedin Outreach', 'Data Enrichment', 'Email Validation'].map(cat => (
                    <button key={cat} className={`py-2 px-6 rounded-full font-semibold transition-colors ${cat === 'All' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-800 hover:text-white'}`}>
                        {cat}
                    </button>
                ))}
            </div>
            <div className="mt-12">
                 <img src="https://i.imgur.com/tL4E29p.png" alt="Our Work Examples" className="w-full h-auto mx-auto"/>
            </div>
        </div>
    </AnimatedSection>
);

const About = () => (
    <AnimatedSection customClass="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
             <h2 className="text-4xl font-bold text-gray-800">About The Nsleadprovider</h2>
             <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
                Nsleadprovider – A powerhouse of 85+ data researchers & outbound experts across Bangladesh, India, & the USA. We build precision-targeted prospect databases and offer cold email & LinkedIn outreach campaign management with guaranteed lead qualification & appointment setting.
             </p>
             <div className="mt-12 max-w-4xl mx-auto shadow-2xl rounded-lg overflow-hidden">
                <img src="https://i.imgur.com/b2wXkYJ.png" alt="About Nsleadprovider Team" className="w-full h-auto"/>
            </div>
        </div>
    </AnimatedSection>
);

const HappyClients = () => (
    <AnimatedSection customClass="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-800">Our Happy Clients?</h2>
             <p className="mt-4 text-gray-600">Our 98% of clients leave 5/5 star reviews with their high satisfaction. Other 2% made it at least 4 stars.</p>
             <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 mb-12"></div>
            <div className="mt-12 grid md:grid-cols-3 gap-8">
                 {[
                    { name: 'Ryan Kelly', company: 'Co-Founder & Partner - Lendzi', text: "What a pleasure it is to work with Nsleadprovider - We gave a complicated email list collection task and he over delivered as usual great quality! Great work done! Highly recommended!", color: 'pink-400' },
                    { name: 'Matthew Quinn', company: 'VP of Sales at WorkEQ', text: "Really excellent work, and will definitely rehire for future work. Nsleadprovider now the company where I contact first if I have something that needs to be done well. Great job!", color: 'green-400' },
                    { name: 'John Barrows', company: 'Founder & CEO at JB Sales', text: "Nsleadprovider is the best when it comes to email scraping and data mining! They provides the best quality of work in short time. I say go with them! You will not regret it!", color: 'purple-500' }
                ].map((client, i) => (
                    <div key={i} className={`bg-${client.color} text-white p-8 rounded-2xl shadow-xl`}>
                        <div className="flex justify-between items-start">
                             <div>
                                <img src={`https://i.imgur.com/yC07yde.jpg`} alt={client.name} className="w-16 h-16 rounded-full border-2 border-white"/>
                                <p className="font-bold mt-4">{client.name}</p>
                                <p className="text-sm opacity-80">{client.company}</p>
                            </div>
                            <span className="text-5xl font-bold opacity-50">&ldquo;</span>
                        </div>
                        <div className="mt-4 text-yellow-300">★★★★★</div>
                        <p className="mt-4 italic">"{client.text}"</p>
                    </div>
                ))}
            </div>
        </div>
    </AnimatedSection>
);

const FreePilotCTA = () => (
    <div className="relative py-20 bg-gray-800 text-white text-center" style={{backgroundImage: `url('https://i.imgur.com/dDpg8xR.png')`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative container mx-auto px-4">
             <h2 className="text-4xl font-bold">Connect Us For Free Pilot</h2>
            <button className="mt-8 bg-yellow-400 text-gray-900 font-bold py-3 px-10 rounded-lg hover:bg-yellow-500 transition-colors text-lg">TEST US FREE</button>
        </div>
    </div>
);

const Footer = () => (
    <footer className="bg-blue-900 text-white">
        <div className="container mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
            <div>
                 <h3 className="text-2xl font-bold mb-4">
                    <span className="text-yellow-500">&#9733;</span> Nsleadprovider
                 </h3>
                 <p className="text-gray-300">We help businesses to build high quality hand curated contact list on their target criteria & outreach on them to generate qualified leads.</p>
            </div>
            <div>
                 <h4 className="font-bold text-lg mb-4">Important Link</h4>
                 <ul className="space-y-2 text-gray-300">
                    {['Home', 'Services', 'Portfolio', 'Testimonial'].map(link => <li key={link}><a href="#" className="hover:text-yellow-400">➔ {link}</a></li>)}
                </ul>
            </div>
            <div>
                 <h4 className="font-bold text-lg mb-4">Our Services</h4>
                 <ul className="space-y-2 text-gray-300">
                     {['Custom Contact List Building', 'Data Enrichment', 'Cold Email Outreach', 'Linkedin Campaign'].map(link => <li key={link}><a href="#" className="hover:text-yellow-400">➔ {link}</a></li>)}
                </ul>
            </div>
             <div>
                <h4 className="font-bold text-lg mb-4">Contact Us</h4>
                <ul className="space-y-2 text-gray-300">
                    <li>📞 +1 561-228-4003</li>
                    <li>📞 +8807776111677</li>
                    <li>📧 info@nsleadprovider.com</li>
                    <li>💬 nazmul_it</li>
                </ul>
            </div>
        </div>
        <div className="bg-blue-950 py-4 text-center text-gray-400">
            © 2024 All rights reserved by Nsleadprovider
        </div>
    </footer>
);


// --- MAIN APP COMPONENT ---

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);

    const servicesData = [
        { id: 1, title: 'Targeted Custom Contact List Building', description: 'Transform your outreach with our expertly curated, high-quality prospect contact lists.', img: 'https://i.imgur.com/uG9n9xP.png' },
        { id: 2, title: 'Data Entry & Web Research', description: 'Our Data Entry & Web Research service offers precise data finding & input.', img: 'https://i.imgur.com/8Q2fL7S.png' },
        { id: 3, title: 'CRM Data Appending & Enrichment', description: 'Supercharge your CRM with our specialized email and phone number enrichment services.', img: 'https://i.imgur.com/2p4Vd4s.png' },
        { id: 4, title: 'Verified Email Finding', description: 'Unlock verified email discovery with our specialized service.', img: 'https://i.imgur.com/L8G2kXb.png' },
        { id: 5, title: 'Phone Number Finding', description: 'Discover verified phone numbers with our dedicated service.', img: 'https://i.imgur.com/rN5tQ9y.png' },
        { id: 6, title: 'Hire Dedicated Research Team', description: 'Expand your reach with our dedicated research team focused on prospect contact data.', img: 'https://i.imgur.com/f0I2H9f.png' },
        { id: 7, title: 'God Level Email Validation', description: 'Ensure flawless email validation with our ‘God Level’ service by sending test email 1 by 1 from public server.', img: 'https://i.imgur.com/2i6oU5v.png' },
        { id: 8, title: 'Email Personalization', description: 'We specialize in writing captivating opening lines for personalized emails.', img: 'https://i.imgur.com/zW3B4X2.png' },
        { id: 9, title: 'Apollo Data Scrapping', description: 'Get hassle-free Apollo.io data export, reformatting, cleaning, and validation at an unbeatable price!', img: 'https://i.imgur.com/sS4d1sR.png' },
        { id: 10, title: 'Done-For-You Cold Email Outreach', description: 'Effortlessly execute cold email outreach with our ‘Done-For-You’ service.', img: 'https://i.imgur.com/V9g2L8o.png' },
        { id: 11, title: 'Done-For-You Linkedin Outreach', description: 'Transform your outreach with our ‘Done-For-You’ Linkedin outreach service.', img: 'https://i.imgur.com/c4h3M0d.png' }
    ];

    const handleLogin = (email, password) => {
        setUser({ email });
        setIsLoggedIn(true);
        setShowModal(false);
    };

    const handleLogout = () => {
        setUser(null);
        setIsLoggedIn(false);
        setCart([]);
    };

    const addToCart = (service) => {
        setCart(prevCart => [...prevCart, service]);
    };

    const removeFromCart = (serviceId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== serviceId));
    };

    const handleCheckout = () => {
        if (cart.length > 0) {
            const newOrder = {
                id: orders.length + 1,
                date: new Date().toISOString(),
                items: [...cart],
            };
            setOrders(prevOrders => [newOrder, ...prevOrders]);
            setCart([]);
            setShowCart(false);
            setShowCheckoutModal(true);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {showModal && <AuthModal setShowModal={setShowModal} handleLogin={handleLogin} />}
            {showCart && <CartModal cart={cart} removeFromCart={removeFromCart} setShowCart={setShowCart} handleCheckout={handleCheckout} />}
            {showCheckoutModal && <CheckoutModal setShowCheckoutModal={setShowCheckoutModal} />}

            <Header 
                setShowModal={setShowModal} 
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
                setShowCart={setShowCart}
                cartItemCount={cart.length}
            />

            <main>
                {isLoggedIn ? (
                    <Dashboard user={user} services={servicesData} cart={cart} addToCart={addToCart} orders={orders} />
                ) : (
                    <>
                        <Hero />
                        <Stats />
                        <CelebrityClients />
                        <WhoWeHelp />
                        <GlobalClients />
                        <WhatWeOffer services={servicesData} />
                        <OurWork />
                        <About />
                        <HappyClients />
                        <FreePilotCTA />
                    </>
                )}
            </main>
            {!isLoggedIn && <Footer />}
        </div>
    );
}

export default App;
