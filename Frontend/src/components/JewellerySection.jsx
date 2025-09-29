import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ApiService from "./API/api-service";
import { useNavigate } from "react-router-dom";

export default function JewellerySection() {
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [activeCategoryName, setActiveCategoryName] = useState("");
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const resp = await ApiService.getCategories(1, 50);
        const rows = Array.isArray(resp?.data?.rows)
          ? resp.data.rows
          : Array.isArray(resp?.data?.data)
          ? resp.data.data
          : Array.isArray(resp?.data?.data?.rows)
          ? resp.data.data.rows
          : [];
        console.log("Categories loaded:", rows);
        setCategories(rows);
        if (rows.length) {
          setActiveCategoryId(rows[0]._id);
          setActiveCategoryName(rows[0].category_name);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      if (!activeCategoryId) return;
      setProductsLoading(true);
      try {
        console.log("Loading products for category:", activeCategoryId);
        const resp = await ApiService.getProducts(1, 12, {
          category: activeCategoryId,
        });
        const rows = Array.isArray(resp?.data?.rows)
          ? resp.data.rows
          : Array.isArray(resp?.data?.data)
          ? resp.data.data
          : Array.isArray(resp?.data?.data?.rows)
          ? resp.data.data.rows
          : [];
        console.log("Products loaded:", rows);
        const mapped = Array.isArray(rows)
          ? rows.map((p) => ({
              id: p._id,
              name: p.product_name,
              price: Number(p.discount_price || p.price || 0),
              originalPrice: Number(p.price || 0),
              image: (p.images && p.images[0]) || "/placeholder.svg",
              isNew: false,
            }))
          : [];
        console.log("Mapped products:", mapped);
        setCategoryProducts(mapped);
      } catch (error) {
        console.error("Error loading products:", error);
        setCategoryProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    loadProducts();
  }, [activeCategoryId]);

  const handleCategoryChange = (category) => {
    if (!category) return;
    setActiveCategoryId(category._id);
    setActiveCategoryName(category.category_name);
  };

  return (
    <section className="container mx-auto py-16 px-14 sm:w-[1180px] overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-amber-900 mb-3">
          Jewellery Category
        </h2>
        <p className="text-amber-800 max-w-2xl mx-auto">
          Imitation Jewelry offers elegant necklaces, earrings, bangles, and
          anklets, crafted with intricate designs and premium materials to
          elevate any outfit.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center mb-12">
        <div className="w-full overflow-x-auto flex justify-center">
          <div className="inline-flex border-b border-amber-200 w-full md:w-auto justify-center md:justify-start gap-2 md:gap-4 px-4">
            {(Array.isArray(categories) ? categories : []).map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryChange(category)}
                className={`whitespace-nowrap px-4 md:px-6 py-2 md:py-3 text-sm md:text-lg font-medium transition-colors duration-300 ${
                  activeCategoryId === category._id
                    ? "text-amber-800 border-b-2 border-amber-600"
                    : "text-amber-700 hover:text-amber-900"
                }`}
              >
                {category.category_name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading || productsLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="text-amber-600">Loading products...</div>
          </div>
        ) : categoryProducts.length > 0 ? (
          categoryProducts.slice(0, 4).map((product, index) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <div className="text-amber-600">
              No products found in this category.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
