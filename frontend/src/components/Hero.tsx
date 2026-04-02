const COLLAGE_IMAGES = [
  { src: 'https://loremflickr.com/320/320/smartphone?lock=1',   alt: 'Smartphone',  rotate: 'rotate-2'  },
  { src: 'https://loremflickr.com/320/320/smartwatch?lock=2',   alt: 'Smartwatch',  rotate: '-rotate-3' },
  { src: 'https://loremflickr.com/320/320/jacket?lock=3',       alt: 'Jacket',      rotate: 'rotate-1'  },
  { src: 'https://loremflickr.com/320/320/handbag?lock=4',      alt: 'Handbag',     rotate: '-rotate-2' },
  { src: 'https://loremflickr.com/320/320/headphones?lock=5',   alt: 'Headphones',  rotate: 'rotate-3'  },
  { src: 'https://loremflickr.com/320/320/sneakers?lock=6',     alt: 'Sneakers',    rotate: '-rotate-1' },
];

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-violet-100 to-purple-50 px-6 py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">

        {/* Left — headline + CTA */}
        <div className="flex-1 min-w-0">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            Discover <span className="text-violet-600">New Arrivals</span>
            <br />& Exclusive Deals
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-sm">
            Thousands of products at the best prices, updated daily.
          </p>
          <button className="mt-8 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            Shop Now
          </button>
        </div>

        {/* Right — collage */}
        <div className="hidden md:grid grid-cols-3 gap-3 flex-shrink-0 w-[420px]">
          {COLLAGE_IMAGES.map(({ src, alt, rotate }) => (
            <div
              key={alt}
              className={`${rotate} rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform`}
            >
              <img src={src} alt={alt} className="w-full h-32 object-cover" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
