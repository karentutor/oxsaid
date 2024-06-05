import { services } from "@/data";

export default function Services() {
  return (
    <section className="bg-accent/10" id="services">
      <div className="px-3 py-16">
        <div className="mx-auto mb-12 max-w-screen-xl w-full text-center">
          <div className="text-accent text-sm font-bold">Services</div>

          <div className="mt-1 text-3xl font-bold">Unlock Your Potential</div>

          <div className="mt-2 text-lg">
            Essential Resources for Career and Community Building
          </div>
        </div>

        <div className="mx-auto max-w-screen-xl">
          <div className="grid grid-cols-1 gap-x-3 gap-y-8 md:grid-cols-3">
            {services.map((service) => (
              <div
                className="rounded-xl border border-background bg-card p-5"
                key={service.id}
              >
                <div className="size-12 rounded-lg bg-accent p-1.5 shadow flex items-center justify-center">
                  <service.icon className="text-primary-foreground w-16" />
                </div>

                <div className="mt-2 text-lg font-bold">{service.title}</div>

                <div className="my-3 w-8 border-t border-accent" />

                <div className="mt-2 text-muted">{service.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
