import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center">
        {/* Left Content */}
        <div className="flex-1">
          <p className="text-sm uppercase tracking-widest text-gray-500">
            New Collection 2026
          </p>

          <h1 className="text-5xl lg:text-7xl font-bold mt-4 leading-tight">
            Wear Your <br />
            Confidence.
          </h1>

          <p className="text-gray-600 mt-6 max-w-md">
            Discover premium fashion for Men, Women, Footwear and Accessories.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/products"
              className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Shop Now
            </Link>

            <Link
              to="/products"
              className="border border-black px-8 py-3 rounded-lg hover:bg-black hover:text-white transition"
            >
              Explore
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 mt-12 lg:mt-0 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700"
            alt="Fashion"
            className="rounded-2xl shadow-xl w-[500px] object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
