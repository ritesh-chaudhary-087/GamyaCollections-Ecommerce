import Banner from '@/components/Banner'
import ProductGrid from '@/components/ProductGrid'
import { products } from '@/data/resource'
import React from 'react'
import banner from '/assets/Images/banner/errings.png'
const Earrings = () => {
 
  return (
    <div className="overflow-hidden">
      {/* Full-width banner */}
      <div className="container-fluid">
        <Banner src={banner} title="Earrings" />
      </div>

      {/* Max-width content */}
      <div className="max-w-[1550px] mx-auto">
        <ProductGrid allproducts={products.Earrings} />
      </div>
    </div>
  );
  
}


export default Earrings
