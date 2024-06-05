import { fundingServices } from "@/data";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export const Funding = () => {
  return (
    <section className="container py-16" id="funding">
      <div className="grid lg:grid-cols-[2fr_1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Secure the <span className="text-accent">Funding </span>
            You Need
          </h2>

          <p className="text-muted text-lg mt-4 mb-8">
            Explore a Range of Financial Resources to Fuel Your Business Growth
          </p>

          <div className="flex flex-col gap-8">
            {fundingServices.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-secondary p-1 rounded-2xl">
                    <Icon />
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <img
          src="/imgs/funding.jpg"
          className="w-full max-h-[550px] object-cover rounded-xl"
          alt="About services"
        />
      </div>
    </section>
  );
};
