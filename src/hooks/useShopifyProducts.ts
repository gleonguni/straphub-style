import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductByHandle, ShopifyProduct } from '@/lib/shopify';

export function useShopifyProducts(limit: number = 50, query?: string) {
  return useQuery({
    queryKey: ['shopify-products', limit, query],
    queryFn: () => fetchProducts(limit, query),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useShopifyProduct(handle: string) {
  return useQuery({
    queryKey: ['shopify-product', handle],
    queryFn: () => fetchProductByHandle(handle),
    enabled: !!handle,
    staleTime: 1000 * 60 * 5,
  });
}

// Helper to get first available variant
export function getFirstAvailableVariant(product: ShopifyProduct['node']) {
  return product.variants.edges.find(v => v.node.availableForSale)?.node 
    || product.variants.edges[0]?.node;
}

// Helper to get product image
export function getProductImage(product: ShopifyProduct['node']): string {
  return product.images.edges[0]?.node.url || '/placeholder.svg';
}
