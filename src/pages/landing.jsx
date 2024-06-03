import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Brands from "@/components/Brands";
import Services from "@/components/Services";

export default function Landing() {
  return (
    <main>
      <div className="bg-[url('/imgs/blob-shape.png')] bg-no-repeat bg-right-top bg-contain">
        <Header />
        <Hero />
      </div>
      <Brands />
      <About />
      <Services />
    </main>
  );
}
