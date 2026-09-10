import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-violet-500/10 bg-[#05020b] text-white">

      {/* =====================================================
          AMBIENT BACKGROUND GLOW
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-700/10 blur-[120px]" />

        <div className="absolute right-[-100px] top-10 h-80 w-80 rounded-full bg-fuchsia-700/10 blur-[130px]" />

        <div className="absolute bottom-0 left-1/2 h-56 w-96 -translate-x-1/2 rounded-full bg-purple-700/10 blur-[120px]" />
      </div>

      {/* =====================================================
          TOP BRAND SECTION
      ====================================================== */}

      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-6 lg:px-8">

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">

          {/* BRAND */}

          <div>

            <Link
              to="/"
              className="group inline-flex items-center gap-3"
            >

              <div
                className="
                  relative flex h-12 w-12 items-center justify-center
                  overflow-hidden rounded-2xl
                  border border-violet-300/20
                  bg-gradient-to-br
                  from-violet-500
                  via-purple-600
                  to-fuchsia-600
                  shadow-[0_10px_35px_rgba(124,58,237,0.35)]
                  transition-all duration-500
                  group-hover:scale-110
                  group-hover:-rotate-6
                  group-hover:shadow-[0_15px_45px_rgba(217,70,239,0.5)]
                "
              >

                <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/20" />

                <span className="relative text-xl font-black">
                  A
                </span>

              </div>

              <div>
                <div className="text-2xl font-black tracking-tight">
                  Amit
                  <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Shop
                  </span>
                </div>

                <div className="mt-1 text-[8px] font-bold uppercase tracking-[0.3em] text-violet-300/40">
                  Shop Smart • Live Better
                </div>
              </div>

            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/40">
              Discover premium products, unbeatable deals and
              a powerful shopping experience designed for the
              modern lifestyle.
            </p>

            {/* SOCIAL */}

            <div className="mt-6 flex gap-2">

              {["𝕏", "f", "in", "◎"].map((icon, index) => (
                <button
                  key={index}
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-xl
                    border border-white/10
                    bg-white/[0.03]
                    text-sm font-bold text-white/50
                    backdrop-blur-xl
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-violet-400/30
                    hover:bg-violet-500/10
                    hover:text-violet-300
                    hover:shadow-[0_8px_25px_rgba(124,58,237,0.2)]
                  "
                >
                  {icon}
                </button>
              ))}

            </div>

          </div>

          {/* QUICK LINKS */}

          <div>
            <h3 className="mb-5 text-sm font-bold text-white">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3">

              {[
                ["Home", "/"],
                ["Products", "/products"],
                ["Deals", "/deals"],
                ["Categories", "/categories"],
              ].map(([name, path]) => (
                <Link
                  key={path}
                  to={path}
                  className="
                    group flex items-center gap-2
                    text-sm text-white/40
                    transition-all duration-300
                    hover:translate-x-1
                    hover:text-violet-300
                  "
                >
                  <span className="h-px w-0 bg-violet-400 transition-all duration-300 group-hover:w-3" />
                  {name}
                </Link>
              ))}

            </div>
          </div>

          {/* COMPANY */}

          <div>
            <h3 className="mb-5 text-sm font-bold text-white">
              Company
            </h3>

            <div className="flex flex-col gap-3">

              {[
                ["About Us", "/about"],
                ["Contact", "/contact"],
                ["Wishlist", "/wishlist"],
                ["Shopping Cart", "/cart"],
              ].map(([name, path]) => (
                <Link
                  key={path}
                  to={path}
                  className="
                    group flex items-center gap-2
                    text-sm text-white/40
                    transition-all duration-300
                    hover:translate-x-1
                    hover:text-fuchsia-300
                  "
                >
                  <span className="h-px w-0 bg-fuchsia-400 transition-all duration-300 group-hover:w-3" />
                  {name}
                </Link>
              ))}

            </div>
          </div>

          {/* NEWSLETTER */}

          <div>

            <h3 className="mb-5 text-sm font-bold text-white">
              Stay Updated
            </h3>

            <p className="mb-4 text-sm leading-6 text-white/40">
              Get exclusive deals, new arrivals and special
              offers directly in your inbox.
            </p>

            <div
              className="
                rounded-2xl
                border border-violet-400/15
                bg-white/[0.025]
                p-2
                shadow-[inset_0_0_30px_rgba(139,92,246,0.03)]
                backdrop-blur-xl
              "
            >

              <div className="flex gap-2">

                <input
                  type="email"
                  placeholder="Your email"
                  className="
                    min-w-0 flex-1
                    bg-transparent
                    px-3
                    py-2.5
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-white/25
                  "
                />

                <button
                  className="
                    rounded-xl
                    bg-gradient-to-r
                    from-violet-600
                    via-purple-600
                    to-fuchsia-600
                    px-4
                    py-2.5
                    text-xs
                    font-bold
                    text-white
                    shadow-[0_8px_25px_rgba(124,58,237,0.3)]
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:shadow-[0_12px_35px_rgba(168,85,247,0.45)]
                  "
                >
                  Join
                </button>

              </div>

            </div>

            <div className="mt-4 flex items-center gap-2 text-[10px] text-white/25">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              No spam. Unsubscribe anytime.
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          TRUST BAR
      ====================================================== */}

      <div className="relative border-y border-white/[0.06] bg-white/[0.015]">

        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/[0.06] px-5 sm:grid-cols-4 lg:px-8">

          {[
            ["⚡", "Fast Delivery", "Quick & reliable"],
            ["🔒", "Secure Payment", "100% protected"],
            ["↩", "Easy Returns", "Hassle-free"],
            ["✦", "Premium Quality", "Built for you"],
          ].map(([icon, title, subtitle]) => (
            <div
              key={title}
              className="
                group flex items-center gap-3
                px-3 py-5
                transition-all duration-300
                hover:bg-violet-500/[0.03]
              "
            >

              <div className="text-xl transition-transform duration-300 group-hover:scale-110">
                {icon}
              </div>

              <div>
                <div className="text-xs font-bold text-white/75">
                  {title}
                </div>

                <div className="mt-0.5 text-[10px] text-white/30">
                  {subtitle}
                </div>
              </div>

            </div>
          ))}

        </div>

      </div>

      {/* =====================================================
          BOTTOM
      ====================================================== */}

      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

        <p className="text-xs text-white/25">
          © 2026 AmitShop. All rights reserved.
        </p>

        <div className="flex flex-wrap gap-5 text-xs text-white/25">

          <button className="transition hover:text-violet-300">
            Privacy Policy
          </button>

          <button className="transition hover:text-violet-300">
            Terms & Conditions
          </button>

          <button className="transition hover:text-violet-300">
            Cookie Policy
          </button>

        </div>

      </div>

    </footer>
  );
};

export default Footer;