import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiService from "@/components/API/api-service";
import ProductCard from "@/components/ProductCard";

export default function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // fetch category details (optional, to show name)
        try {
          const catResp = await ApiService.getCategoryById(id);
          setCategory(catResp?.data?.data || catResp?.data);
        } catch (_) {}

        // fetch products filtered by category
        const prodResp = await ApiService.getProducts(1, 48, { category: id });
        const rows = prodResp?.data?.rows || prodResp?.data?.data?.rows || [];

        // Map backend shape to ProductCard expected props for this page
        const mapped = rows.map((p) => ({
          id: p._id,
          name: p.product_name,
          price: Number(p.discount_price || p.price || 0),
          originalPrice: Number(p.price || 0),
          image: (p.images && p.images[0]) || "/placeholder.svg",
          isNew: false,
        }));
        setProducts(mapped);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-amber-800 mb-6">
        {category?.category_name || "Category"}
      </h1>
      {loading ? (
        <div>Loading...</div>
      ) : products.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div>No products found in this category.</div>
      )}
    </div>
  );
}
