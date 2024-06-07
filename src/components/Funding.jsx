import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ChartIcon, WalletIcon } from "./icons";

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
            <Card>
              <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                <div className="mt-1 bg-secondary p-1 rounded-2xl">
                  <WalletIcon />
                </div>
                <div>
                  <CardTitle>Venture Capital</CardTitle>
                  <CardDescription className="text-md mt-2">
                    <span className="font-semibold text-accent">
                      Coming Soon
                    </span>{" "}
                    - Access significant investment to scale your business and
                    reach new heights.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                <div className="mt-1 bg-secondary p-1 rounded-2xl">
                  <ChartIcon />
                </div>
                <div>
                  <CardTitle>Grants and Scholarships</CardTitle>
                  <CardDescription className="text-md mt-2">
                    <span className="font-semibold text-accent">
                      Coming Soon
                    </span>{" "}
                    - Apply for grants and scholarships to support your business
                    without repayment obligations.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        <img
          src="/imgs/funding.jpg"
          className="w-full max-h-[450px] object-cover rounded-xl"
          alt="About services"
        />
      </div>
    </section>
  );
};
