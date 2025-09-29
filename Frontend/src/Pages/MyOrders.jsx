"use client"
import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { BASEURL, getImageUrl } from "../components/Comman/CommanConstans"
import { useAuth } from "../components/AuthContext/AuthContext"
import { toast } from "react-toastify"
import { FiDownload, FiTruck, FiClock, FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi"
import ApiService from "../components/API/api-service"

const MyOrders = () => {
  const { isAuthenticated, user, userToken } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage] = useState(10)
  const [authChecked, setAuthChecked] = useState(false)

  const statusStyles = {
    delivered: "bg-green-100 text-green-800",
    shipped: "bg-blue-100 text-blue-800",
    processing: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    default: "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <FiCheckCircle className="inline-block mr-1" />;
      case 'shipped': return <FiTruck className="inline-block mr-1" />;
      case 'processing': return <FiLoader className="inline-block mr-1 animate-spin" />;
      case 'cancelled': return <FiXCircle className="inline-block mr-1" />;
      default: return <FiClock className="inline-block mr-1" />;
    }
  }

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to login');
        toast.error("Please login to view your orders");
        return;
      }
      
      console.log('Fetching orders with cookie-based authentication');
      
      try {
        const response = await ApiService.getUserOrders(currentPage, itemsPerPage);
        console.log('API Response:', response);
        
        if (response && response.success) {
          const orders = response.orders || [];
          const pages = response.pages_count || 1;
          
          console.log('Orders from API:', orders);
          setOrders(orders);
          setTotalPages(pages);
        }
      } catch (apiError) {
        console.error('Direct API Error:', {
          message: apiError.message,
          response: apiError.response?.data,
          status: apiError.response?.status
        });
        throw apiError;
      }
    } catch (error) {
      console.error("Error in fetchOrders:", error);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [userToken, currentPage, itemsPerPage]);

  const handleDownloadReceipt = async (orderId) => {
    try {
      const response = await ApiService.downloadReceipt(orderId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error('Failed to download receipt');
    }
  };

  const handleTrackOrder = (trackingNumber) => {
    if (trackingNumber) {
      window.open(`https://shiprocket.in/tracking/${trackingNumber}`, "_blank")
    } else {
      toast.info("Tracking number not available")
    }
  }

  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, user, userToken });
    
    // Debug: Check storage and context
    console.log('=== AUTH DEBUG ===');
    console.log('localStorage:', Object.keys(localStorage).map(key => ({ 
      key, 
      value: key === 'token' ? '*****' : localStorage[key] 
    })));
    
    console.log('sessionStorage:', Object.keys(sessionStorage).map(key => ({ 
      key, 
      value: key === 'token' ? '*****' : sessionStorage[key] 
    })));
    
    console.log('Auth context user:', user);
    console.log('==================');
    
    setAuthChecked(true);
  }, [isAuthenticated, user, userToken]);

  useEffect(() => {
    if (!authChecked) return;
    
    console.log('Auth check:', { 
      isAuthenticated, 
      hasUser: !!user,
      currentPage, 
      itemsPerPage 
    });
    
    if (!isAuthenticated) {
      console.log('User not authenticated. Redirecting to login.');
      toast.warning("Please login to view your orders");
      return;
    }
    
    console.log('User is authenticated, fetching orders...');
    fetchOrders().then(() => {
      console.log('fetchOrders completed');
    }).catch(error => {
      console.error('Error in fetchOrders:', error);
      toast.error(error.message || "Failed to load orders");
    });
  }, [isAuthenticated, user, authChecked, currentPage, itemsPerPage, fetchOrders]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.orderId || order._id.slice(-8).toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {order.items?.slice(0, 3).map((item, idx) => (
                            <img
                              key={idx}
                              className="w-10 h-10 rounded-full border-2 border-white"
                              src={item.productId?.images?.[0] ? 
                                   getImageUrl(item.productId.images[0]) : 
                                   '/placeholder.svg'}
                              alt={item.productName}
                              onError={(e) => {
                                e.target.src = '/placeholder.svg'
                              }}
                            />
                          ))}
                          {order.items?.length > 3 && (
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                              +{order.items.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{order.totalAmount || '0.00'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${statusStyles[order.status?.toLowerCase()] || statusStyles.default}`}>
                          {getStatusIcon(order.status?.toLowerCase())}
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDownloadReceipt(order.orderId || order._id)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Download Invoice"
                          >
                            <FiDownload className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleTrackOrder(order.trackingNumber)}
                            className="text-blue-600 hover:text-blue-900 ml-2"
                            title="Track Order"
                          >
                            <FiTruck className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, orders.length + (currentPage - 1) * itemsPerPage)}
                    </span>{' '}
                    of <span className="font-medium">{totalPages * itemsPerPage}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      &larr; Previous
                    </button>
                    <div className="flex items-center px-4">
                      <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next &rarr;
                      <span className="sr-only">Next</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyOrders