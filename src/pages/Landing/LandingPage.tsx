import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Hero from '../../components/sections/landing/Hero';
import HowItWorks from '../../components/sections/landing/HowItWorks';
import Benefits from '../../components/sections/landing/Benefits';
import Testimonials from '../../components/sections/landing/Testimonials';
import PricingPreview from '../../components/sections/landing/PricingPreview';
import Faq from '../../components/sections/landing/Faq';

const LandingPage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Benefits />
        <Testimonials />
        <PricingPreview />
        <Faq />
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;