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

const AddCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    category_name: "",
    category_description: "",
    category_image: null,
  });

  const handleBack = () => {
    navigate("/admin", { state: { activeTab: "categories" } });
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      if (previewImage && previewImage.startsWith("blob:"))
        URL.revokeObjectURL(previewImage);
      const previewUrl = URL.createObjectURL(files[0]);
      setPreviewImage(previewUrl);
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.category_name?.trim())
      newErrors.category_name = "Category name is required";
    if (!categoryId && !formData.category_image)
      newErrors.category_image = "Category image is required";
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
      formDataToSend.append("category_name", formData.category_name.trim());
      formDataToSend.append(
        "category_description",
        formData.category_description.trim()
      );
      if (formData.category_image)
        formDataToSend.append("category_image", formData.category_image);

      if (categoryId) {
        await ApiService.updateCategory(categoryId, formDataToSend);
        setMessage("Category updated successfully");
      } else {
        await ApiService.createCategory(formDataToSend);
        setMessage("Category added successfully");
      }
      setShowMessage(true);
      setLoading(false);
      setTimeout(
        () =>
          navigate("/admin", {
            state: { activeTab: "categories" },
          }),
        1200
      );
    } catch (error) {
      setLoading(false);
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
      setShowMessage(true);
    }
  };

  const fetchCategoryById = async (id) => {
    try {
      setLoading(true);
      const response = await ApiService.getCategoryById(id);
      const category = response?.data?.data;
      if (category) {
        setFormData({
          category_name: category.category_name || "",
          category_description: category.category_description || "",
          category_image: null,
        });
        if (category.category_image) {
          const imageUrl = getImageUrl(category.category_image);
          setPreviewImage(imageUrl);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
      setShowMessage(true);
    }
  };

  useEffect(() => {
    const categoryIdFromState = location?.state?.mainCategoryId;
    if (categoryIdFromState) {
      setCategoryId(categoryIdFromState);
      fetchCategoryById(categoryIdFromState);
    }
  }, [location]);

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:"))
        URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {loading ? <Spinner /> : null}

      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={handleBack}
          className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          {categoryId ? "Edit Category" : "Add New Category"}
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

      <div className="rounded-lg border border-gray-200 bg-white shadow">
        <div className="p-4">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category Name*
                </label>
                <input
                  type="text"
                  name="category_name"
                  value={formData.category_name}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                  className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                    errors.category_name ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.category_name ? (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.category_name}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category Image
                  {!categoryId ? "*" : " (Leave empty to keep current image)"}
                </label>
                <input
                  type="file"
                  name="category_image"
                  onChange={handleInputChange}
                  accept="image/*"
                  className={`mt-1 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-white hover:file:bg-indigo-700 ${
                    errors.category_image ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.category_image ? (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.category_image}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">
                    Supported formats: JPG, JPEG, PNG, GIF, WebP, AVIF (Max:
                    5MB)
                  </p>
                )}
                {previewImage ? (
                  <div className="mt-2">
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      {categoryId ? "Current Image:" : "Image Preview:"}
                    </p>
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt="Category Preview"
                      className="h-[150px] w-[200px] rounded object-cover border"
                      onError={(e) =>
                        (e.currentTarget.src = "/placeholder.svg")
                      }
                    />
                  </div>
                ) : null}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  name="category_description"
                  value={formData.category_description}
                  onChange={handleInputChange}
                  placeholder="Enter category description (optional)"
                  className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                    errors.category_description
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
              </div>
            </div>

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
                  : categoryId
                  ? "Update Category"
                  : "Add Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
