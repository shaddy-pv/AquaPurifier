interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  category?: string;
  features?: string[];
}

export const getRelatedProducts = (
  currentProduct: Product,
  allProducts: Product[],
  limit: number = 3
): Product[] => {
  // Filter out current product
  const otherProducts = allProducts.filter(p => p.id !== currentProduct.id);
  
  // Score products based on similarity
  const scoredProducts = otherProducts.map(product => {
    let score = 0;
    
    // Same category gets high score
    if (product.category === currentProduct.category) {
      score += 50;
    }
    
    // Similar price range (within 30%)
    const priceDiff = Math.abs(product.price - currentProduct.price) / currentProduct.price;
    if (priceDiff < 0.3) {
      score += 30;
    }
    
    // Similar rating
    const ratingDiff = Math.abs(product.rating - currentProduct.rating);
    if (ratingDiff < 0.5) {
      score += 20;
    }
    
    // Shared features
    if (currentProduct.features && product.features) {
      const sharedFeatures = currentProduct.features.filter(f =>
        product.features?.some(pf => pf.toLowerCase().includes(f.toLowerCase()))
      );
      score += sharedFeatures.length * 10;
    }
    
    return { product, score };
  });
  
  // Sort by score and return top products
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.product);
};

export const getFrequentlyBoughtTogether = (
  productId: string,
  allProducts: Product[]
): Product[] => {
  // In a real app, this would use purchase history data
  // For now, return random products
  return allProducts
    .filter(p => p.id !== productId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
};

export const getTrendingProducts = (
  allProducts: Product[],
  limit: number = 6
): Product[] => {
  // Sort by rating and return top products
  return [...allProducts]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};
