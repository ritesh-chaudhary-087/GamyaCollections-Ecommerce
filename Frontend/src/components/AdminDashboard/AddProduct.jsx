"use client";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../API/api-service";
import { getImageUrl } from "../Comman/CommanConstans";

const Spinner = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
  </div>
);

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [productId, setProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    product_name: "",
    product_description: "",
    price: "",
    discount_price: "",
    category: "",
    subcategory: "",
    stock: "0",
    bestseller: false,
    images: [],
  });

  // Sizes and colors removed as per requirement

  const handleBack = () => {
    navigate("/admin", { state: { activeTab: "products" } });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      const fileArray = Array.from(files || []);
      const totalImages =
        existingImages.length + formData.images.length + fileArray.length;
      if (totalImages > 3) {
        setMessage(
          `Maximum 3 images allowed. You currently have ${
            existingImages.length + formData.images.length
          } images.`
        );
        setShowMessage(true);
        return;
      }
      setFormData({ ...formData, images: [...formData.images, ...fileArray] });
      const newPreviewImages = [...previewImages];
      fileArray.forEach((file) =>
        newPreviewImages.push(URL.createObjectURL(file))
      );
      setPreviewImages(newPreviewImages);
    } else if (name === "category") {
      setFormData({ ...formData, [name]: value, subcategory: "" });
      const filtered = subcategories.filter((s) => {
        const parent = s.parent_category;
        const parentId = typeof parent === "string" ? parent : parent?._id;
        return String(parentId) === String(value);
      });
      setFilteredSubcategories(filtered);
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const removeExistingImage = (index) => {
    const imageToDelete = existingImages[index];
    const newExistingImages = [...existingImages];
    newExistingImages.splice(index, 1);
    setExistingImages(newExistingImages);
    setImagesToDelete([...imagesToDelete, imageToDelete]);
  };

  const removeNewImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    const newPreviews = [...previewImages];
    if (newPreviews[index]?.startsWith("blob:"))
      URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setFormData({ ...formData, images: newImages });
    setPreviewImages(newPreviews);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.product_name?.trim())
      newErrors.product_name = "Product name is required";
    if (!formData.product_description?.trim())
      newErrors.product_description = "Description is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (
      formData.price &&
      (isNaN(formData.price) || Number(formData.price) <= 0)
    )
      newErrors.price = "Price must be a valid positive number";
    if (
      formData.discount_price &&
      (isNaN(formData.discount_price) || Number(formData.discount_price) <= 0)
    )
      newErrors.discount_price =
        "Discount price must be a valid positive number";
    if (
      formData.discount_price &&
      formData.price &&
      Number(formData.discount_price) >= Number(formData.price)
    )
      newErrors.discount_price =
        "Discount price must be less than regular price";
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.stock && (isNaN(formData.stock) || Number(formData.stock) < 0))
      newErrors.stock = "Stock must be a valid non-negative number";
    const totalImages = existingImages.length + formData.images.length;
    if (!productId && totalImages === 0)
      newErrors.images = "At least one image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setMessage("Please correct the errors before submitting");
      setShowMessage(true);
      return;
    }
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("product_name", formData.product_name.trim());
      formDataToSend.append(
        "product_description",
        formData.product_description.trim()
      );
      formDataToSend.append("price", Number(formData.price));
      if (
        formData.discount_price &&
        String(formData.discount_price).trim() !== ""
      ) {
        formDataToSend.append(
          "discount_price",
          Number(formData.discount_price)
        );
      }
      formDataToSend.append("category", formData.category);
      if (formData.subcategory)
        formDataToSend.append("subcategory", formData.subcategory);
      formDataToSend.append("stock", Number(formData.stock) || 0);
      formDataToSend.append("bestseller", formData.bestseller);
      if (productId) {
        if (formData.images.length > 0 || imagesToDelete.length > 0) {
          formDataToSend.append("replace_all_images", "true");
        }
      }
      if (formData.images?.length) {
        formData.images.forEach((file) => {
          if (file instanceof File) formDataToSend.append("images", file);
        });
      }

      if (productId) {
        await ApiService.updateProduct(productId, formDataToSend);
        setMessage("Product updated successfully");
      } else {
        await ApiService.createProduct(formDataToSend);
        setMessage("Product added successfully");
      }
      setShowMessage(true);
      setLoading(false);
      setTimeout(
        () => navigate("/admin", { state: { activeTab: "products" } }),
        1200
      );
    } catch (error) {
      setLoading(false);
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
      setShowMessage(true);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await ApiService.getCategories(1, 100);
      const rows = Array.isArray(response?.data?.rows)
        ? response.data.rows
        : Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data?.data?.rows)
        ? response.data.data.rows
        : [];
      setCategories(rows);
    } catch (error) {}
  };

  const fetchSubcategories = async () => {
    try {
      const response = await ApiService.getSubcategories(1, 100);
      const rows = Array.isArray(response?.data?.rows)
        ? response.data.rows
        : Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data?.data?.rows)
        ? response.data.data.rows
        : [];
      setSubcategories(rows);
    } catch (error) {}
  };

  const fetchProductById = async (id) => {
    try {
      setLoading(true);
      const response = await ApiService.getProductById(id);
      const product = response?.data?.data;
      if (product) {
        setFormData({
          product_name: product.product_name || "",
          product_description: product.product_description || "",
          price: product.price?.toString() || "",
          discount_price: product.discount_price?.toString() || "",
          category: product.category?._id || "",
          subcategory: product.subcategory?._id || "",
          stock: product.stock?.toString() || "0",
          bestseller: product.bestseller || false,
          images: [],
        });
        if (product.category?._id && subcategories.length) {
          const filtered = subcategories.filter((s) => {
            const parent = s.parent_category;
            const parentId = typeof parent === "string" ? parent : parent?._id;
            return String(parentId) === String(product.category._id);
          });
          setFilteredSubcategories(filtered);
        }
        if (product.images?.length) {
          const urls = product.images.map((img) => getImageUrl(img));
          setExistingImages(urls);
        }
        setPreviewImages([]);
        setImagesToDelete([]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
      setShowMessage(true);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchCategories();
      await fetchSubcategories();
    };
    init();
  }, []);

  useEffect(() => {
    const pid = location?.state?.productId;
    if (pid && subcategories.length > 0) {
      setProductId(pid);
      fetchProductById(pid);
    }
  }, [location, subcategories]);

  useEffect(() => {
    if (formData.category && subcategories.length > 0) {
      const filtered = subcategories.filter((s) => {
        const parent = s.parent_category;
        const parentId = typeof parent === "string" ? parent : parent?._id;
        return String(parentId) === String(formData.category);
      });
      setFilteredSubcategories(filtered);
    }
  }, [subcategories, formData.category]);

  useEffect(() => {
    return () => {
      previewImages.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [previewImages]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      {loading ? <Spinner /> : null}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={handleBack}
          className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          {productId ? "Edit Product" : "Add New Product"}
        </h2>
      </div>

      {showMessage ? (
        <div
          className={`mb-4 rounded border p-3 text-sm ${
            message.startsWith("Error")
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {message}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="rounded-lg border border-gray-200 bg-white shadow">
          <div className="border-b border-gray-100 p-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name*
              </label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                  errors.product_name ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter product name"
              />
              {errors.product_name ? (
                <p className="mt-1 text-xs text-red-600">
                  {errors.product_name}
                </p>
              ) : null}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Regular Price*
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                    errors.price ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
                {errors.price ? (
                  <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                ) : null}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Discount Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="discount_price"
                  value={formData.discount_price}
                  onChange={handleInputChange}
                  className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                    errors.discount_price ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
                {errors.discount_price ? (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.discount_price}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">
                    Optional. Must be less than regular price.
                  </p>
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description*
              </label>
              <textarea
                rows={3}
                name="product_description"
                value={formData.product_description}
                onChange={handleInputChange}
                className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                  errors.product_description
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
                placeholder="Enter product description"
              />
              {errors.product_description ? (
                <p className="mt-1 text-xs text-red-600">
                  {errors.product_description}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white shadow">
          <div className="border-b border-gray-100 p-4">
            <h3 className="text-lg font-semibold">Categories</h3>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category*
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                  errors.category ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Select Category</option>
                {(Array.isArray(categories) ? categories : []).map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
              {errors.category ? (
                <p className="mt-1 text-xs text-red-600">{errors.category}</p>
              ) : null}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subcategory
              </label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                disabled={!formData.category}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm border-gray-300 disabled:opacity-50"
              >
                <option value="">Select Subcategory</option>
                {(Array.isArray(filteredSubcategories)
                  ? filteredSubcategories
                  : []
                ).map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.subcategory_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white shadow">
          <div className="border-b border-gray-100 p-4">
            <h3 className="text-lg font-semibold">Inventory</h3>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                min="0"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                  errors.stock ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="0"
              />
              {errors.stock ? (
                <p className="mt-1 text-xs text-red-600">{errors.stock}</p>
              ) : null}
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="bestseller"
                  checked={formData.bestseller}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                Bestseller Product
              </label>
            </div>
          </div>
        </section>

        {/* <section className="rounded-lg border border-gray-200 bg-white shadow">
          <div className="border-b border-gray-100 p-4">
            <h3 className="text-lg font-semibold">Variants</h3>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sizes
              </label>
              <select
                multiple
                name="sizes"
                value={formData.sizes}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm border-gray-300 h-40"
              >
                {availableSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Hold Ctrl/Cmd to select multiple
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Colors
              </label>
              <select
                multiple
                name="colors"
                value={formData.colors}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm border-gray-300 h-40"
              >
                {availableColors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Hold Ctrl/Cmd to select multiple
              </p>
            </div>
          </div>
        </section> */}

        <section className="rounded-lg border border-gray-200 bg-white shadow">
          <div className="border-b border-gray-100 p-4">
            <h3 className="text-lg font-semibold">Images</h3>
          </div>
          <div className="p-4 space-y-4">
            {productId && existingImages.length > 0 ? (
              <div>
                <p className="font-medium text-gray-800">Current Images:</p>
                <p className="mt-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 inline-block px-2 py-1 rounded">
                  Uploading new images will replace all current images.
                </p>
                <div className="mt-2 flex flex-wrap gap-3">
                  {existingImages.map((image, idx) => (
                    <div key={`existing-${idx}`} className="relative w-[150px]">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Current ${idx + 1}`}
                        className="h-[150px] w-full rounded object-cover border"
                        onError={(e) =>
                          (e.currentTarget.src = "/placeholder.svg")
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute right-1 top-1 rounded bg-red-600 px-2 py-1 text-[10px] font-medium text-white"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {productId
                  ? "New Images (will replace current images)"
                  : "Product Images*"}
              </label>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleInputChange}
                className={`mt-1 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-white hover:file:bg-indigo-700 ${
                  errors.images ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.images ? (
                <p className="mt-1 text-xs text-red-600">{errors.images}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  You can select multiple images at once. Maximum 3 images
                  allowed. Supported formats: JPG, JPEG, PNG, GIF, WebP, AVIF
                  (Max: 5MB each)
                </p>
              )}
            </div>

            {previewImages.length > 0 ? (
              <div>
                <p className="font-medium text-gray-800">New Image Previews:</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  {previewImages.map((src, idx) => (
                    <div key={`new-${idx}`} className="relative w-[150px]">
                      <img
                        src={src || "/placeholder.svg"}
                        alt={`New ${idx + 1}`}
                        className="h-[150px] w-full rounded object-cover border"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute right-1 top-1 rounded bg-red-600 px-2 py-1 text-[10px] font-medium text-white"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 rounded-md border text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading
              ? "Saving..."
              : productId
              ? "Update Product"
              : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
