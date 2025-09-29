// Collection names configuration
// This allows different projects to use different collection names
// by setting environment variables

const getCollectionName = (defaultName) => {
  const projectPrefix = process.env.PROJECT_PREFIX;
  // If no prefix provided, use default collection name as-is
  if (!projectPrefix || projectPrefix.trim() === "") {
    return defaultName;
  }
  return `${projectPrefix}_${defaultName}`;
};

module.exports = {
  // User related collections
  users: getCollectionName("users"),
  carts: getCollectionName("carts"),
  orders: getCollectionName("orders"),
  contacts: getCollectionName("contacts"),

  // Product related collections
  products: getCollectionName("products"),
  categories: getCollectionName("categories"),
  subcategories: getCollectionName("subcategories"),
  reviews: getCollectionName("reviews"),

  // Other collections
  issues: getCollectionName("issues"),
};
