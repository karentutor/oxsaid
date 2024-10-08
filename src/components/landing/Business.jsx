import { Link } from "react-router-dom";
import { buttonVariants } from "../ui/button";

export default function Business() {
  return (
    <section className="px-6 w-full my-10 md:my-28" id="business">
      <div className="max-w-7xl mx-auto lg:h-[300px] rounded-2xl flex gap-10 border">
        {/* Content */}
        <div className="flex flex-col gap-4 flex-1 p-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Launch and Grow <span className="text-accent">Your Business</span>{" "}
            with Our Supportive Network
          </h2>
          <p className="leading-7 text-muted">
            Access funding opportunities, expert mentorship, and a community of
            like-minded entrepreneurs. Transform your ideas into successful
            ventures with our comprehensive resources.
          </p>
          <div className="flex items-center flex-wrap gap-4">
            <a
              href="#hero"
              className={`bg-primary rounded-full text-white py-2 px-8 w-fit`}
            >
              Get Started
            </a>
            <Link
              to="/signin"
              className={`hover:text-accent underline ${buttonVariants({
                variant: "link",
              })}`}
            >
              Join the Community
            </Link>
          </div>
        </div>
        {/* Image */}
        <div className="flex-1 relative hidden md:block">
          <img
            src="/imgs/banner.png"
            alt="banner idea"
            width={0}
            height={0}
            sizes="100vw"
            className="w-[90%] absolute bottom-0 object-contain"
          />
        </div>
      </div>
    </section>
  );
}
