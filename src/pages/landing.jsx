import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Footer from "@/components/landing/Footer";
import Business from "@/components/landing/Business";
import ScrollToTop from "@/components/landing/ScrollToTop";
import Services from "@/components/landing/Services";
import { Groups } from "@/components/landing/Groups";
import { Suspense } from "react";
import Loader from "@/components/Loader";

export default function Landing() {
  return (
    <Suspense fallback={<Loader />}>
      <main>
        <div className="lg:bg-[url('/imgs/blob.png')] bg-no-repeat bg-[140%_-100px] bg-contain">
          <Header />
          <Hero />
          <About />
        </div>
        <Services />
        {/* <Events /> */}
        {/* <Team /> */}
        <Groups />
        {/* <Funding /> */}
        <div className="bg-none lg:bg-[url('/imgs/blob.png')] bg-no-repeat bg-contain bg-right-top">
          <Business />
          <Footer />
        </div>
        <ScrollToTop />
      </main>
    </Suspense>
  );
}
