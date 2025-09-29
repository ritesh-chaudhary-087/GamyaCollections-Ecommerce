"use client";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../API/api-service";
import { getImageUrl } from "../Comman/CommanConstans";

const TabButton = ({ active, onClick, children, badge }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-t-md border-b-2 -mb-[2px] text-sm font-medium transition-colors ${
      active
        ? "border-indigo-600 text-indigo-600 bg-white"
        : "border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-300"
    }`}
  >
    <span className="inline-flex items-center gap-2">
      {children}
      {badge ? (
        <span className="inline-flex items-center justify-center text-[10px] px-1.5 py-0.5 rounded-full bg-red-500 text-white">
          {badge}
        </span>
      ) : null}
    </span>
  </button>
);

const SectionCard = ({ children, title, actions }) => (
  <div className="bg-white rounded-lg shadow border border-gray-200">
    <div className="p-4 flex items-center justify-between border-b border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const EmptyState = ({ title, subtitle }) => (
  <div className="text-center py-10">
    <p className="text-gray-700 font-medium">{title}</p>
    {subtitle ? <p className="text-gray-500 text-sm mt-1">{subtitle}</p> : null}
  </div>
);

const Spinner = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
  </div>
);

const ConfirmModal = ({
  open,
  title,
  message,
  confirmText = "Delete",
  onCancel,
  onConfirm,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="p-4 border-b border-gray-100">
          <h4 className="text-base font-semibold text-gray-800">{title}</h4>
        </div>
        <div className="p-4 text-sm text-gray-700">{message}</div>
        <div className="p-4 flex justify-end gap-2 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const MessageModal = ({ open, title, body, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="p-4 border-b border-gray-100">
          <h4 className="text-base font-semibold text-gray-800">{title}</h4>
        </div>
        <div className="p-4 text-sm text-gray-700">{body}</div>
        <div className="p-4 flex justify-end border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Table = ({ columns, rows, rowKey = "_id" }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-gray-600">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-2 font-medium ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr
              key={row[rowKey] || JSON.stringify(row)}
              className="hover:bg-gray-50"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-3 py-2 ${col.className || ""}`}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-md text-sm border border-gray-200 disabled:opacity-50"
      >
        Prev
      </button>
      <span className="px-2 text-sm text-gray-600">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-md text-sm border border-gray-200 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "categories"
  );
  const [loading, setLoading] = useState(false);

  const [messageOpen, setMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageTitle, setMessageTitle] = useState("Message");

  const openMessage = (title, text) => {
    setMessageTitle(title);
    setMessageText(text);
    setMessageOpen(true);
  };

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteMeta, setDeleteMeta] = useState({ id: null, type: null });

  const askDelete = (id, type) => {
    setDeleteMeta({ id, type });
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    const { id, type } = deleteMeta;
    if (!id || !type) return;
    try {
      setLoading(true);
      setDeleteModalOpen(false);
      if (type === "category") await ApiService.deleteCategory(id);
      if (type === "subcategory") await ApiService.deleteSubcategory(id);
      if (type === "product") await ApiService.deleteProduct(id);
      openMessage(
        "Success",
        `${type[0].toUpperCase() + type.slice(1)} deleted successfully`
      );
      if (type === "category") await getAllCategories();
      if (type === "subcategory") await getAllSubCategories();
      if (type === "product") await fetchProducts();
    } catch (error) {
      openMessage("Error", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Categories
  const [categories, setCategories] = useState([]);
  const [categoryPage, setCategoryPage] = useState(1);
  const [categoryLimit] = useState(10);
  const [categoryTotalPages, setCategoryTotalPages] = useState(1);

  const getAllCategories = async () => {
    try {
      setLoading(true);
      const resp = await ApiService.getCategories(categoryPage, categoryLimit);
      const rows = Array.isArray(resp?.data?.rows)
        ? resp.data.rows
        : Array.isArray(resp?.data?.data)
        ? resp.data.data
        : Array.isArray(resp?.data?.data?.rows)
        ? resp.data.data.rows
        : [];
      const pages =
        resp?.data?.pages_count || resp?.data?.data?.pages_count || 1;
      const withSr = rows.map((r, idx) => ({
        ...r,
        sr: (categoryPage - 1) * categoryLimit + idx + 1,
      }));
      setCategories(withSr);
      setCategoryTotalPages(pages);
    } catch (e) {
      console.error("Error fetching categories", e);
      setCategories([]);
      setCategoryTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Subcategories
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryPage, setSubcategoryPage] = useState(1);
  const [subcategoryLimit] = useState(10);
  const [subcategoryTotalPages, setSubcategoryTotalPages] = useState(1);

  const getAllSubCategories = async () => {
    try {
      setLoading(true);
      const resp = await ApiService.getSubcategories(
        subcategoryPage,
        subcategoryLimit
      );
      const rows = Array.isArray(resp?.data?.rows)
        ? resp.data.rows
        : Array.isArray(resp?.data?.data)
        ? resp.data.data
        : Array.isArray(resp?.data?.data?.rows)
        ? resp.data.data.rows
        : [];
      const pages =
        resp?.data?.pages_count || resp?.data?.data?.pages_count || 1;
      const withSr = rows.map((r, idx) => ({
        ...r,
        sr: (subcategoryPage - 1) * subcategoryLimit + idx + 1,
      }));
      setSubcategories(withSr);
      setSubcategoryTotalPages(pages);
    } catch (e) {
      openMessage("Error", "Error fetching subcategories");
    } finally {
      setLoading(false);
    }
  };

  // Products
  const [products, setProducts] = useState([]);
  const [productPage, setProductPage] = useState(1);
  const [productLimit] = useState(10);
  const [productTotalPages, setProductTotalPages] = useState(1);
  const [productFilters, setProductFilters] = useState({
    category: "",
    subcategory: "",
    search: "",
    minPrice: "",
    maxPrice: "",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const resp = await ApiService.getProducts(
        productPage,
        productLimit,
        productFilters
      );
      const rows = Array.isArray(resp?.data?.rows)
        ? resp.data.rows
        : Array.isArray(resp?.data?.data)
        ? resp.data.data
        : Array.isArray(resp?.data?.data?.rows)
        ? resp.data.data.rows
        : [];
      const pages =
        resp?.data?.pages_count || resp?.data?.data?.pages_count || 1;
      const withSr = rows.map((r, idx) => ({
        ...r,
        sr: (productPage - 1) * productLimit + idx + 1,
      }));
      setProducts(withSr);
      setProductTotalPages(pages);
    } catch (e) {
      console.error("Error fetching products", e);
      setProducts([]);
      setProductTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // No additional filter options required (sizes/colors removed)

  // Users
  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(1);
  const [userLimit] = useState(10);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [unseenOrderCount, setUnseenOrderCount] = useState(0);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const resp = await ApiService.getUsers(userPage, userLimit);
      const rows = resp?.data?.data?.rows || resp?.data?.rows || [];
      const pages =
        resp?.data?.data?.pages_count || resp?.data?.pages_count || 1;
      const withSr = rows.map((r, idx) => ({
        ...r,
        sr: (userPage - 1) * userLimit + idx + 1,
      }));
      setUsers(withSr);
      setUserTotalPages(pages);
    } catch (e) {
      openMessage("Error", "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const getUnseenOrdersCount = async () => {
    try {
      const resp = await ApiService.getUnseenOrdersCount();
      if (resp?.data?.success) setUnseenOrderCount(resp.data.count);
    } catch (_) {}
  };

  // Orders modal per user
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [currentViewingUserId, setCurrentViewingUserId] = useState(null);
  const sortedOrders = useMemo(
    () =>
      [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders]
  );

  const handleViewOrders = async (userId) => {
    try {
      setLoading(true);
      const resp = await ApiService.getOrdersByUser(userId);
      const list = resp?.data?.orders || [];
      setOrders(list);
      setCurrentViewingUserId(userId);
      setOrdersOpen(true);
    } catch (e) {
      openMessage("Error", "Error fetching orders for user");
    } finally {
      setLoading(false);
    }
  };

  const closeOrdersModal = async () => {
    try {
      if (currentViewingUserId) {
        await ApiService.markOrdersAsSeen(currentViewingUserId);
        await getUnseenOrdersCount();
      }
    } catch (_) {}
    setOrdersOpen(false);
    setCurrentViewingUserId(null);
  };

  // Contact messages modal
  const [contactsOpen, setContactsOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactsRefreshKey, setContactsRefreshKey] = useState(0);

  const handleViewContacts = async (email) => {
    try {
      setLoading(true);
      const resp = await ApiService.getContactsByEmail(email);
      const list = resp?.data?.contacts || [];
      setContacts(list);
      setContactsOpen(true);
      try {
        await ApiService.markContactsAsRead(email);
        setContactsRefreshKey((k) => k + 1);
      } catch (_) {}
    } catch (e) {
      openMessage("Error", "Error fetching contact messages");
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    if (activeTab === "categories") getAllCategories();
    if (activeTab === "subcategories") getAllSubCategories();
    if (activeTab === "products") {
      // Ensure filter dropdowns have data
      getAllCategories();
      getAllSubCategories();
      fetchProducts();
    }
    if (activeTab === "users") {
      fetchUsers();
      getUnseenOrdersCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, categoryPage, subcategoryPage, productPage, userPage]);

  useEffect(() => {
    const t = setInterval(() => {
      if (activeTab === "users") getUnseenOrdersCount();
    }, 30000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {loading ? <Spinner /> : null}

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
          >
            ← Back to Home
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex gap-2">
          <TabButton
            active={activeTab === "categories"}
            onClick={() => setActiveTab("categories")}
          >
            Categories
          </TabButton>
          <TabButton
            active={activeTab === "subcategories"}
            onClick={() => setActiveTab("subcategories")}
          >
            Subcategories
          </TabButton>
          <TabButton
            active={activeTab === "products"}
            onClick={() => setActiveTab("products")}
          >
            Products
          </TabButton>
          <TabButton
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            badge={unseenOrderCount || undefined}
          >
            Users
          </TabButton>
          <TabButton
            active={activeTab === "testimonials"}
            onClick={() => setActiveTab("testimonials")}
          >
            Testimonials
          </TabButton>
          <TabButton
            active={activeTab === "video"}
            onClick={() => setActiveTab("video")}
          >
            Video
          </TabButton>
        </div>
      </div>

      {activeTab === "categories" && (
        <div className="mt-4">
          <SectionCard
            title="Categories Management"
            actions={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/AddCategory")}
                  className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                >
                  + Add Category
                </button>
                <button
                  onClick={() => navigate("/AddSubcategory")}
                  className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
                >
                  + Add Subcategory
                </button>
              </div>
            }
          >
            <Table
              columns={[
                { key: "sr", header: "Sr No", className: "w-16" },
                { key: "category_name", header: "Category Name" },
                {
                  key: "category_image",
                  header: "Image",
                  className: "w-24",
                  render: (row) => (
                    <img
                      src={
                        getImageUrl(row.category_image) || "/placeholder.svg"
                      }
                      alt="category"
                      className="h-12 w-12 object-cover rounded"
                      onError={(e) =>
                        (e.currentTarget.src = "/placeholder.svg")
                      }
                    />
                  ),
                },
                { key: "category_description", header: "Description" },
                {
                  key: "_action",
                  header: "Action",
                  className: "w-36",
                  render: (row) => (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate("/AddCategory", {
                            state: { mainCategoryId: row._id },
                          })
                        }
                        className="px-2 py-1 text-xs rounded border hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => askDelete(row._id, "category")}
                        className="px-2 py-1 text-xs rounded bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={categories}
            />
            <Pagination
              page={categoryPage}
              totalPages={categoryTotalPages}
              onPageChange={setCategoryPage}
            />
          </SectionCard>
        </div>
      )}

      {activeTab === "subcategories" && (
        <div className="mt-4">
          <SectionCard
            title="Subcategories Management"
            actions={
              <button
                onClick={() => navigate("/AddSubcategory")}
                className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
              >
                + Add Subcategory
              </button>
            }
          >
            <Table
              columns={[
                { key: "sr", header: "Sr No", className: "w-16" },
                { key: "subcategory_name", header: "Subcategory Name" },
                {
                  key: "parent_category",
                  header: "Parent Category",
                  render: (row) => row.parent_category?.category_name || "N/A",
                },
                {
                  key: "subcategory_logo",
                  header: "Image",
                  className: "w-24",
                  render: (row) => (
                    <img
                      src={
                        getImageUrl(row.subcategory_logo) || "/placeholder.svg"
                      }
                      alt="subcategory"
                      className="h-12 w-12 object-cover rounded"
                      onError={(e) =>
                        (e.currentTarget.src = "/placeholder.svg")
                      }
                    />
                  ),
                },
                { key: "subcategory_description", header: "Description" },
                {
                  key: "_action",
                  header: "Action",
                  className: "w-36",
                  render: (row) => (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate("/admin-category", {
                            state: { categoryID: row._id },
                          })
                        }
                        className="px-2 py-1 text-xs rounded border hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => askDelete(row._id, "subcategory")}
                        className="px-2 py-1 text-xs rounded bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={subcategories}
            />
            <Pagination
              page={subcategoryPage}
              totalPages={subcategoryTotalPages}
              onPageChange={setSubcategoryPage}
            />
          </SectionCard>
        </div>
      )}

      {activeTab === "products" && (
        <div className="mt-4 space-y-4">
          <SectionCard
            title="Filters"
            actions={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setProductFilters({
                      category: "",
                      subcategory: "",
                      search: "",
                      minPrice: "",
                      maxPrice: "",
                    });
                    setProductPage(1);
                    fetchProducts();
                  }}
                  className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    setProductPage(1);
                    fetchProducts();
                  }}
                  className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                >
                  Apply
                </button>
              </div>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <select
                value={productFilters.category}
                onChange={(e) =>
                  setProductFilters((p) => ({ ...p, category: e.target.value }))
                }
                className="w-full rounded-md border-gray-200 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
              <select
                value={productFilters.subcategory}
                onChange={(e) =>
                  setProductFilters((p) => ({ ...p, subcategory: e.target.value }))
                }
                className="w-full rounded-md border-gray-200 text-sm"
              >
                <option value="">All Subcategories</option>
                {(Array.isArray(subcategories) ? subcategories : [])
                  .filter((s) => {
                    if (!productFilters.category) return true;
                    const parent = s.parent_category;
                    const parentId = typeof parent === "string" ? parent : parent?._id;
                    return parentId === productFilters.category;
                  })
                  .map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.subcategory_name}
                    </option>
                  ))}
              </select>
              <input
                value={productFilters.search}
                onChange={(e) =>
                  setProductFilters((p) => ({ ...p, search: e.target.value }))
                }
                placeholder="Search..."
                className="w-full rounded-md border-gray-200 text-sm px-2 py-1.5"
              />
              <input
                type="number"
                value={productFilters.minPrice}
                onChange={(e) =>
                  setProductFilters((p) => ({ ...p, minPrice: e.target.value }))
                }
                placeholder="Min Price"
                className="w-full rounded-md border-gray-200 text-sm px-2 py-1.5"
              />
              <input
                type="number"
                value={productFilters.maxPrice}
                onChange={(e) =>
                  setProductFilters((p) => ({ ...p, maxPrice: e.target.value }))
                }
                placeholder="Max Price"
                className="w-full rounded-md border-gray-200 text-sm px-2 py-1.5"
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Products Management"
            actions={
              <button
                onClick={() => navigate("/AddProduct")}
                className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
              >
                + Add Product
              </button>
            }
          >
            <Table
              columns={[
                { key: "sr", header: "Sr No", className: "w-16" },
                {
                  key: "images",
                  header: "Image",
                  className: "w-24",
                  render: (row) =>
                    row.images?.length ? (
                      <img
                        src={getImageUrl(row.images[0]) || "/placeholder.svg"}
                        alt="product"
                        className="h-12 w-12 object-cover rounded"
                        onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                      />
                    ) : (
                      <span className="text-xs text-gray-500">No Image</span>
                    ),
                },
                { key: "product_name", header: "Product Name" },
                {
                  key: "price",
                  header: "Price",
                  className: "w-40",
                  render: (row) => {
                    const hasDiscount = row.discount_price && row.discount_price < row.price;
                    return (
                      <div className="space-y-0.5">
                        <div className={`font-semibold ${hasDiscount ? "text-emerald-600" : "text-gray-900"}`}>
                          ₹{(hasDiscount ? row.discount_price : row.price)?.toFixed?.(2) ?? row.price}
                        </div>
                        {hasDiscount ? (
                          <div className="text-xs text-gray-500 line-through">₹{row.price?.toFixed?.(2) ?? row.price}</div>
                        ) : null}
                      </div>
                    );
                  },
                },
                {
                  key: "discount_price",
                  header: "Discount",
                  className: "w-28",
                  render: (row) => {
                    if (row.discount_price && row.discount_price < row.price) {
                      const pct = Math.round(((row.price - row.discount_price) / row.price) * 100);
                      return <span className="text-emerald-600 font-semibold">{pct}% OFF</span>;
                    }
                    return <span className="text-gray-500">-</span>;
                  },
                },
                {
                  key: "category",
                  header: "Category",
                  render: (r) => r.category?.category_name || "N/A",
                },
                { key: "stock", header: "Stock", className: "w-20" },
                {
                  key: "_action",
                  header: "Action",
                  className: "w-36",
                  render: (row) => (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate("/AddProduct", {
                            state: { productId: row._id },
                          })
                        }
                        className="px-2 py-1 text-xs rounded border hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => askDelete(row._id, "product")}
                        className="px-2 py-1 text-xs rounded bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={products}
            />
        <Pagination
          page={productPage}
          totalPages={productTotalPages}
          onPageChange={setProductPage}
        />
      </SectionCard>
    </div>
  )}

      {activeTab === "testimonials" && (
        <div className="mt-4">
          <SectionCard title="Testimonial Videos" actions={null}>
            <TestimonialAdmin />
          </SectionCard>
        </div>
      )}

      {activeTab === "video" && (
        <div className="mt-4">
          <SectionCard title="Video Management" actions={null}>
            <VideoAdmin />
          </SectionCard>
        </div>
      )}

      {activeTab === "users" && (
        <div className="mt-4">
          <SectionCard title="Users Management">
            <Table
              columns={[
                { key: "sr", header: "Sr No", className: "w-16" },
                { key: "name", header: "Name" },
                { key: "email", header: "Email" },
                { key: "phone", header: "Phone" },
                { key: "role", header: "Role", className: "w-28" },
                {
                  key: "createdAt",
                  header: "Created At",
                  render: (r) =>
                    r.createdAt ? new Date(r.createdAt).toLocaleString() : "-",
                },
                {
                  key: "_orders",
                  header: "View Orders",
                  className: "w-36",
                  render: (row) => (
                    <ViewOrdersButton
                      userId={row._id}
                      onClick={() => handleViewOrders(row._id)}
                    />
                  ),
                },
                {
                  key: "_contacts",
                  header: "Contact Messages",
                  className: "w-40",
                  render: (row) => (
                    <ViewContactsButton
                      email={row.email}
                      onClick={() => handleViewContacts(row.email)}
                      refreshKey={contactsRefreshKey}
                    />
                  ),
                },
              ]}
              rows={users}
            />
            <Pagination
              page={userPage}
              totalPages={userTotalPages}
              onPageChange={setUserPage}
            />
          </SectionCard>
        </div>
      )}

      {/* Delete & Message Modals */}
      <ConfirmModal
        open={deleteModalOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete this ${deleteMeta.type}? This action cannot be undone.`}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
      <MessageModal
        open={messageOpen}
        title={messageTitle}
        body={messageText}
        onClose={() => setMessageOpen(false)}
      />

      {/* Orders Modal */}
      {ordersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-5xl rounded-lg bg-white shadow-lg">
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <h4 className="text-base font-semibold text-gray-800">
                User Orders
              </h4>
              <button
                onClick={closeOrdersModal}
                className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[70vh]">
              {sortedOrders.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left text-gray-600">
                        <th className="px-3 py-2">Order ID</th>
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Total</th>
                        <th className="px-3 py-2">Payment</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Address</th>
                        <th className="px-3 py-2">Products</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {sortedOrders.map((o) => (
                        <tr key={o.orderId || o._id} className="align-top">
                          <td className="px-3 py-2">{o.orderId || o._id}</td>
                          <td className="px-3 py-2">
                            {o.createdAt
                              ? new Date(o.createdAt).toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="px-3 py-2">₹{o.totalAmount}</td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
                                o.paymentStatus === "paid"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
                                o.orderStatus === "delivered"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-sky-100 text-sky-700"
                              }`}
                            >
                              {o.orderStatus || o.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">
                            {o.address
                              ? `${o.address.fullName}, ${o.address.street}, ${o.address.city}, ${o.address.postcode}, ${o.address.country} (Phone: ${o.address.phone})`
                              : "N/A"}
                          </td>
                          <td className="px-3 py-2">
                            <div className="overflow-x-auto">
                              <table className="min-w-[400px] text-xs border border-gray-100">
                                <thead>
                                  <tr className="bg-gray-50 text-gray-600">
                                    <th className="px-2 py-1">Image</th>
                                    <th className="px-2 py-1">Name</th>
                                    <th className="px-2 py-1">Qty</th>
                                    <th className="px-2 py-1">Price</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {o.items?.map((item, idx) => (
                                    <tr key={idx}>
                                      <td className="px-2 py-1">
                                        <img
                                          src={
                                            getImageUrl(
                                              item.productId?.images?.[0]
                                            ) || "/placeholder.svg"
                                          }
                                          alt={item.productName}
                                          className="h-10 w-10 object-cover rounded"
                                          onError={(e) =>
                                            (e.currentTarget.src =
                                              "/placeholder.svg")
                                          }
                                        />
                                      </td>
                                      <td className="px-2 py-1">
                                        <div className="font-medium text-gray-800">
                                          {item.productName}
                                        </div>
                                        <div className="text-gray-500">
                                          Size: {item.size} | Color:{" "}
                                          {item.color}
                                        </div>
                                      </td>
                                      <td className="px-2 py-1">
                                        {item.quantity}
                                      </td>
                                      <td className="px-2 py-1">
                                        ₹{item.price}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState title="No orders found for this user." />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contacts Modal */}
      {contactsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-5xl rounded-lg bg-white shadow-lg">
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <h4 className="text-base font-semibold text-gray-800">
                User Contact Messages
              </h4>
              <button
                onClick={() => setContactsOpen(false)}
                className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[70vh]">
              {contacts.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left text-gray-600">
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Email</th>
                        <th className="px-3 py-2">Subject</th>
                        <th className="px-3 py-2">Message</th>
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {contacts.map((msg) => (
                        <tr key={msg._id}>
                          <td className="px-3 py-2">{msg.name}</td>
                          <td className="px-3 py-2">{msg.email}</td>
                          <td className="px-3 py-2">
                            {msg.subject || "No Subject"}
                          </td>
                          <td className="px-3 py-2">{msg.message}</td>
                          <td className="px-3 py-2">
                            {new Date(msg.createdAt).toLocaleString()}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
                                msg.read
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {msg.read ? "Read" : "Unread"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState title="No contact messages found for this user." />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ViewOrdersButton = ({ userId, onClick }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [allRead, setAllRead] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await ApiService.getOrdersByUser(userId);
        const orders = resp?.data?.orders || [];
        const unread = orders.filter((o) => !o.seenByAdmin).length;
        setUnreadCount(unread);
        setAllRead(orders.length > 0 && unread === 0);
      } catch (_) {}
    };
    load();
  }, [userId]);

  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 text-xs rounded border relative ${
        allRead
          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
          : "hover:bg-gray-50"
      }`}
    >
      View Orders
      {unreadCount > 0 ? (
        <span className="ml-2 inline-flex items-center justify-center text-[10px] px-1.5 py-0.5 rounded-full bg-red-500 text-white">
          {unreadCount}
        </span>
      ) : null}
      {allRead ? <span className="ml-2">✓</span> : null}
    </button>
  );
};

const ViewContactsButton = ({ email, onClick, refreshKey }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await ApiService.getContactsByEmail(email);
        const contacts = resp?.data?.contacts || [];
        const unread = contacts.filter((c) => !c.read).length;
        setUnreadCount(unread);
      } catch (_) {}
    };
    load();
  }, [email, refreshKey]);

  return (
    <button
      onClick={onClick}
      className="px-2 py-1 text-xs rounded border hover:bg-gray-50"
    >
      View Messages
      {unreadCount > 0 ? (
        <span className="ml-2 inline-flex items-center justify-center text-[10px] px-1.5 py-0.5 rounded-full bg-red-500 text-white">
          {unreadCount}
        </span>
      ) : null}
    </button>
  );
};

// TestimonialAdmin component + VideoAdmin
import { useRef } from "react";
import Video from "../../Pages/Video";

const VideoAdmin = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef();
  const descriptionRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [videoFileUrl, setVideoFileUrl] = useState("");

  const fetchVideos = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await ApiService.getVideos();
      const list = resp?.data?.videos || [];
      setVideos(list);
    } catch (e) {
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    let videoUrl = videoFileUrl;
    const description = descriptionRef.current.value;
    if (!videoUrl && fileInputRef.current.files.length > 0) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", fileInputRef.current.files[0]);
        const resp = await ApiService.uploadTestimonialVideo(formData);
        videoUrl =
          resp?.data?.data?.url ||
          resp?.data?.data?.secure_url ||
          resp?.data?.data?.fileUrl;
        setVideoFileUrl(videoUrl);
      } catch (e) {
        setError("Failed to upload video file");
        setUploading(false);
        setLoading(false);
        return;
      }
      setUploading(false);
    }
    if (!videoUrl) {
      setError("Please select a video file");
      setLoading(false);
      return;
    }
    try {
      await ApiService.addVideo({ videoUrl, description });
      setSuccess("Video added successfully");
      setVideoFileUrl("");
      fileInputRef.current.value = "";
      descriptionRef.current.value = "";
      fetchVideos();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to add video");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await ApiService.deleteVideo(id);
      setSuccess("Video deleted");
      fetchVideos();
    } catch (e) {
      setError("Failed to delete video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleAdd}
        className="flex flex-col md:flex-row gap-4 mb-6 items-end"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="border rounded px-3 py-2 w-full md:w-1/2"
        />
        <input
          ref={descriptionRef}
          type="text"
          placeholder="Description (optional)"
          className="border rounded px-3 py-2 w-full md:w-1/2"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          disabled={loading || uploading}
        >
          {uploading ? "Uploading..." : "Add Video"}
        </button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.length === 0 && <EmptyState title="No videos found." />}
        {videos.map((vid) => (
          <div
            key={vid._id}
            className="bg-gray-50 rounded shadow p-4 flex flex-col items-center"
          >
            <video
              src={vid.videoUrl}
              controls
              className="w-full h-56 rounded mb-2"
            />
            <div className="text-sm text-gray-700 mb-2">{vid.description}</div>
            <button
              onClick={() => handleDelete(vid._id)}
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-xs"
              disabled={loading}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {/* <div className="mt-8">
        <h4 className="text-base font-semibold text-gray-800 mb-2">
          Public View Preview
        </h4>
        <Video />
      </div> */}
    </div>
  );
};

const TestimonialAdmin = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef();
  const descriptionRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [videoFileUrl, setVideoFileUrl] = useState("");

  const fetchTestimonials = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await ApiService.getTestimonials();
      const list = resp?.data?.testimonials || [];
      setVideos(list);
    } catch (e) {
      setError("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    let videoUrl = videoFileUrl;
    const description = descriptionRef.current.value;
    if (!videoUrl && fileInputRef.current.files.length > 0) {
      // Upload video file to backend
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", fileInputRef.current.files[0]);
        // Use the correct API for testimonial video upload
        const resp = await ApiService.uploadTestimonialVideo(formData);
        videoUrl =
          resp?.data?.data?.url ||
          resp?.data?.data?.secure_url ||
          resp?.data?.data?.fileUrl;
        setVideoFileUrl(videoUrl);
      } catch (e) {
        setError("Failed to upload video file");
        setUploading(false);
        setLoading(false);
        return;
      }
      setUploading(false);
    }
    if (!videoUrl) {
      setError("Please select a video file");
      setLoading(false);
      return;
    }
    try {
      await ApiService.addTestimonial({ videoUrl, description });
      setSuccess("Testimonial added successfully");
      setVideoFileUrl("");
      fileInputRef.current.value = "";
      descriptionRef.current.value = "";
      fetchTestimonials();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to add testimonial");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await ApiService.deleteTestimonial(id);
      setSuccess("Testimonial deleted");
      fetchTestimonials();
    } catch (e) {
      setError("Failed to delete testimonial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleAdd}
        className="flex flex-col md:flex-row gap-4 mb-6 items-end"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="border rounded px-3 py-2 w-full md:w-1/2"
        />
        <input
          ref={descriptionRef}
          type="text"
          placeholder="Description (optional)"
          className="border rounded px-3 py-2 w-full md:w-1/2"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          disabled={loading || uploading}
        >
          {uploading ? "Uploading..." : "Add Video"}
        </button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.length === 0 && (
          <EmptyState title="No testimonial videos found." />
        )}
        {videos.map((vid) => (
          <div
            key={vid._id}
            className="bg-gray-50 rounded shadow p-4 flex flex-col items-center"
          >
            <video
              src={vid.videoUrl}
              controls
              className="w-full h-56 rounded mb-2"
            />
            <div className="text-sm text-gray-700 mb-2">{vid.description}</div>
            <button
              onClick={() => handleDelete(vid._id)}
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-xs"
              disabled={loading}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
