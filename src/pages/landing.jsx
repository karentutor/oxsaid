import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import Events from "@/components/Events";
import { Team } from "@/components/Team";
import { Business } from "@/components/Business";
import { Funding } from "@/components/Funding";
import ScrollToTop from "@/components/ScrollToTop";

export default function Landing() {
  return (
    <main>
      <div className="bg-[url('/imgs/blob.png')] bg-no-repeat bg-[140%_-100px] bg-contain">
        <Header />
        <Hero />
        <About />
      </div>
      <Services />
      <Events />
      <Team />
      <Funding />
      <Business />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
