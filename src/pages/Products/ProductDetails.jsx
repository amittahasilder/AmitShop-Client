import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  /* =========================================================
     FETCH PRODUCT
  ========================================================= */

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await api.get(`/products/${id}`);

        if (response.data.success) {
          setProduct(
            response.data.product ||
              response.data.data
          );
        } else {
          setErrorMessage(
            response.data.message ||
              "Product not found."
          );
        }
      } catch (error) {
        console.error(
          "Product Details Error:",
          error
        );

        setErrorMessage(
          error.response?.data?.message ||
            "Unable to load this product."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  /* =========================================================
     IMAGE
  ========================================================= */

  const getImages = () => {
    if (
      !product?.images ||
      product.images.length === 0
    ) {
      return [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=90",
      ];
    }

    return product.images.map((image) => {
      if (typeof image === "string") {
        return image;
      }

      return (
        image?.url ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=90"
      );
    });
  };

  /* =========================================================
     PRICE
  ========================================================= */

  const getFinalPrice = () => {
    if (
      product?.discountPrice !== undefined &&
      product?.discountPrice !== null &&
      Number(product.discountPrice) <
        Number(product.price)
    ) {
      return Number(product.discountPrice);
    }

    return Number(product?.price || 0);
  };

  /* =========================================================
     DISCOUNT
  ========================================================= */

  const getDiscount = () => {
    if (
      product?.price &&
      product?.discountPrice &&
      Number(product.discountPrice) <
        Number(product.price)
    ) {
      return Math.round(
        ((Number(product.price) -
          Number(product.discountPrice)) /
          Number(product.price)) *
          100
      );
    }

    return 0;
  };

  /* =========================================================
     QUANTITY
  ========================================================= */

  const increaseQuantity = () => {
    if (
      product?.stock &&
      quantity < Number(product.stock)
    ) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  /* =========================================================
     ADD TO CART
  ========================================================= */

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);

      await api.post("/cart", {
        productId: product._id,
        quantity,
      });

      navigate("/cart");
    } catch (error) {
      console.error(
        "Add To Cart Error:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Unable to add product to cart."
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  /* =========================================================
     BUY NOW
  ========================================================= */

  const handleBuyNow = async () => {
    try {
      setIsAddingToCart(true);

      await api.post("/cart", {
        productId: product._id,
        quantity,
      });

      navigate("/cart");
    } catch (error) {
      console.error(
        "Buy Now Error:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Unable to continue."
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#05020b] px-5 pb-24 pt-36 text-white">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="h-[550px] rounded-[32px] bg-white/[0.05]" />

            <div className="space-y-6 py-5">
              <div className="h-4 w-28 rounded-full bg-white/[0.08]" />
              <div className="h-12 w-3/4 rounded-full bg-white/[0.08]" />
              <div className="h-5 w-1/2 rounded-full bg-white/[0.08]" />
              <div className="h-12 w-40 rounded-full bg-white/[0.08]" />
              <div className="h-32 w-full rounded-3xl bg-white/[0.05]" />
              <div className="h-14 w-full rounded-2xl bg-white/[0.08]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (errorMessage || !product) {
    return (
      <main className="min-h-screen bg-[#05020b] px-5 pb-24 pt-36 text-white">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-white/[0.08] bg-white/[0.025] p-12 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-red-400/20 bg-red-500/10 text-3xl text-red-300">
            !
          </div>

          <h1 className="mt-6 text-3xl font-black">
            Product Not Found
          </h1>

          <p className="mt-3 text-sm text-white/40">
            {errorMessage ||
              "This product may no longer be available."}
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex rounded-full border border-violet-400/20 bg-violet-500/10 px-7 py-3 text-sm font-bold text-violet-300 transition-all duration-300 hover:bg-violet-500/20 hover:text-white"
          >
            ← Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const images = getImages();
  const finalPrice = getFinalPrice();
  const discount = getDiscount();
  const stock = Number(product.stock || 0);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05020b] px-4 pb-24 pt-32 text-white sm:px-6 lg:px-10">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute left-[15%] top-20 h-96 w-96 rounded-full bg-violet-700/10 blur-[140px]" />

      <div className="pointer-events-none absolute right-[10%] top-[45%] h-96 w-96 rounded-full bg-fuchsia-600/[0.06] blur-[150px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* =====================================================
            BREADCRUMB
        ====================================================== */}

        <div className="mb-8 flex flex-wrap items-center gap-2 text-xs text-white/30">
          <Link
            to="/"
            className="transition-colors hover:text-violet-300"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to="/products"
            className="transition-colors hover:text-violet-300"
          >
            Products
          </Link>

          <span>/</span>

          <span className="truncate text-white/55">
            {product.name}
          </span>
        </div>

        {/* =====================================================
            MAIN PRODUCT
        ====================================================== */}

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* ===================================================
              IMAGE GALLERY
          ==================================================== */}

          <div>
            <div className="relative overflow-hidden rounded-[34px] border border-white/[0.08] bg-white/[0.025] p-3 shadow-2xl shadow-black/30 backdrop-blur-2xl">
              {/* GLOW */}

              <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[100px]" />

              {/* DISCOUNT */}

              {discount > 0 && (
                <div className="absolute left-7 top-7 z-20 rounded-full border border-violet-300/20 bg-violet-600/90 px-4 py-2 text-xs font-black tracking-wider shadow-xl shadow-violet-950/30">
                  {discount}% OFF
                </div>
              )}

              {/* WISHLIST */}

              <button
                type="button"
                onClick={() =>
                  setIsWishlisted(
                    (prev) => !prev
                  )
                }
                className={`absolute right-7 top-7 z-20 flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-300 ${
                  isWishlisted
                    ? "border-pink-400/30 bg-pink-500/20 text-pink-400"
                    : "border-white/10 bg-black/30 text-white/60 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white"
                }`}
                aria-label="Toggle wishlist"
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill={
                    isWishlisted
                      ? "currentColor"
                      : "none"
                  }
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
                </svg>
              </button>

              {/* MAIN IMAGE */}

              <div className="relative flex h-[430px] items-center justify-center overflow-hidden rounded-[27px] bg-gradient-to-br from-white/[0.045] to-violet-950/20 sm:h-[550px]">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-all duration-700 hover:scale-105"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#080510] to-transparent" />
              </div>
            </div>

            {/* THUMBNAILS */}

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {images.map(
                  (image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() =>
                        setSelectedImage(
                          index
                        )
                      }
                      className={`relative h-20 overflow-hidden rounded-2xl border transition-all duration-300 sm:h-24 ${
                        selectedImage === index
                          ? "border-violet-400/50 ring-2 ring-violet-500/10"
                          : "border-white/[0.08] hover:border-white/20"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                      />

                      {selectedImage ===
                        index && (
                        <div className="absolute inset-0 bg-violet-500/10" />
                      )}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* ===================================================
              PRODUCT INFO
          ==================================================== */}

          <div className="flex flex-col justify-center">
            {/* CATEGORY */}

            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />

              {product.category ||
                "Premium Product"}
            </div>

            {/* TITLE */}

            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              {product.name}
            </h1>

            {/* BRAND */}

            {product.brand && (
              <p className="mt-3 text-sm font-semibold text-white/35">
                Brand:{" "}
                <span className="text-white/60">
                  {product.brand}
                </span>
              </p>
            )}

            {/* RATING */}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 text-yellow-400">
                {Array.from({
                  length: 5,
                }).map((_, index) => (
                  <span
                    key={index}
                    className="text-base"
                  >
                    ★
                  </span>
                ))}
              </div>

              <span className="text-sm font-bold text-white/65">
                {product.ratings || 0}
              </span>

              <span className="text-sm text-white/30">
                ({product.numReviews || 0}{" "}
                reviews)
              </span>
            </div>

            {/* PRICE */}

            <div className="mt-7 flex flex-wrap items-end gap-3">
              <span className="text-4xl font-black text-white">
                ${finalPrice.toFixed(2)}
              </span>

              {discount > 0 && (
                <>
                  <span className="pb-1 text-lg text-white/25 line-through">
                    $
                    {Number(
                      product.price || 0
                    ).toFixed(2)}
                  </span>

                  <span className="mb-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-300">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* DESCRIPTION */}

            <div className="mt-8 rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-xl">
              <p className="text-sm font-bold text-white/70">
                Product Description
              </p>

              <p className="mt-3 text-sm leading-7 text-white/40">
                {product.description ||
                  "Premium quality product from AmitShop."}
              </p>
            </div>

            {/* STOCK */}

            <div className="mt-6 flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                  stock > 0
                    ? "border-emerald-400/15 bg-emerald-500/10 text-emerald-300"
                    : "border-red-400/15 bg-red-500/10 text-red-300"
                }`}
              >
                {stock > 0 ? "✓" : "!"}
              </div>

              <div>
                <p
                  className={`text-sm font-black ${
                    stock > 0
                      ? "text-emerald-300"
                      : "text-red-300"
                  }`}
                >
                  {stock > 0
                    ? "In Stock"
                    : "Out of Stock"}
                </p>

                <p className="text-xs text-white/30">
                  {stock > 0
                    ? `${stock} items available`
                    : "Currently unavailable"}
                </p>
              </div>
            </div>

            {/* QUANTITY */}

            {stock > 0 && (
              <div className="mt-7">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-white/40">
                  Quantity
                </p>

                <div className="flex w-fit items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={quantity <= 1}
                    className="flex h-12 w-12 items-center justify-center text-lg text-white/50 transition-all hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    −
                  </button>

                  <div className="flex h-12 w-14 items-center justify-center border-x border-white/10 text-sm font-black">
                    {quantity}
                  </div>

                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      quantity >= stock
                    }
                    className="flex h-12 w-12 items-center justify-center text-lg text-white/50 transition-all hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* ACTIONS */}

            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={
                  stock <= 0 ||
                  isAddingToCart
                }
                onClick={handleAddToCart}
                className="group relative overflow-hidden rounded-2xl border border-violet-400/30 bg-violet-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-violet-950/30 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isAddingToCart
                    ? "Adding..."
                    : "🛒 Add to Cart"}

                  {!isAddingToCart && (
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </span>

                <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-0" />
              </button>

              <button
                type="button"
                disabled={
                  stock <= 0 ||
                  isAddingToCart
                }
                onClick={handleBuyNow}
                className="rounded-2xl border border-white/10 bg-white/[0.045] px-6 py-4 text-sm font-black text-white transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ⚡ Buy Now
              </button>
            </div>

            {/* TRUST */}

            <div className="mt-7 grid grid-cols-3 gap-3">
              {[
                {
                  icon: "✓",
                  title: "Secure",
                  text: "Checkout",
                },
                {
                  icon: "⚡",
                  title: "Fast",
                  text: "Delivery",
                },
                {
                  icon: "↻",
                  title: "Easy",
                  text: "Returns",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center"
                >
                  <div className="text-lg text-violet-300">
                    {item.icon}
                  </div>

                  <p className="mt-2 text-xs font-black text-white/70">
                    {item.title}
                  </p>

                  <p className="mt-1 text-[10px] text-white/25">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            PRODUCT DETAILS
        ====================================================== */}

        <section className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-400/70">
              Category
            </p>

            <p className="mt-3 text-lg font-black">
              {product.category ||
                "Not specified"}
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-400/70">
              Brand
            </p>

            <p className="mt-3 text-lg font-black">
              {product.brand ||
                "AmitShop"}
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-400/70">
              Availability
            </p>

            <p className="mt-3 text-lg font-black">
              {stock > 0
                ? "Available"
                : "Unavailable"}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;