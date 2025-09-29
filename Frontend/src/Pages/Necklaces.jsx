import Banner from '@/components/Banner'
import ProductGrid from '@/components/ProductGrid'
import { products } from '@/data/resource'
import React from 'react'
import gif from '/assets/Images/banner/necklace1.png'
const Necklaces = () => {
  
  return (
    <div className="overflow-hidden">
      {/* Full-width banner */}
      <div className="container-fluid">
        <Banner src={gif} title="Necklaces" />
      </div>

      {/* Max-width content */}
      <div className="max-w-[1550px] mx-auto">
        <ProductGrid allproducts={products.Necklace} />
      </div>
    </div>
  );
}

export default Necklaces
