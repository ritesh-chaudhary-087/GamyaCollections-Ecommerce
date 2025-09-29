import React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "./ProductCard";
import ApiService from "./API/api-service";

const BestsalerSection = () => {
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestsellers = async () => {
      setLoading(true);
      try {
        // Fetch ALL products (remove bestseller filter)
        const resp = await ApiService.getProducts(1, 12);
        const rows = Array.isArray(resp?.data?.rows)
          ? resp.data.rows
          : Array.isArray(resp?.data?.data)
          ? resp.data.data
          : Array.isArray(resp?.data?.data?.rows)
          ? resp.data.data.rows
          : [];
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
        setBestsellerProducts(mapped);
      } catch (error) {
        setBestsellerProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBestsellers();
  }, []);

  return (
    <div className="container m-auto py-14 flex flex-col justify-center items-center h-auto px-9 md:px-8 lg:px-16 overflow-hidden gap-4">
      <h2 className="text-4xl font-serif text-amber-900 mb-3">Products</h2>
      {loading ? (
        <div className="text-amber-600 py-8">Loading bestsellers...</div>
      ) : (
        <Carousel opts={{ align: "start" }} className="w-[90%] ">
          <CarouselContent className="pl-4  ">
            {bestsellerProducts.map((product, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/4 sm:basis-1/1 w-full h-auto p-0 ml-2 m-0"
              >
                <div className="p-2">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </div>
  );
};

export default BestsalerSection;
