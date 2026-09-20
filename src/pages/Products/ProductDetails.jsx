
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    user,
    accessToken,
    isAuthenticated,
  } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  /* =========================================================
     WISHLIST
  ========================================================= */

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] =
    useState(false);

  /* =========================================================
     CART
  ========================================================= */

  const [isAddingToCart, setIsAddingToCart] =
    useState(false);

  /* =========================================================
     REVIEWS
  ========================================================= */

  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [ratingAverage, setRatingAverage] = useState(0);

  const [isLoadingReviews, setIsLoadingReviews] =
    useState(true);

  const [reviewError, setReviewError] = useState("");

  const [myReview, setMyReview] = useState(null);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const [isSubmittingReview, setIsSubmittingReview] =
    useState(false);

  const [editingReviewId, setEditingReviewId] =
    useState(null);

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
     FETCH REVIEWS
  ========================================================= */

  const fetchReviews = async () => {
    if (!id) return;

    try {
      setIsLoadingReviews(true);
      setReviewError("");

      const response = await api.get(
        `/reviews/product/${id}`
      );

      if (response.data.success) {
        setReviews(response.data.reviews || []);

        setReviewCount(
          response.data.totalReviews || 0
        );

        setRatingAverage(
          Number(response.data.ratingAverage || 0)
        );
      } else {
        setReviewError(
          response.data.message ||
            "Unable to load reviews."
        );
      }
    } catch (error) {
      console.error(
        "Fetch Reviews Error:",
        error
      );

      setReviewError(
        error.response?.data?.message ||
          "Unable to load reviews."
      );
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  /* =========================================================
     FETCH MY REVIEW
  ========================================================= */

  useEffect(() => {
    const fetchMyReview = async () => {
      if (!id || !isAuthenticated || !accessToken) {
        setMyReview(null);
        setReviewRating(5);
        setReviewComment("");
        return;
      }

      try {
        const response = await api.get(
          `/reviews/my/${id}`
        );

        if (response.data.success) {
          const review =
            response.data.review || null;

          setMyReview(review);

          if (review) {
            setReviewRating(review.rating);
            setReviewComment(review.comment);
          } else {
            setReviewRating(5);
            setReviewComment("");
          }
        }
      } catch (error) {
        console.log(
          "My Review Check:",
          error.response?.data?.message ||
            error.message
        );

        setMyReview(null);
        setReviewRating(5);
        setReviewComment("");
      }
    };

    fetchMyReview();
  }, [id, isAuthenticated, accessToken]);

  /* =========================================================
     CHECK WISHLIST STATUS
  ========================================================= */

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const response = await api.get("/wishlist");

        if (!response.data.success) {
          setIsWishlisted(false);
          return;
        }

        const wishlistItems =
          response.data.wishlist?.items ||
          response.data.data?.items ||
          response.data.items ||
          [];

        if (!Array.isArray(wishlistItems)) {
          setIsWishlisted(false);
          return;
        }

        const alreadyWishlisted =
          wishlistItems.some((item) => {
            const wishlistProduct =
              item?.product || item;

            const productId =
              wishlistProduct?._id ||
              wishlistProduct?.id;

            return String(productId) === String(id);
          });

        setIsWishlisted(alreadyWishlisted);
      } catch (error) {
        console.log(
          "Wishlist Status Check:",
          error.response?.data?.message ||
            error.message
        );

        setIsWishlisted(false);
      }
    };

    if (id && isAuthenticated && accessToken) {
      checkWishlistStatus();
    } else {
      setIsWishlisted(false);
    }
  }, [id, isAuthenticated, accessToken]);

  /* =========================================================
     SYNC WISHLIST CHANGES
  ========================================================= */

  useEffect(() => {
    const handleWishlistUpdated = async () => {
      if (!id || !isAuthenticated || !accessToken) {
        setIsWishlisted(false);
        return;
      }

      try {
        const response = await api.get("/wishlist");

        if (!response.data.success) {
          setIsWishlisted(false);
          return;
        }

        const wishlistItems =
          response.data.wishlist?.items ||
          response.data.data?.items ||
          response.data.items ||
          [];

        if (!Array.isArray(wishlistItems)) {
          setIsWishlisted(false);
          return;
        }

        const alreadyWishlisted =
          wishlistItems.some((item) => {
            const wishlistProduct =
              item?.product || item;

            const productId =
              wishlistProduct?._id ||
              wishlistProduct?.id;

            return String(productId) === String(id);
          });

        setIsWishlisted(alreadyWishlisted);
      } catch (error) {
        console.log(
          "Wishlist Sync Error:",
          error.response?.data?.message ||
            error.message
        );
      }
    };

    window.addEventListener(
      "amitshop:wishlist-updated",
      handleWishlistUpdated
    );

    return () => {
      window.removeEventListener(
        "amitshop:wishlist-updated",
        handleWishlistUpdated
      );
    };
  }, [id, isAuthenticated, accessToken]);

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
     ADD / REMOVE WISHLIST
  ========================================================= */

  const handleWishlistToggle = async () => {
    if (!isAuthenticated || !accessToken) {
      navigate("/login");
      return;
    }

    try {
      setIsAddingToWishlist(true);

      if (!isWishlisted) {
        const response = await api.post("/wishlist", {
          productId: product._id,
        });

        if (response.data.success) {
          setIsWishlisted(true);

          window.dispatchEvent(
            new Event("amitshop:wishlist-updated")
          );
        }
      } else {
        const response = await api.delete(
          `/wishlist/${product._id}`
        );

        if (response.data.success) {
          setIsWishlisted(false);

          window.dispatchEvent(
            new Event("amitshop:wishlist-updated")
          );
        }
      }
    } catch (error) {
      console.error(
        "Wishlist Toggle Error:",
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
          "Unable to update wishlist."
      );
    } finally {
      setIsAddingToWishlist(false);
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

      window.dispatchEvent(
        new Event("amitshop:cart-updated")
      );

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

      window.dispatchEvent(
        new Event("amitshop:cart-updated")
      );

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
     REVIEW SUBMIT / UPDATE
  ========================================================= */

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated || !accessToken) {
      navigate("/login");
      return;
    }

    if (!reviewComment.trim()) {
      alert("Please write a review.");
      return;
    }

    if (reviewComment.trim().length < 3) {
      alert(
        "Review must be at least 3 characters."
      );
      return;
    }

    try {
      setIsSubmittingReview(true);

      let response;

      if (editingReviewId) {
        response = await api.put(
          `/reviews/${editingReviewId}`,
          {
            rating: reviewRating,
            comment: reviewComment.trim(),
          }
        );
      } else {
        response = await api.post(
          "/reviews",
          {
            productId: id,
            rating: reviewRating,
            comment: reviewComment.trim(),
          }
        );
      }

      if (response.data.success) {
        alert(
          editingReviewId
            ? "Review updated successfully."
            : "Review added successfully."
        );

        setReviewComment("");
        setReviewRating(5);
        setEditingReviewId(null);

        await fetchReviews();

        const myReviewResponse =
          await api.get(`/reviews/my/${id}`);

        if (myReviewResponse.data.success) {
          const review =
            myReviewResponse.data.review || null;

          setMyReview(review);

          if (review) {
            setReviewRating(review.rating);
            setReviewComment(review.comment);
          }
        }
      } else {
        alert(
          response.data.message ||
            "Unable to save review."
        );
      }
    } catch (error) {
      console.error(
        "Review Submit Error:",
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
          "Unable to save review."
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  /* =========================================================
     EDIT REVIEW
  ========================================================= */

  const handleEditReview = (review) => {
    setEditingReviewId(review._id);
    setReviewRating(review.rating);
    setReviewComment(review.comment);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  /* =========================================================
     DELETE REVIEW
  ========================================================= */

  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your review?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await api.delete(
        `/reviews/${reviewId}`
      );

      if (response.data.success) {
        alert("Review deleted successfully.");

        setMyReview(null);
        setReviewComment("");
        setReviewRating(5);
        setEditingReviewId(null);

        await fetchReviews();
      }
    } catch (error) {
      console.error(
        "Delete Review Error:",
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
          "Unable to delete review."
      );
    }
  };

  /* =========================================================
     STAR RENDER
  ========================================================= */

  const renderStars = (
    rating,
    size = "text-sm"
  ) => {
    return (
      <div className={`flex ${size}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= Number(rating)
                ? "text-yellow-400"
                : "text-white/15"
            }
          >
            ★
          </span>
        ))}
      </div>
    );
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
          {/* IMAGE GALLERY */}

          <div>
            <div className="relative overflow-hidden rounded-[34px] border border-white/[0.08] bg-white/[0.025] p-3 shadow-2xl shadow-black/30 backdrop-blur-2xl">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[100px]" />

              {discount > 0 && (
                <div className="absolute left-7 top-7 z-20 rounded-full border border-violet-300/20 bg-violet-600/90 px-4 py-2 text-xs font-black tracking-wider shadow-xl shadow-violet-950/30">
                  {discount}% OFF
                </div>
              )}

              <button
                type="button"
                onClick={handleWishlistToggle}
                disabled={isAddingToWishlist}
                className={`absolute right-7 top-7 z-20 flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-300 ${
                  isWishlisted
                    ? "border-pink-400/30 bg-pink-500/20 text-pink-400"
                    : "border-white/10 bg-black/30 text-white/60 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white"
                } ${
                  isAddingToWishlist
                    ? "cursor-wait opacity-70"
                    : ""
                }`}
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

              <div className="relative flex h-[430px] items-center justify-center overflow-hidden rounded-[27px] bg-gradient-to-br from-white/[0.045] to-violet-950/20 sm:h-[550px]">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-all duration-700 hover:scale-105"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#080510] to-transparent" />
              </div>
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setSelectedImage(index)
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

                    {selectedImage === index && (
                      <div className="absolute inset-0 bg-violet-500/10" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}

          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />

              {product.category ||
                "Premium Product"}
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              {product.name}
            </h1>

            {product.brand && (
              <p className="mt-3 text-sm font-semibold text-white/35">
                Brand:{" "}
                <span className="text-white/60">
                  {product.brand}
                </span>
              </p>
            )}

            {/* REAL RATING */}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {renderStars(
                ratingAverage,
                "text-base"
              )}

              <span className="text-sm font-bold text-white/65">
                {ratingAverage.toFixed(1)}
              </span>

              <span className="text-sm text-white/30">
                ({reviewCount}{" "}
                {reviewCount === 1
                  ? "review"
                  : "reviews"})
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
                    onClick={decreaseQuantity}
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
                    onClick={increaseQuantity}
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

        {/* =====================================================
            REVIEWS & RATINGS
        ====================================================== */}

        <section className="mt-16">
          {/* HEADER */}

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-400">
                Customer Feedback
              </p>

              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Reviews & Ratings
              </h2>

              <p className="mt-2 text-sm text-white/35">
                See what customers are saying about this product.
              </p>
            </div>

            {/* RATING SUMMARY */}

            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] px-6 py-5 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-black text-white">
                  {ratingAverage.toFixed(1)}
                </div>

                <div>
                  {renderStars(
                    ratingAverage,
                    "text-lg"
                  )}

                  <p className="mt-1 text-xs text-white/30">
                    {reviewCount} total{" "}
                    {reviewCount === 1
                      ? "review"
                      : "reviews"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* REVIEW FORM */}

          <div className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-black">
                    Want to share your experience?
                  </p>

                  <p className="mt-1 text-sm text-white/35">
                    Login to write a review for this product.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="rounded-2xl border border-violet-400/25 bg-violet-600 px-6 py-3 text-sm font-black text-white transition-all duration-300 hover:-translate-y-1 hover:bg-violet-500"
                >
                  Login to Review
                </button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <div className="flex flex-col gap-6">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-black">
                          {editingReviewId
                            ? "Edit Your Review"
                            : myReview
                            ? "Your Review"
                            : "Write a Review"}
                        </p>

                        <p className="mt-1 text-xs text-white/30">
                          {user?.name
                            ? `Posting as ${user.name}`
                            : "Share your experience"}
                        </p>
                      </div>

                      {myReview &&
                        !editingReviewId && (
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                            You reviewed this product
                          </span>
                        )}
                    </div>
                  </div>

                  {/* STAR SELECTOR */}

                  <div>
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.15em] text-white/40">
                      Your Rating
                    </p>

                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(
                        (star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setReviewRating(star)
                            }
                            className={`text-3xl transition-all duration-200 hover:scale-110 ${
                              star <=
                              reviewRating
                                ? "text-yellow-400"
                                : "text-white/15"
                            }`}
                            aria-label={`${star} star`}
                          >
                            ★
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* COMMENT */}

                  <div>
                    <label
                      htmlFor="reviewComment"
                      className="mb-3 block text-xs font-black uppercase tracking-[0.15em] text-white/40"
                    >
                      Your Review
                    </label>

                    <textarea
                      id="reviewComment"
                      value={reviewComment}
                      onChange={(event) =>
                        setReviewComment(
                          event.target.value
                        )
                      }
                      rows={5}
                      maxLength={1000}
                      placeholder="Tell other customers about your experience..."
                      className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/40 focus:bg-white/[0.03]"
                    />

                    <div className="mt-2 flex justify-end text-[11px] text-white/25">
                      {reviewComment.length}/1000
                    </div>
                  </div>

                  {/* BUTTONS */}

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={
                        isSubmittingReview
                      }
                      className="rounded-2xl border border-violet-400/25 bg-violet-600 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-violet-950/20 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-500 disabled:cursor-wait disabled:opacity-50"
                    >
                      {isSubmittingReview
                        ? "Saving..."
                        : editingReviewId
                        ? "Update Review"
                        : myReview
                        ? "Update Review"
                        : "Submit Review"}
                    </button>

                    {editingReviewId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingReviewId(null);

                          if (myReview) {
                            setReviewRating(
                              myReview.rating
                            );
                            setReviewComment(
                              myReview.comment
                            );
                          } else {
                            setReviewRating(5);
                            setReviewComment("");
                          }
                        }}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-3.5 text-sm font-black text-white/70 transition-all hover:bg-white/[0.07] hover:text-white"
                      >
                        Cancel
                      </button>
                    )}

                    {myReview &&
                      !editingReviewId && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteReview(
                              myReview._id
                            )
                          }
                          className="rounded-2xl border border-red-400/20 bg-red-500/10 px-7 py-3.5 text-sm font-black text-red-300 transition-all hover:bg-red-500/20"
                        >
                          Delete Review
                        </button>
                      )}
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* REVIEW ERROR */}

          {reviewError && (
            <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-300">
              {reviewError}
            </div>
          )}

          {/* REVIEW LIST */}

          <div className="mt-8">
            {isLoadingReviews ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-40 animate-pulse rounded-3xl border border-white/[0.06] bg-white/[0.025]"
                  />
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="rounded-[30px] border border-white/[0.07] bg-white/[0.025] p-10 text-center backdrop-blur-xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-2xl">
                  ★
                </div>

                <h3 className="mt-5 text-xl font-black">
                  No Reviews Yet
                </h3>

                <p className="mt-2 text-sm text-white/30">
                  Be the first customer to review this product.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => {
                  const reviewUser =
                    review.user || {};

                  const isOwnReview =
                    myReview?._id === review._id;

                  return (
                    <article
                      key={review._id}
                      className="rounded-[30px] border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-400/15"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-sm font-black text-violet-300">
                            {(
                              reviewUser.name ||
                              "U"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <p className="font-black text-white">
                                {reviewUser.name ||
                                  "Anonymous Customer"}
                              </p>

                              {isOwnReview && (
                                <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-black text-violet-300">
                                  Your Review
                                </span>
                              )}
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-3">
                              {renderStars(
                                review.rating
                              )}

                              <span className="text-xs font-bold text-white/40">
                                {review.rating}/5
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-white/25">
                          {review.createdAt
                            ? new Date(
                                review.createdAt
                              ).toLocaleDateString()
                            : ""}
                        </div>
                      </div>

                      <p className="mt-5 text-sm leading-7 text-white/45">
                        {review.comment}
                      </p>

                      {isOwnReview && (
                        <div className="mt-5 flex gap-3 border-t border-white/[0.06] pt-4">
                          <button
                            type="button"
                            onClick={() =>
                              handleEditReview(
                                review
                              )
                            }
                            className="rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-300 transition-all hover:bg-violet-500/20"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteReview(
                                review._id
                              )
                            }
                            className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-300 transition-all hover:bg-red-500/20"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;

