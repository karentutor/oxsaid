import { navLinks, socialMediaLinks } from "@/data";
import { buttonVariants } from "../ui/button";

export default function Footer() {
  return (
    <footer className="bg-secondary/20">
      <div className="max-w-4xl mx-auto px-5 pt-10 pb-6 flex flex-col items-center justify-center text-center flex-wrap gap-7">
        <a href="#" className="font-bold text-2xl lg:text-3xl text-accent">
          OXSAID
        </a>
        {/* Social Media */}
        <div className="flex items-center flex-wrap gap-6">
          {socialMediaLinks.map((link) => (
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              key={link.id}
              className="rounded-full bg-accent"
            >
              <link.icon className="w-9 h-9 p-2 text-white" />
            </a>
          ))}
        </div>
        {/* desktop */}
        <nav className="flex flex-wrap justify-center gap-2">
          {navLinks.map((route, i) => (
            <a
              href={route.href}
              key={i}
              className={`${buttonVariants({
                variant: "link",
              })} hover:text-accent`}
            >
              {route.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="text-xs text-center py-2">
        &copy; {new Date().getFullYear()} All Right Reserved for OXSAID
      </p>
    </footer>
  );
}
