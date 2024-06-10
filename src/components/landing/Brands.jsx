export default function Brands() {
  const data = [
    "/imgs/brand1.png",
    "/imgs/brand2.png",
    "/imgs/brand3.png",
    "/imgs/brand4.png",
    "/imgs/brand5.png",
    "/imgs/brand6.png",
  ];
  return (
    <section className="max-w-7xl mx-auto py-8 lg:py-16 px-4">
      <div className="flex justify-center flex-col items-center">
        <p className="text-3xl font-semibold mb-8 text-center">
          Trusted by 100+ Organization Worldwide
        </p>
        <div className="flex flex-wrap items-center w-full gap-14 justify-center lg:justify-between">
          {data.map((image, index) => (
            <img src={image} key={index} alt="brand" className="min-w-32" />
          ))}
        </div>
      </div>
    </section>
  );
}
