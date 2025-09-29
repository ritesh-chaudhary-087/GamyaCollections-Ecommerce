import CountUp from "./CountUp/CountUp";

export default function AboutSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Image Column */}
        <div className="lg:col-span-5 relative">
          <div className="relative">
            <img
              src="/assets/Images/about/full1.png"
              alt="Elegant jewelry model"
              className="w-full rounded-t-full h-auto"
            />

            {/* Curved text overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full relative">
                {/* <span
                  className="absolute inset-0 flex items-center justify-center text-white text-lg font-light"
                  style={{
                    transform: "rotate(-30deg) translateY(-140px)",
                  }}
                >
                  A Touch Of Glamour, A Lifetime Of Memorie
                </span> */}
              </div>
            </div>
          </div>
        </div>

        {/* Content Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <span className="text-sm tracking-wider">ABOUT US</span>
            <h2 className="text-4xl font-medium">
            Timeless Beauty for Every Occasion
            </h2>
            <p className="text-neutral-600 leading-relaxed">
            Jewelry is more than just an accessory—it’s a reflection of cherished memories and meaningful moments. At Gamya Collections, we bring you an exquisite selection of handpicked pieces that add grace and elegance to every occasion. Whether it’s a special celebration, a thoughtful gift, or simply a way to treat yourself, our collection ensures you shine beautifully in every chapter of life.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="flex flex-wrap gap-4">
            {[
              { number: 300, label: "Unique Designs", suffix: "+" },
              { number: 2000, label: "User Reviews", suffix: "" },
            ].map((stat, index) => (
              <div key={index} className="bg-amber-50/50 p-4 text-center flex gap-2 items-center">
                <div className="text-2xl font-bold flex items-center justify-center">
                  <CountUp
                    from={0}
                    to={stat.number}
                    separator=","
                    direction="up"
                    duration={1}
                    className="count-up-text"
                  />
                  {stat.suffix}
                </div>
                <div className="text-sm text-neutral-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* <p className="text-neutral-500 italic">
            "Maecenas Porta Id Nibh Quis Imperdiet. Quisque Hendrerit, Justo
            Egestas Fermentum Pulvinar"
          </p> */}

          {/* <button className="bg-[#A63C15] hover:bg-[#4e341b] text-white px-8 py-3 flex items-center gap-2 font-bold rounded-sm">
            Shop Now
            <span>→</span>
          </button> */}
        </div>

        {/* Right Image Column */}
        <div className="lg:col-span-2">
          <img
            src="/assets/Images/about/full2.png"
            alt="Layered necklaces"
            className="w-auto h-auto  object-cover object-bottom scale-250"
          />
        </div>
      </div>
    </div>
  );
}
