import Banner from '@/components/Banner'
import ProductGrid from '@/components/ProductGrid'
import { products } from '@/data/resource'
import banner from '/assets/Images/banner/bangales2.png'
import React from 'react'

const Bangels = () => {
  return (
    < div className='container-fluid overflow-hidden'>
      <Banner src={banner} title='Bangels'/>
      {/* <ProductGrid allproducts={products.Bangels}/> */}
    </div>
  )
}

export default Bangels
