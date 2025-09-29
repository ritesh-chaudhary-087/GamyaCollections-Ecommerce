import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "./ProductCard";
import { ListFilter } from "lucide-react";

export default function ProductGrid({ allproducts }) {
  const initialProducts = allproducts;

  const [products, setProducts] = useState(initialProducts);
  const [sortOrder, setSortOrder] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 2500]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2500);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State to manage filter visibility

  useEffect(() => {
    const prices = initialProducts.map(product => product.price);
    setMinPrice(Math.min(...prices));
    setMaxPrice(Math.max(...prices));
    setPriceRange([Math.min(...prices), Math.max(...prices)]);
  }, [initialProducts]);

  useEffect(() => {
    let filteredProducts = [...initialProducts].filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    if (sortOrder === "price-asc") filteredProducts.sort((a, b) => a.price - b.price);
    if (sortOrder === "price-desc") filteredProducts.sort((a, b) => b.price - a.price);
    if (sortOrder === "name-asc") filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    if (sortOrder === "discount") filteredProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    setProducts(filteredProducts);
  }, [sortOrder, priceRange, initialProducts]);

  return (
    <div className="container-fluid mx-auto px-4 py-8 bg-amber-50">
      
      
      {/* Filter Icon for Mobile */}
      <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold text-amber-800 mb-6">Featured Products</h1>
      <div className="block lg:hidden mb-4">
        <ListFilter onClick={() => setIsFilterOpen(!isFilterOpen)} />
      </div>
      </div>
      

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
        {/* Filter Section (Always visible on Desktop, toggle on Mobile) */}
        <div className={`lg:block bg-white p-4 rounded-lg shadow-sm mb-6 ${isFilterOpen ? 'block' : 'hidden'} lg:mb-0 lg:col-span-1`}>
          <h2 className="text-lg font-semibold text-amber-800 mb-4">Filters</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Default sorting" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default sorting</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="discount">Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</label>
              <Slider defaultValue={[minPrice, maxPrice]} min={minPrice} max={maxPrice} step={50} value={priceRange} onValueChange={setPriceRange} className="py-4" />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3 overflow-y-auto max-h-[calc(100vh-200px)] hide-scrollbar px-10 "> {/* Set max height for scrolling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
          {products.length === 0 && <div className="text-center py-12"><p className="text-lg text-gray-600">No products match your filters.</p></div>}
        </div>
      </div>
    </div>
  );
}