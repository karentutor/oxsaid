const stats = [
  {
    quantity: "2.7K+",
    description: "Users",
  },
  {
    quantity: "1.8K+",
    description: "Jobs",
  },
  {
    quantity: "112",
    description: "Events",
  },
  {
    quantity: "4",
    description: "Funds",
  },
];

export default function About() {
  return (
    <section id="about" className="container py-16">
      <div className="bg-primary/10 border rounded-xl p-5 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 md:gap-12">
          <img
            src="/imgs/about.jpg"
            alt="about"
            className="w-full object-cover rounded-lg"
          />
          <div className="flex flex-col justify-between gap-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              About <span className="text-accent">Oxsaid </span>
            </h2>
            <p className="text-xl text-muted">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit.
            </p>

            <section id="statistics">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map(({ quantity, description }) => (
                  <div key={description} className="space-y-2 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold ">
                      {quantity}
                    </h2>
                    <p className="text-xl text-accent">{description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
