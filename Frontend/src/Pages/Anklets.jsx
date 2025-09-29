
import Banner from '@/components/Banner'
import ProductGrid from '@/components/ProductGrid'
import { products } from '@/data/resource'
import React from 'react'
import gif from '/assets/Images/banner/ancklet.png'
const Anklets = () => {
  
  return (
    <div className="overflow-hidden">
      {/* Full-width banner */}
      <div className="container-fluid">
        <Banner src={gif} title="Anklets" />
      </div>

      {/* Max-width content */}
      <div className="max-w-[1550px] mx-auto">
        <ProductGrid allproducts={products.Anklets} />
      </div>
    </div>
  );
}

export default Anklets
