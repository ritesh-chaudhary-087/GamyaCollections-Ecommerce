import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="relative bg-white rounded-lg overflow-hidden shadow-md">
      {/* Product Image */}
      <div className="relative h-64 overflow-hidden bg-amber-100">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {/* Labels */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-teal-600 text-white text-xs font-bold px-2 py-1">
              NEW
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 bg-white">
        <h3 className="text-amber-900 font-medium capitalize text-lg mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-amber-800 font-bold">
            ₹{product.price.toFixed(2)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-amber-500 text-sm line-through">
              ₹{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
        <button
          className="bg-white text-amber-900 px-4 py-2 rounded-full font-medium"
          onClick={handleClick}
        >
          Quick View
        </button>
      </div>
    </div>
  );
};

// PropTypes validation
ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    isNew: PropTypes.bool.isRequired,
    discount: PropTypes.number,
  }).isRequired,
};

export default ProductCard;