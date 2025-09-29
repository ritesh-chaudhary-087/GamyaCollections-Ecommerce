import React from 'react'

const Banner = ({src}) => {
  return (
    <div className='container-fluid w-screen '>
      <div className='bg-cover bg-center w-full'>
        <img src={src} alt="" srcset="" className='bg-cover w-full '/>
      </div>
    </div>
  )
}

export default Banner
