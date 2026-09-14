import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    user,
    accessToken,
    isAuthenticated,
    getCurrentUser,
  } = useAuthStore();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    brand: "",
    stock: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // =========================================================
  // AUTH CHECK
  // =========================================================

  useEffect(() => {
    if (!isAuthenticated && !accessToken) {
      getCurrentUser();
    }
  }, [
    isAuthenticated,
    accessToken,
    getCurrentUser,
  ]);

  useEffect(() => {
    if (
      isAuthenticated &&
      user &&
      user.role !== "seller" &&
      user.role !== "admin"
    ) {
      navigate("/", { replace: true });
    }
  }, [
    isAuthenticated,
    user,
    navigate,
  ]);

  // =========================================================
  // FETCH PRODUCT
  // =========================================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setMessage({
          type: "",
          text: "",
        });

        const response = await api.get(
          `/products/${id}`
        );

        if (!response.data?.success) {
          setMessage({
            type: "error",
            text:
              response.data?.message ||
              "Failed to load product.",
          });

          return;
        }

        const product =
          response.data.product;

        setForm({
          name: product?.name || "",
          slug: product?.slug || "",
          description:
            product?.description || "",
          price:
            product?.price !== undefined &&
            product?.price !== null
              ? String(product.price)
              : "",
          discountPrice:
            product?.discountPrice !== undefined &&
            product?.discountPrice !== null
              ? String(product.discountPrice)
              : "",
          category:
            product?.category || "",
          brand:
            product?.brand || "",
          stock:
            product?.stock !== undefined &&
            product?.stock !== null
              ? String(product.stock)
              : "",
        });

        setExistingImages(
          Array.isArray(product?.images)
            ? product.images
            : []
        );
      } catch (error) {
        console.error(
          "Fetch Product Error:",
          error
        );

        setMessage({
          type: "error",
          text:
            error.response?.data?.message ||
            "Unable to load product.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage({
      type: "",
      text: "",
    });
  };

  // =========================================================
  // NAME + AUTO SLUG
  // =========================================================

  const handleNameChange = (event) => {
    const value = event.target.value;

    setForm((previous) => ({
      ...previous,
      name: value,
      slug: value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    }));

    setMessage({
      type: "",
      text: "",
    });
  };

  // =========================================================
  // IMAGE SELECT
  // =========================================================

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (!selectedFiles.length) {
      return;
    }

    const validFiles = selectedFiles.filter(
      (file) => {
        if (!file.type.startsWith("image/")) {
          return false;
        }

        if (
          file.size >
          5 * 1024 * 1024
        ) {
          return false;
        }

        return true;
      }
    );

    if (
      validFiles.length !==
      selectedFiles.length
    ) {
      setMessage({
        type: "error",
        text:
          "Only image files under 5MB are allowed.",
      });
    }

    const currentNewImages =
      newImages.length;

    const availableSlots =
      10 -
      existingImages.length -
      currentNewImages;

    if (availableSlots <= 0) {
      setMessage({
        type: "error",
        text:
          "A product can have a maximum of 10 images.",
      });

      event.target.value = "";
      return;
    }

    const filesToAdd =
      validFiles.slice(
        0,
        availableSlots
      );

    if (!filesToAdd.length) {
      event.target.value = "";
      return;
    }

    setNewImages((previous) => [
      ...previous,
      ...filesToAdd,
    ]);

    const previews =
      filesToAdd.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

    setNewPreviews((previous) => [
      ...previous,
      ...previews,
    ]);

    event.target.value = "";
  };

  // =========================================================
  // REMOVE NEW IMAGE
  // =========================================================

  const removeNewImage = (index) => {
    setNewPreviews((previous) => {
      const target =
        previous[index];

      if (target?.url) {
        URL.revokeObjectURL(
          target.url
        );
      }

      return previous.filter(
        (_, imageIndex) =>
          imageIndex !== index
      );
    });

    setNewImages((previous) =>
      previous.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  };

  // =========================================================
  // PRICE HELPERS
  // =========================================================

  const getCurrentPrice = () => {
    return Number(form.price);
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    // ---------------------------------------------------------
    // REQUIRED VALIDATION
    // ---------------------------------------------------------

    if (!form.name.trim()) {
      setMessage({
        type: "error",
        text: "Product name is required.",
      });
      return;
    }

    if (!form.slug.trim()) {
      setMessage({
        type: "error",
        text: "Product slug is required.",
      });
      return;
    }

    if (!form.description.trim()) {
      setMessage({
        type: "error",
        text:
          "Product description is required.",
      });
      return;
    }

    if (form.price === "") {
      setMessage({
        type: "error",
        text: "Product price is required.",
      });
      return;
    }

    if (!form.category.trim()) {
      setMessage({
        type: "error",
        text:
          "Product category is required.",
      });
      return;
    }

    if (form.stock === "") {
      setMessage({
        type: "error",
        text: "Product stock is required.",
      });
      return;
    }

    // ---------------------------------------------------------
    // NUMBER VALIDATION
    // ---------------------------------------------------------

    const productPrice =
      Number(form.price);

    const productStock =
      Number(form.stock);

    if (
      !Number.isFinite(
        productPrice
      ) ||
      productPrice < 0
    ) {
      setMessage({
        type: "error",
        text:
          "Enter a valid product price.",
      });
      return;
    }

    if (
      !Number.isInteger(
        productStock
      ) ||
      productStock < 0
    ) {
      setMessage({
        type: "error",
        text:
          "Stock must be a valid non-negative integer.",
      });
      return;
    }

    if (
      form.discountPrice !== ""
    ) {
      const discount =
        Number(form.discountPrice);

      if (
        !Number.isFinite(discount) ||
        discount < 0
      ) {
        setMessage({
          type: "error",
          text:
            "Enter a valid discount price.",
        });
        return;
      }

      if (
        discount > productPrice
      ) {
        setMessage({
          type: "error",
          text:
            "Discount price cannot be greater than product price.",
        });
        return;
      }
    }

    if (!accessToken) {
      setMessage({
        type: "error",
        text:
          "Authentication required. Please login again.",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formData =
        new FormData();

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "slug",
        form.slug.trim().toLowerCase()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "price",
        form.price
      );

      formData.append(
        "discountPrice",
        form.discountPrice
      );

      formData.append(
        "category",
        form.category.trim()
      );

      formData.append(
        "brand",
        form.brand.trim()
      );

      formData.append(
        "stock",
        form.stock
      );

      // ---------------------------------------------------------
      // NEW IMAGES
      // ---------------------------------------------------------

      newImages.forEach(
        (file) => {
          formData.append(
            "images",
            file
          );
        }
      );

      // ---------------------------------------------------------
      // UPDATE API
      // ---------------------------------------------------------

      const response =
        await api.put(
          `/products/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to update product."
        );
      }

      setMessage({
        type: "success",
        text:
          "Product updated successfully.",
      });

      // Cleanup preview URLs
      newPreviews.forEach(
        (item) => {
          if (item.url) {
            URL.revokeObjectURL(
              item.url
            );
          }
        }
      );

      setTimeout(() => {
        navigate(
          "/products/manage",
          {
            replace: true,
          }
        );
      }, 1000);
    } catch (error) {
      console.error(
        "Update Product Error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          error.message ||
          "Failed to update product.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // CLEANUP PREVIEWS
  // =========================================================

  useEffect(() => {
    return () => {
      newPreviews.forEach(
        (item) => {
          if (item.url) {
            URL.revokeObjectURL(
              item.url
            );
          }
        }
      );
    };
  }, []);

  // =========================================================
  // IMAGE URL HELPER
  // =========================================================

  const getImageUrl = (image) => {
    if (typeof image === "string") {
      return image;
    }

    return image?.url || "";
  };

  // =========================================================
  // INPUT CLASS
  // =========================================================

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 text-sm text-white outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-white/25 focus:border-violet-400/50 focus:bg-violet-500/[0.06] focus:ring-2 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50";

  // =========================================================
  // LOADING
  // =========================================================

  if (
    isLoading ||
    !isAuthenticated
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05020b] px-6 text-white">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />

          <p className="mt-5 text-sm text-white/40">
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05020b] px-4 pb-24 pt-32 text-white sm:px-6 lg:px-10">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[160px]" />

      <div className="pointer-events-none absolute -left-32 top-[35%] h-80 w-80 rounded-full bg-fuchsia-600/[0.05] blur-[130px]" />

      <div className="pointer-events-none absolute -right-32 bottom-[15%] h-80 w-80 rounded-full bg-purple-600/[0.06] blur-[130px]" />

      <div className="relative mx-auto max-w-6xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10">

          <Link
            to="/products/manage"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-white/40 transition hover:text-violet-300"
          >
            <span>←</span>
            Back to Management
          </Link>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-violet-300">

                <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />

                Seller Studio

              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">

                Edit{" "}

                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
                  Product
                </span>

              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
                Update your product information,
                pricing, inventory and add more
                product images.
              </p>

            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 backdrop-blur-xl">

              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">
                Account
              </p>

              <p className="mt-1 text-sm font-bold text-white/80">
                {user?.name || "Seller"}
              </p>

              <p className="mt-1 text-xs capitalize text-violet-300/70">
                {user?.role || "seller"}
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            MESSAGE
        ================================================= */}

        {message.text && (
          <div
            className={`mb-6 rounded-2xl border px-5 py-4 text-sm font-semibold backdrop-blur-xl ${
              message.type === "success"
                ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                : "border-red-400/20 bg-red-500/10 text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* =================================================
              PRODUCT INFO
          ================================================= */}

          <section className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-8">

            <div className="mb-7">

              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-400/70">
                01 / Information
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Product Details
              </h2>

              <p className="mt-2 text-sm text-white/35">
                Update the essential details of
                your product.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* NAME */}

              <div>

                <label className="mb-2 block text-xs font-bold text-white/60">
                  Product Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={
                    handleNameChange
                  }
                  disabled={isSubmitting}
                  className={inputClass}
                />

              </div>

              {/* SLUG */}

              <div>

                <label className="mb-2 block text-xs font-bold text-white/60">
                  Slug *
                </label>

                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={inputClass}
                />

              </div>

              {/* CATEGORY */}

              <div>

                <label className="mb-2 block text-xs font-bold text-white/60">
                  Category *
                </label>

                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Electronics"
                  className={inputClass}
                />

              </div>

              {/* BRAND */}

              <div>

                <label className="mb-2 block text-xs font-bold text-white/60">
                  Brand
                </label>

                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Sony"
                  className={inputClass}
                />

              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-xs font-bold text-white/60">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={6}
                  className={`${inputClass} resize-none`}
                />

              </div>

            </div>

          </section>

          {/* =================================================
              PRICING
          ================================================= */}

          <section className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-8">

            <div className="mb-7">

              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-400/70">
                02 / Pricing
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Price & Inventory
              </h2>

              <p className="mt-2 text-sm text-white/35">
                Update your pricing and available
                stock.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

              {/* PRICE */}

              <div>

                <label className="mb-2 block text-xs font-bold text-white/60">
                  Price *
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-white/30">
                    $
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`${inputClass} pl-9`}
                  />

                </div>

              </div>

              {/* DISCOUNT */}

              <div>

                <label className="mb-2 block text-xs font-bold text-white/60">
                  Discount Price
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-white/30">
                    $
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="discountPrice"
                    value={
                      form.discountPrice
                    }
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`${inputClass} pl-9`}
                  />

                </div>

              </div>

              {/* STOCK */}

              <div>

                <label className="mb-2 block text-xs font-bold text-white/60">
                  Stock *
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={inputClass}
                />

              </div>

            </div>

          </section>

          {/* =================================================
              EXISTING IMAGES
          ================================================= */}

          <section className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-8">

            <div className="mb-7">

              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-400/70">
                    03 / Existing Media
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Current Images
                  </h2>

                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-bold text-white/50">
                  {existingImages.length}
                  {" "}image
                  {existingImages.length !== 1
                    ? "s"
                    : ""}
                </div>

              </div>

            </div>

            {existingImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">

                {existingImages.map(
                  (image, index) => {
                    const imageUrl =
                      getImageUrl(image);

                    return (
                      <div
                        key={
                          image.publicId ||
                          `${imageUrl}-${index}`
                        }
                        className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
                      >

                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={`Current product ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-4xl">
                            📦
                          </div>
                        )}

                        {index === 0 && (
                          <div className="absolute left-2 top-2 rounded-full border border-violet-300/20 bg-violet-600/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white">
                            Main
                          </div>
                        )}

                        <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-1 text-[9px] font-bold text-white/70 backdrop-blur-xl">
                          {index + 1}
                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center text-sm text-white/30">
                No existing images.
              </div>
            )}

          </section>

          {/* =================================================
              ADD NEW IMAGES
          ================================================= */}

          <section className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-8">

            <div className="mb-7">

              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-400/70">
                    04 / New Media
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Add More Images
                  </h2>

                  <p className="mt-2 text-sm text-white/35">
                    Add new images to this product.
                    Maximum total: 10 images.
                  </p>

                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-bold text-white/50">
                  {existingImages.length +
                    newImages.length}
                  {" "}/ 10
                </div>

              </div>

            </div>

            {existingImages.length +
              newImages.length <
              10 && (
              <label className="group relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[26px] border border-dashed border-violet-400/20 bg-violet-500/[0.025] px-6 text-center transition-all duration-500 hover:border-violet-400/40 hover:bg-violet-500/[0.06]">

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={
                    handleImageChange
                  }
                  disabled={
                    isSubmitting
                  }
                  className="hidden"
                />

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300 transition-transform duration-500 group-hover:scale-110">
                  ↑
                </div>

                <p className="mt-5 text-sm font-bold text-white/75">
                  Click to add new images
                </p>

                <p className="mt-2 text-xs text-white/30">
                  PNG, JPG, WEBP • Up to 5MB each
                </p>

              </label>
            )}

            {newPreviews.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">

                {newPreviews.map(
                  (preview, index) => (
                    <div
                      key={`${preview.url}-${index}`}
                      className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
                    >

                      <img
                        src={preview.url}
                        alt={`New preview ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      <button
                        type="button"
                        onClick={() =>
                          removeNewImage(
                            index
                          )
                        }
                        disabled={
                          isSubmitting
                        }
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-red-300/20 bg-black/60 text-red-300 opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:opacity-100 hover:bg-red-500/20"
                        aria-label="Remove new image"
                      >
                        ×
                      </button>

                      <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-1 text-[9px] font-bold text-white/70">
                        New {index + 1}
                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </section>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <section className="rounded-[30px] border border-violet-400/10 bg-gradient-to-br from-violet-500/[0.08] via-white/[0.025] to-fuchsia-500/[0.05] p-5 shadow-2xl shadow-violet-950/20 backdrop-blur-2xl sm:p-8">

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

              <div>

                <p className="text-sm font-bold text-white/80">
                  Save your changes?
                </p>

                <p className="mt-2 max-w-xl text-xs leading-6 text-white/35">
                  Your updated information and any
                  new images will be sent securely
                  to the AmitShop backend.
                </p>

              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/products/manage"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-center text-sm font-bold text-white/60 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative overflow-hidden rounded-2xl border border-violet-300/20 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-violet-950/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-violet-900/40 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  <span className="relative z-10 flex items-center justify-center gap-2">

                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Save Changes
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </>
                    )}

                  </span>

                </button>

              </div>

            </div>

          </section>

        </form>

      </div>
    </main>
  );
};

export default EditProduct;