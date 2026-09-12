import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

const AddProduct = () => {
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

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  /* =========================================================
     AUTH CHECK
  ========================================================= */

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
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage({
      type: "",
      text: "",
    });
  };

  /* =========================================================
     AUTO SLUG
  ========================================================= */

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

  /* =========================================================
     IMAGE SELECT
  ========================================================= */

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (!selectedFiles.length) return;

    const validFiles = selectedFiles.filter((file) => {
      if (!file.type.startsWith("image/")) {
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        return false;
      }

      return true;
    });

    if (validFiles.length !== selectedFiles.length) {
      setMessage({
        type: "error",
        text:
          "Only image files under 5MB are allowed.",
      });
    }

    const remainingSlots = 10 - images.length;

    const filesToAdd = validFiles.slice(
      0,
      remainingSlots
    );

    if (filesToAdd.length === 0) {
      setMessage({
        type: "error",
        text: "You can upload a maximum of 10 images.",
      });
      return;
    }

    setImages((previous) => [
      ...previous,
      ...filesToAdd,
    ]);

    const newPreviews = filesToAdd.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviews((previous) => [
      ...previous,
      ...newPreviews,
    ]);

    event.target.value = "";
  };

  /* =========================================================
     REMOVE IMAGE
  ========================================================= */

  const removeImage = (index) => {
    setPreviews((previous) => {
      const target = previous[index];

      if (target?.url) {
        URL.revokeObjectURL(target.url);
      }

      return previous.filter(
        (_, imageIndex) => imageIndex !== index
      );
    });

    setImages((previous) =>
      previous.filter(
        (_, imageIndex) => imageIndex !== index
      )
    );
  };

  /* =========================================================
     SUBMIT PRODUCT
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    if (!form.name.trim()) {
      setMessage({
        type: "error",
        text: "Product name is required.",
      });
      return;
    }

    if (!form.description.trim()) {
      setMessage({
        type: "error",
        text: "Product description is required.",
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

    if (form.category === "") {
      setMessage({
        type: "error",
        text: "Product category is required.",
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

    const productPrice = Number(form.price);
    const productStock = Number(form.stock);

    if (
      !Number.isFinite(productPrice) ||
      productPrice < 0
    ) {
      setMessage({
        type: "error",
        text: "Enter a valid product price.",
      });
      return;
    }

    if (
      !Number.isInteger(productStock) ||
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
      form.discountPrice !== "" &&
      Number(form.discountPrice) > productPrice
    ) {
      setMessage({
        type: "error",
        text:
          "Discount price cannot be greater than product price.",
      });
      return;
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

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("slug", form.slug.trim());
      formData.append(
        "description",
        form.description.trim()
      );
      formData.append("price", form.price);
      formData.append(
        "discountPrice",
        form.discountPrice
      );
      formData.append(
        "category",
        form.category.trim()
      );
      formData.append("brand", form.brand.trim());
      formData.append("stock", form.stock);

      /* =====================================================
         IMPORTANT:
         Backend uses upload.array("images", 10)
         So every image MUST use "images"
      ===================================================== */

      images.forEach((file) => {
        formData.append("images", file);
      });

      const response = await api.post(
        "/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text:
            "Product created successfully.",
        });

        previews.forEach((item) => {
          if (item.url) {
            URL.revokeObjectURL(item.url);
          }
        });

        setForm({
          name: "",
          slug: "",
          description: "",
          price: "",
          discountPrice: "",
          category: "",
          brand: "",
          stock: "",
        });

        setImages([]);
        setPreviews([]);

        setTimeout(() => {
          navigate("/products");
        }, 1200);
      }
    } catch (error) {
      console.error(
        "Create Product Error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to create product.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     INPUT CLASS
  ========================================================= */

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 text-sm text-white outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-white/25 focus:border-violet-400/50 focus:bg-violet-500/[0.06] focus:ring-2 focus:ring-violet-500/10";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05020b] px-4 pb-24 pt-32 text-white sm:px-6 lg:px-10">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[150px]" />

      <div className="pointer-events-none absolute -left-32 top-[35%] h-72 w-72 rounded-full bg-fuchsia-600/[0.06] blur-[120px]" />

      <div className="pointer-events-none absolute -right-32 bottom-[15%] h-72 w-72 rounded-full bg-purple-600/[0.07] blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10">
          <Link
            to="/products"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-white/40 transition-colors hover:text-violet-300"
          >
            <span>←</span>
            Back to Products
          </Link>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-violet-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />
                Seller Studio
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Add New{" "}
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
                  Product
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
                Create a premium product and upload
                up to 10 high-quality images directly
                to AmitShop.
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
              PRODUCT INFORMATION
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
                Add the essential information for your
                product.
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
                  onChange={handleNameChange}
                  placeholder="Premium Wireless Headphones"
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
                  placeholder="premium-wireless-headphones"
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
                  rows={6}
                  placeholder="Describe your product, features, quality and specifications..."
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
                Set your product pricing and available
                inventory.
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
                    placeholder="99.99"
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
                    value={form.discountPrice}
                    onChange={handleChange}
                    placeholder="79.99"
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
                  placeholder="100"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* =================================================
              IMAGES
          ================================================= */}

          <section className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-8">
            <div className="mb-7">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-400/70">
                    03 / Media
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Product Images
                  </h2>

                  <p className="mt-2 text-sm text-white/35">
                    Upload up to 10 images. Maximum
                    5MB per image.
                  </p>
                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-bold text-white/50">
                  {images.length} / 10 selected
                </div>
              </div>
            </div>

            {/* UPLOAD AREA */}

            {images.length < 10 && (
              <label className="group relative flex min-h-[190px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[26px] border border-dashed border-violet-400/20 bg-violet-500/[0.025] px-6 text-center transition-all duration-500 hover:border-violet-400/40 hover:bg-violet-500/[0.06]">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300 transition-transform duration-500 group-hover:scale-110">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 16V4" />
                    <path d="m7 9 5-5 5 5" />
                    <path d="M5 20h14" />
                  </svg>
                </div>

                <p className="mt-5 text-sm font-bold text-white/75">
                  Click to upload product images
                </p>

                <p className="mt-2 text-xs text-white/30">
                  PNG, JPG, WEBP • Up to 5MB each
                </p>
              </label>
            )}

            {/* PREVIEWS */}

            {previews.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {previews.map((preview, index) => (
                  <div
                    key={`${preview.url}-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
                  >
                    <img
                      src={preview.url}
                      alt={`Product preview ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {index === 0 && (
                      <div className="absolute left-2 top-2 rounded-full border border-violet-300/20 bg-violet-600/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white">
                        Main
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(index)
                      }
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-red-300/20 bg-black/50 text-red-300 opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-red-500/20"
                      aria-label="Remove image"
                    >
                      ×
                    </button>

                    <div className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-1 text-[9px] font-bold text-white/70 backdrop-blur-xl">
                      {index + 1}
                    </div>
                  </div>
                ))}
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
                  Ready to publish?
                </p>

                <p className="mt-2 max-w-xl text-xs leading-6 text-white/35">
                  Your product information and selected
                  images will be securely sent to the
                  AmitShop backend.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/products"
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
                        Creating Product...
                      </>
                    ) : (
                      <>
                        Create Product
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

export default AddProduct;