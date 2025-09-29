import { Link } from "react-router-dom"


const Success = () => {
  return (
    <>
      <div className="container mx-auto px-4 pt-36">
        <div className="flex justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-lg w-full">
            <div className="mb-6 flex justify-center">
              <i className="fas fa-check-circle text-green-500 text-6xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your order is placed successfully
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase! Your order has been confirmed and will
              be processed shortly.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/">
                <button className="bg-[#8A3212] hover:bg-[#6f290f] text-white px-5 py-2 rounded-lg transition">
                  Continue Shopping
                </button>
              </Link>
              <Link to="/myOrders">
                <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition">
                  Check Your Order
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
    </>
  )
}

export default Success
