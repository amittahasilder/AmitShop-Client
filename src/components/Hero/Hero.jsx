import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[780px] overflow-hidden bg-[#05020b] pt-32 text-white">

      {/* ================= AMBIENT GLOW ================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-violet-700/15 blur-[140px]" />

        <div className="absolute right-[-120px] top-10 h-[500px] w-[500px] rounded-full bg-fuchsia-700/10 blur-[160px]" />

        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-600/10 blur-[130px]" />

        {/* Grid */}

        <div
          className="
            absolute inset-0 opacity-[0.035]
            [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)]
            [background-size:70px_70px]
          "
        />

      </div>

      {/* ================= CONTENT ================= */}

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        <div className="grid min-h-[650px] items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">

          {/* ================= LEFT ================= */}

          <div className="relative z-10">

            {/* Badge */}

            <div
              className="
                mb-6 inline-flex items-center gap-2
                rounded-full
                border border-violet-400/20
                bg-violet-500/[0.08]
                px-4 py-2
                text-xs font-semibold
                text-violet-300
                shadow-[0_0_30px_rgba(124,58,237,0.08)]
                backdrop-blur-xl
              "
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,1)]" />

              Next Generation Shopping

              <span className="text-fuchsia-400">✦</span>
            </div>

            {/* Heading */}

            <h1
              className="
                max-w-4xl
                text-5xl font-black
                leading-[0.98]
                tracking-[-0.04em]
                sm:text-6xl
                md:text-7xl
                lg:text-[76px]
              "
            >
              Shop Smarter.

              <br />

              <span
                className="
                  bg-gradient-to-r
                  from-violet-400
                  via-purple-400
                  to-fuchsia-400
                  bg-clip-text
                  text-transparent
                "
              >
                Live Better.
              </span>
            </h1>

            {/* Description */}

            <p className="mt-7 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
              Discover premium products, exclusive deals and
              everything you need — all in one beautiful shopping
              experience built for the modern world.
            </p>

            {/* CTA */}

            <div className="mt-9 flex flex-wrap gap-3">

              <Link
                to="/products"
                className="
                  group relative overflow-hidden
                  rounded-2xl
                  bg-gradient-to-r
                  from-violet-600
                  via-purple-600
                  to-fuchsia-600
                  px-7 py-4
                  text-sm font-bold text-white
                  shadow-[0_15px_45px_rgba(124,58,237,0.35)]
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_20px_55px_rgba(168,85,247,0.5)]
                "
              >
                <span className="relative z-10">
                  Explore Products
                  <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>

                <span
                  className="
                    absolute inset-0
                    -translate-x-full
                    bg-gradient-to-r
                    from-transparent
                    via-white/20
                    to-transparent
                    transition-transform duration-700
                    group-hover:translate-x-full
                  "
                />
              </Link>

              <Link
                to="/deals"
                className="
                  rounded-2xl
                  border border-white/10
                  bg-white/[0.035]
                  px-7 py-4
                  text-sm font-semibold
                  text-white/75
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-violet-400/30
                  hover:bg-violet-500/[0.08]
                  hover:text-white
                "
              >
                View Today's Deals
              </Link>

            </div>

            {/* ================= TRUST ================= */}

            <div className="mt-11 grid max-w-xl grid-cols-3 gap-3">

              {[
                ["50K+", "Happy Customers"],
                ["10K+", "Premium Products"],
                ["4.9/5", "Customer Rating"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="
                    rounded-2xl
                    border border-white/[0.07]
                    bg-white/[0.025]
                    px-4 py-4
                    backdrop-blur-xl
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-violet-400/20
                    hover:bg-violet-500/[0.05]
                  "
                >
                  <div className="text-lg font-black text-white">
                    {value}
                  </div>

                  <div className="mt-1 text-[10px] text-white/30">
                    {label}
                  </div>
                </div>
              ))}

            </div>

          </div>

          {/* ================= RIGHT PRODUCT VISUAL ================= */}

          <div className="relative hidden min-h-[560px] items-center justify-center lg:flex">

            {/* Main glow */}

            <div className="absolute h-[420px] w-[420px] rounded-full bg-violet-600/15 blur-[100px]" />

            {/* Orbit */}

            <div
              className="
                absolute h-[430px] w-[430px]
                animate-[spin_25s_linear_infinite]
                rounded-full
                border border-violet-400/10
                border-dashed
              "
            />

            <div
              className="
                absolute h-[330px] w-[330px]
                animate-[spin_18s_linear_infinite_reverse]
                rounded-full
                border border-fuchsia-400/10
                border-dashed
              "
            />

            {/* Product card */}

            <div
              className="
                relative z-10
                w-[360px]
                rounded-[32px]
                border border-violet-300/15
                bg-gradient-to-br
                from-[#1a0c32]/80
                via-[#0d0719]/90
                to-[#160820]/80
                p-6
                shadow-[0_30px_100px_rgba(76,29,149,0.35)]
                backdrop-blur-3xl
                transition-all duration-500
                hover:-translate-y-3
                hover:rotate-1
                hover:border-violet-300/30
                hover:shadow-[0_40px_120px_rgba(124,58,237,0.4)]
              "
            >

              {/* Top */}

              <div className="flex items-center justify-between">

                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-violet-300/50">
                    Featured Product
                  </div>

                  <div className="mt-1 text-sm font-bold text-white/90">
                    Premium Collection
                  </div>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                  ✦
                </div>

              </div>

              {/* Product image area */}

              <div
                className="
                  relative mt-5 flex h-[290px]
                  items-center justify-center
                  overflow-hidden
                  rounded-[26px]
                  border border-white/[0.06]
                  bg-gradient-to-br
                  from-violet-500/10
                  via-purple-500/[0.03]
                  to-fuchsia-500/10
                "
              >

                <div className="absolute h-52 w-52 rounded-full bg-violet-600/20 blur-[70px]" />

                {/* Product */}

                <div
                  className="
                    relative flex h-40 w-40
                    rotate-[-8deg]
                    items-center justify-center
                    rounded-[40px]
                    border border-white/15
                    bg-gradient-to-br
                    from-violet-500
                    via-purple-600
                    to-fuchsia-600
                    shadow-[0_25px_70px_rgba(124,58,237,0.45)]
                    transition-transform duration-500
                    hover:scale-110
                  "
                >

                  <div className="absolute inset-3 rounded-[32px] border border-white/10 bg-black/10" />

                  <div className="relative text-6xl font-black text-white/90">
                    A
                  </div>

                </div>

                {/* Floating badge */}

                <div
                  className="
                    absolute right-4 top-4
                    rounded-xl
                    border border-emerald-400/15
                    bg-emerald-500/10
                    px-3 py-2
                    backdrop-blur-xl
                  "
                >
                  <div className="text-[9px] font-bold text-emerald-300">
                    IN STOCK
                  </div>
                </div>

                {/* Floating discount */}

                <div
                  className="
                    absolute bottom-4 left-4
                    rounded-xl
                    border border-fuchsia-400/15
                    bg-fuchsia-500/10
                    px-3 py-2
                    backdrop-blur-xl
                  "
                >
                  <div className="text-[9px] font-bold text-fuchsia-300">
                    UP TO 40% OFF
                  </div>
                </div>

              </div>

              {/* Product info */}

              <div className="mt-5 flex items-end justify-between">

                <div>

                  <div className="text-base font-bold">
                    AmitShop Exclusive
                  </div>

                  <div className="mt-1 text-xs text-white/35">
                    Premium lifestyle collection
                  </div>

                </div>

                <div className="text-right">

                  <div className="text-lg font-black text-white">
                    $129
                  </div>

                  <div className="text-[10px] text-white/25 line-through">
                    $199
                  </div>

                </div>

              </div>

            </div>

            {/* Floating glass card */}

            <div
              className="
                absolute -left-2 top-24
                rounded-2xl
                border border-white/10
                bg-[#11091d]/80
                px-4 py-3
                shadow-[0_20px_50px_rgba(0,0,0,0.4)]
                backdrop-blur-2xl
                transition-all duration-500
                hover:-translate-y-2
              "
            >
              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                  ✓
                </div>

                <div>
                  <div className="text-[11px] font-bold text-white/80">
                    Secure Shopping
                  </div>

                  <div className="text-[9px] text-white/30">
                    100% protected
                  </div>
                </div>

              </div>
            </div>

            {/* Rating card */}

            <div
              className="
                absolute -right-2 bottom-24
                rounded-2xl
                border border-white/10
                bg-[#11091d]/80
                px-4 py-3
                shadow-[0_20px_50px_rgba(0,0,0,0.4)]
                backdrop-blur-2xl
              "
            >
              <div className="flex items-center gap-3">

                <div className="text-xl">
                  ⭐
                </div>

                <div>
                  <div className="text-[11px] font-bold text-white/80">
                    4.9 Rating
                  </div>

                  <div className="text-[9px] text-white/30">
                    From 8,000+ reviews
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom fade */}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#05020b] to-transparent" />

    </section>
  );
};

export default Hero;