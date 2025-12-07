import { toast } from "sonner";

// Shopify API Configuration
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = '0tjg4d-90.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = 'bc33a8f7d797bfd941f55621579bb4c0';

// Types
export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    descriptionHtml: string;
    handle: string;
    vendor: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    compareAtPriceRange?: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          compareAtPrice?: {
            amount: string;
            currencyCode: string;
          } | null;
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
          image?: {
            url: string;
            altText: string | null;
          } | null;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

export interface CartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  variantImage?: string; // Add variant-specific image
  price: {
    amount: string;
    currencyCode: string;
  };
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

// GraphQL Queries
const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          descriptionHtml
          handle
          vendor
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
                image {
                  url
                  altText
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      vendor
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// API Helper Function
export async function storefrontApiRequest<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Your Shopify store needs to be upgraded to a paid plan to access the API.",
    });
    throw new Error('Shopify payment required');
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  return data;
}

// Fetch Products
export async function fetchProducts(first: number = 50, query?: string): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest<{
    data: {
      products: {
        edges: ShopifyProduct[];
      };
    };
  }>(PRODUCTS_QUERY, { first, query });
  
  return data.data.products.edges;
}

// Fetch Single Product by Handle
export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct['node'] | null> {
  const data = await storefrontApiRequest<{
    data: {
      productByHandle: ShopifyProduct['node'] | null;
    };
  }>(PRODUCT_BY_HANDLE_QUERY, { handle });
  
  return data.data.productByHandle;
}

// Create Checkout
export async function createStorefrontCheckout(items: CartItem[]): Promise<string> {
  console.log('Creating checkout for items:', items.map(i => ({ variantId: i.variantId, quantity: i.quantity })));
  
  const lines = items.map(item => ({
    quantity: item.quantity,
    merchandiseId: item.variantId,
  }));

  console.log('Cart lines:', lines);

  const cartData = await storefrontApiRequest<{
    data: {
      cartCreate: {
        cart: {
          id: string;
          checkoutUrl: string;
        } | null;
        userErrors: Array<{ field: string[]; message: string }>;
      };
    };
  }>(CART_CREATE_MUTATION, {
    input: { lines },
  });

  console.log('Cart API response:', JSON.stringify(cartData, null, 2));

  if (cartData.data.cartCreate.userErrors.length > 0) {
    const errorMsg = cartData.data.cartCreate.userErrors.map(e => e.message).join(', ');
    console.error('Cart creation errors:', errorMsg);
    throw new Error(`Cart creation failed: ${errorMsg}`);
  }

  const cart = cartData.data.cartCreate.cart;
  
  if (!cart?.checkoutUrl) {
    console.error('No checkout URL in response:', cart);
    throw new Error('No checkout URL returned from Shopify');
  }

  // Add channel parameter for online store checkout (avoids password page)
  const url = new URL(cart.checkoutUrl);
  url.searchParams.set('channel', 'online_store');
  const finalUrl = url.toString();
  
  console.log('Final checkout URL:', finalUrl);
  return finalUrl;
}

// Helper to format price
export function formatPrice(amount: string, currencyCode: string = 'GBP'): string {
  const num = parseFloat(amount);
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currencyCode,
  }).format(num);
}

// Helper to calculate discount percentage
export function calculateDiscount(price: string, compareAtPrice?: string | null): number {
  if (!compareAtPrice) return 0;
  const priceNum = parseFloat(price);
  const compareNum = parseFloat(compareAtPrice);
  if (compareNum <= priceNum) return 0;
  return Math.round(((compareNum - priceNum) / compareNum) * 100);
}

// Helper to check if a product is an accessory (not a strap)
export function isAccessory(title: string, description?: string): boolean {
  const text = `${title} ${description || ''}`.toLowerCase();
  const accessoryKeywords = [
    'protector', 'screen protector', 'case', 'cover', 'charger', 'charging', 
    'stand', 'dock', 'holder', 'cleaning', 'tool', 'adapter', 'cable',
    'tempered glass', 'film', 'bumper', 'armor', 'shield'
  ];
  const strapKeywords = ['strap', 'band', 'bracelet', 'wristband', 'watchband'];
  
  const hasAccessoryKeyword = accessoryKeywords.some(kw => text.includes(kw));
  const hasStrapKeyword = strapKeywords.some(kw => text.includes(kw));
  
  // If it has accessory keywords but no strap keywords, it's an accessory
  return hasAccessoryKeyword && !hasStrapKeyword;
}

// Helper to extract device compatibility from title
export function getDeviceCompatibility(title: string): { brand: string; models: string[] } {
  const text = title.toLowerCase();
  
  // Apple Watch
  if (/apple|iwatch/.test(text)) {
    const models: string[] = [];
    
    // Extract series numbers
    const seriesMatch = text.match(/series\s*([\d\s,\/]+)/i);
    if (seriesMatch) {
      const nums = seriesMatch[1].match(/\d+/g);
      if (nums) models.push(...nums.map(n => `Series ${n}`));
    }
    
    if (/\bse\b/i.test(text)) models.push('SE');
    if (/\bultra\b/i.test(text)) models.push('Ultra');
    
    return { brand: 'apple', models };
  }
  
  // Samsung Galaxy Watch
  if (/samsung|galaxy\s*watch/.test(text)) {
    const models: string[] = [];
    
    // Extract Galaxy Watch numbers with Classic/Ultra variants
    const galaxyMatch = text.match(/galaxy\s*watch\s*([\d\s\/,]+)/i);
    if (galaxyMatch) {
      const nums = galaxyMatch[1].match(/\d+/g);
      if (nums) {
        nums.forEach(n => {
          models.push(n);
          // Check for Classic variant for this specific number
          const classicPattern = new RegExp(`galaxy\\s*watch\\s*${n}\\s*classic|${n}\\s*classic|${n}c`, 'i');
          if (classicPattern.test(text)) {
            models.push(`${n} Classic`);
          }
        });
      }
    }
    
    if (/\bultra\b/i.test(text)) models.push('Ultra');
    
    return { brand: 'samsung', models: [...new Set(models)] };
  }
  
  // Garmin
  if (/garmin/i.test(text)) {
    return { brand: 'garmin', models: [] };
  }
  
  // Fitbit
  if (/fitbit/i.test(text)) {
    return { brand: 'fitbit', models: [] };
  }
  
  // Google Pixel
  if (/pixel\s*watch|google/i.test(text)) {
    return { brand: 'google', models: [] };
  }
  
  return { brand: 'universal', models: [] };
}