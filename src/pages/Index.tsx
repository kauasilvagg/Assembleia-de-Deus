
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import WelcomeSection from '@/components/WelcomeSection';
import EventsPreview from '@/components/EventsPreview';
import MinistriesPreview from '@/components/MinistriesPreview';

const Index = () => {
  return (
    <div className="min-h-screen font-inter">
      <Header />
      <main>
        <Hero />
        <WelcomeSection />
        <EventsPreview />
        <MinistriesPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
