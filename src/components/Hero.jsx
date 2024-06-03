import { Button, buttonVariants } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center grid-cols-1 py-10 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <h1 className="inline bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text lg:text-lg">
          Empower Your Future
        </h1>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          with Our Comprehensive Alumni Network
        </h1>

        <p className="md:text-xl lg:w-10/12 mx-auto lg:mx-0">
          Access Exclusive Business Funding, Job Opportunities, Social Groups,
          and Monthly Events to Stay Connected and Thrive
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Link to="/contact" className={`w-full md:w-1/3 ${buttonVariants()}`}>
            Contact Us
          </Link>

          <a
            href="#about"
            className={`w-full group hover:text-secondary md:w-1/3 ${buttonVariants(
              {
                variant: "outline",
              }
            )}`}
          >
            Know More
            <ArrowDown className="ml-2 w-5 h-5 text-accent group-hover:text-secondary" />
          </a>
        </div>
      </div>

      {/* Hero cards sections */}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Sign in</Button>
        </CardFooter>
      </Card>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
}
