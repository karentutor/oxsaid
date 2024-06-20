import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Footer from "@/components/landing/Footer";
import Events from "@/components/landing/Events";
import Business from "@/components/landing/Business";
import Funding from "@/components/landing/Funding";
import ScrollToTop from "@/components/landing/ScrollToTop";
import Services from "@/components/landing/Services";
import { Groups } from "@/components/landing/Groups";

export default function Landing() {
  return (
    <main>
      <div className="lg:bg-[url('/imgs/blob.png')] bg-no-repeat bg-[140%_-100px] bg-contain">
        <Header />
        <Hero />
        <About />
      </div>
      <Services />
      <Events />
      {/* <Team /> */}
      <Groups />
      <Funding />
      <div className=" bg-[url('/imgs/blob.png')] bg-no-repeat bg-contain bg-right-top">
        <Business />
        <Footer />
      </div>
      <ScrollToTop />
    </main>
  );
}
