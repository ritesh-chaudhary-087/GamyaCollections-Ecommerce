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

const AddSubcategory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [subcategoryId, setSubcategoryId] = useState(null);
  const [mainCategories, setMainCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    subcategory_name: "",
    subcategory_description: "",
    parent_category: "",
    subcategory_logo: null,
  });

  const handleBack = () => {
    navigate("/admin", { state: { activeTab: "subcategories" } });
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

  const fetchMainCategories = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getCategories(1, 100);
      const rows = Array.isArray(response?.data?.rows)
        ? response.data.rows
        : Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data?.data?.rows)
        ? response.data.data.rows
        : [];
      setMainCategories(rows);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
      setShowMessage(true);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.subcategory_name?.trim())
      newErrors.subcategory_name = "Subcategory name is required";
    if (!formData.parent_category?.trim())
      newErrors.parent_category = "Parent category is required";
    if (!subcategoryId && !formData.subcategory_logo)
      newErrors.subcategory_logo = "Subcategory logo is required";
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
      formDataToSend.append(
        "subcategory_name",
        formData.subcategory_name.trim()
      );
      formDataToSend.append(
        "subcategory_description",
        formData.subcategory_description.trim()
      );
      formDataToSend.append("parent_category", formData.parent_category);
      if (formData.subcategory_logo)
        formDataToSend.append("subcategory_logo", formData.subcategory_logo);

      if (subcategoryId) {
        await ApiService.updateSubcategory(subcategoryId, formDataToSend);
        setMessage("Subcategory updated successfully");
      } else {
        await ApiService.createSubcategory(formDataToSend);
        setMessage("Subcategory added successfully");
      }
      setShowMessage(true);
      setLoading(false);
      setTimeout(
        () => navigate("/admin", { state: { activeTab: "subcategories" } }),
        1200
      );
    } catch (error) {
      setLoading(false);
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
      setShowMessage(true);
    }
  };

  const fetchSubcategoryById = async (id) => {
    try {
      setLoading(true);
      const response = await ApiService.getSubcategoryById(id);
      const subcategory = response?.data?.data;
      if (subcategory) {
        setFormData({
          subcategory_name: subcategory.subcategory_name || "",
          subcategory_description: subcategory.subcategory_description || "",
          parent_category: subcategory.parent_category?._id || "",
          subcategory_logo: null,
        });
        if (subcategory.subcategory_logo) {
          const imageUrl = getImageUrl(subcategory.subcategory_logo);
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
    fetchMainCategories();
    const idFromState = location?.state?.categoryID;
    if (idFromState) {
      setSubcategoryId(idFromState);
      fetchSubcategoryById(idFromState);
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
          {subcategoryId ? "Edit Subcategory" : "Add New Subcategory"}
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
                  Subcategory Name*
                </label>
                <input
                  type="text"
                  name="subcategory_name"
                  value={formData.subcategory_name}
                  onChange={handleInputChange}
                  placeholder="Enter subcategory name"
                  className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                    errors.subcategory_name
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
                {errors.subcategory_name ? (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.subcategory_name}
                  </p>
                ) : null}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Parent Category*
                </label>
                <select
                  name="parent_category"
                  value={formData.parent_category}
                  onChange={handleInputChange}
                  className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                    errors.parent_category
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select Parent Category</option>
                  {(Array.isArray(mainCategories) ? mainCategories : []).map(
                    (c) => (
                      <option key={c._id} value={c._id}>
                        {c.category_name}
                      </option>
                    )
                  )}
                </select>
                {errors.parent_category ? (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.parent_category}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subcategory Image
                  {!subcategoryId
                    ? "*"
                    : " (Leave empty to keep current image)"}
                </label>
                <input
                  type="file"
                  name="subcategory_logo"
                  onChange={handleInputChange}
                  accept="image/*"
                  className={`mt-1 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-white hover:file:bg-indigo-700 ${
                    errors.subcategory_logo
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
                {errors.subcategory_logo ? (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.subcategory_logo}
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
                      {subcategoryId ? "Current Image:" : "Image Preview:"}
                    </p>
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt="Subcategory Preview"
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
                  name="subcategory_description"
                  value={formData.subcategory_description}
                  onChange={handleInputChange}
                  placeholder="Enter subcategory description (optional)"
                  className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                    errors.subcategory_description
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
                  : subcategoryId
                  ? "Update Subcategory"
                  : "Add Subcategory"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSubcategory;
