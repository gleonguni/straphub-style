// Utility functions to dynamically extract product information from Shopify data
// This enables future-proofed, smart product details based on title, description, and tags

export interface ProductAnalysis {
  materials: string[];
  brands: string[];
  features: string[];
  isWaterproof: boolean;
  isSportStyle: boolean;
  isLuxury: boolean;
  isCasual: boolean;
  hasQuickRelease: boolean;
  watchSizes: string[];
}

// Detect materials from product text
const MATERIAL_PATTERNS = {
  silicone: /silicone|silicon|rubber/i,
  leather: /leather|genuine leather|pu leather|vegan leather|faux leather/i,
  metal: /metal|stainless steel|titanium|aluminum|aluminium|steel/i,
  nylon: /nylon|woven nylon|fabric|canvas|nato/i,
  milanese: /milanese|mesh|magnetic loop/i,
  resin: /resin|plastic|polymer/i,
  ceramic: /ceramic/i,
  wood: /wood|wooden|bamboo/i,
};

// Detect watch brands from product text
const BRAND_PATTERNS = {
  apple: /apple\s*watch|iwatch|series\s*\d|ultra\s*\d|apple/i,
  samsung: /samsung|galaxy\s*watch/i,
  garmin: /garmin|fenix|forerunner|venu|vivoactive/i,
  fitbit: /fitbit|versa|sense|charge/i,
  google: /google|pixel\s*watch/i,
  huawei: /huawei|honor|gt\s*\d/i,
  amazfit: /amazfit|gts|gtr|bip/i,
  fossil: /fossil/i,
  polar: /polar/i,
  suunto: /suunto/i,
  withings: /withings/i,
  xiaomi: /xiaomi|mi\s*band|mi\s*watch/i,
};

// Detect features from product text
const FEATURE_PATTERNS = {
  quickRelease: /quick\s*release|quick-release|easy\s*change|spring\s*bar/i,
  waterproof: /waterproof|water\s*resistant|swim|swimming|ip68|atm|diving/i,
  sport: /sport|athletic|gym|fitness|workout|running|exercise/i,
  luxury: /luxury|premium|designer|elegant|executive|dress/i,
  casual: /casual|everyday|daily|office|work/i,
  magnetic: /magnetic|magnet/i,
  breathable: /breathable|ventilated|perforated|air|holes/i,
  adjustable: /adjustable|one\s*size|universal\s*fit/i,
};

// Extract watch sizes (e.g., 38mm, 40mm, 42mm, 44mm, etc.)
const SIZE_PATTERN = /(\d{2,3})\s*mm/gi;

/**
 * Analyze a product's title and description to extract meaningful attributes
 */
export function analyzeProduct(title: string, description?: string): ProductAnalysis {
  const text = `${title} ${description || ''}`.toLowerCase();
  
  const materials = Object.entries(MATERIAL_PATTERNS)
    .filter(([_, pattern]) => pattern.test(text))
    .map(([material]) => material);
    
  const brands = Object.entries(BRAND_PATTERNS)
    .filter(([_, pattern]) => pattern.test(text))
    .map(([brand]) => brand);
    
  const features = Object.entries(FEATURE_PATTERNS)
    .filter(([_, pattern]) => pattern.test(text))
    .map(([feature]) => feature);
    
  // Extract sizes
  const sizeMatches = text.match(SIZE_PATTERN) || [];
  const watchSizes = [...new Set(sizeMatches.map(s => s.toLowerCase()))];
  
  return {
    materials,
    brands,
    features,
    isWaterproof: features.includes('waterproof'),
    isSportStyle: features.includes('sport'),
    isLuxury: features.includes('luxury'),
    isCasual: features.includes('casual'),
    hasQuickRelease: features.includes('quickRelease'),
    watchSizes,
  };
}

/**
 * Generate dynamic compatibility text based on product analysis
 */
export function getCompatibilityText(title: string, description?: string): string {
  const analysis = analyzeProduct(title, description);
  
  // Apple Watch specific
  if (analysis.brands.includes('apple')) {
    const sizes = analysis.watchSizes;
    let sizeText = '';
    
    // Group sizes into categories
    const smallSizes = sizes.filter(s => ['38mm', '40mm', '41mm'].some(sz => s.includes(sz.replace('mm', ''))));
    const largeSizes = sizes.filter(s => ['42mm', '44mm', '45mm', '49mm'].some(sz => s.includes(sz.replace('mm', ''))));
    
    if (smallSizes.length > 0 || largeSizes.length > 0) {
      const sizeList = [...new Set([...smallSizes, ...largeSizes])].join(', ');
      sizeText = ` (${sizeList})`;
    }
    
    return `Apple Watch Series 1-11, SE, Ultra 1/2${sizeText}`;
  }
  
  // Samsung specific
  if (analysis.brands.includes('samsung')) {
    return 'Samsung Galaxy Watch 4/5/6/7, Classic & Ultra';
  }
  
  // Garmin specific
  if (analysis.brands.includes('garmin')) {
    return 'Garmin Fenix, Forerunner, Venu & Vivoactive';
  }
  
  // Fitbit specific
  if (analysis.brands.includes('fitbit')) {
    return 'Fitbit Versa, Sense & Charge Series';
  }
  
  // Google Pixel specific
  if (analysis.brands.includes('google')) {
    return 'Google Pixel Watch 1 & 2';
  }
  
  // Huawei specific
  if (analysis.brands.includes('huawei')) {
    return 'Huawei Watch GT Series & Honor';
  }
  
  // Amazfit specific
  if (analysis.brands.includes('amazfit')) {
    return 'Amazfit GTS, GTR & Bip Series';
  }
  
  // Multiple brands detected
  if (analysis.brands.length > 1) {
    const brandNames = analysis.brands.map(b => b.charAt(0).toUpperCase() + b.slice(1)).join(', ');
    return `Compatible with ${brandNames} Watches`;
  }
  
  // Fallback - check for size-based compatibility
  if (analysis.watchSizes.length > 0) {
    return `Universal ${analysis.watchSizes.join('/')} Watch Bands`;
  }
  
  return 'Multiple Smartwatch Brands';
}

export interface ProCon {
  type: 'pro' | 'con';
  text: string;
}

/**
 * Generate dynamic pros and cons based on product analysis
 */
export function getProductProsAndCons(title: string, description?: string): ProCon[] {
  const analysis = analyzeProduct(title, description);
  const prosAndCons: ProCon[] = [];
  
  // Material-based pros and cons
  if (analysis.materials.includes('silicone')) {
    prosAndCons.push({ type: 'pro', text: 'Waterproof and sweat-resistant — ideal for sports and swimming' });
    prosAndCons.push({ type: 'pro', text: 'Lightweight and flexible for all-day comfort' });
    prosAndCons.push({ type: 'pro', text: 'Easy to clean and maintain' });
    prosAndCons.push({ type: 'con', text: 'May not suit formal or business occasions' });
  } else if (analysis.materials.includes('leather')) {
    prosAndCons.push({ type: 'pro', text: 'Stylish and sophisticated — perfect for any occasion' });
    prosAndCons.push({ type: 'pro', text: 'Develops unique patina over time for a personalised look' });
    prosAndCons.push({ type: 'pro', text: 'Comfortable and breathable against skin' });
    prosAndCons.push({ type: 'con', text: 'Not recommended for water exposure or intense workouts' });
  } else if (analysis.materials.includes('metal') || analysis.materials.includes('milanese')) {
    prosAndCons.push({ type: 'pro', text: 'Premium look that elevates your watch instantly' });
    prosAndCons.push({ type: 'pro', text: 'Extremely durable — built to last years' });
    prosAndCons.push({ type: 'pro', text: 'Suitable for both casual and formal wear' });
    prosAndCons.push({ type: 'con', text: 'Slightly heavier than fabric or silicone options' });
  } else if (analysis.materials.includes('nylon')) {
    prosAndCons.push({ type: 'pro', text: 'Ultra-lightweight and breathable fabric' });
    prosAndCons.push({ type: 'pro', text: 'Quick-drying and perfect for active lifestyles' });
    prosAndCons.push({ type: 'pro', text: 'Comfortable for extended wear' });
    prosAndCons.push({ type: 'con', text: 'May show wear over time with heavy use' });
  } else {
    // Default pros and cons
    prosAndCons.push({ type: 'pro', text: 'High-quality materials for lasting durability' });
    prosAndCons.push({ type: 'pro', text: 'Perfect fit guarantee with easy installation' });
    prosAndCons.push({ type: 'pro', text: 'Comfortable for all-day wear' });
    prosAndCons.push({ type: 'con', text: 'May require brief break-in period for optimal comfort' });
  }
  
  // Add feature-based pros
  if (analysis.hasQuickRelease && prosAndCons.length < 4) {
    prosAndCons.splice(2, 0, { type: 'pro', text: 'Quick-release pins for effortless strap changes' });
  }
  
  if (analysis.isWaterproof && !analysis.materials.includes('silicone') && prosAndCons.length < 4) {
    prosAndCons.splice(2, 0, { type: 'pro', text: 'Water-resistant design for worry-free wear' });
  }
  
  // Ensure we have exactly 3 pros and 1 con
  const pros = prosAndCons.filter(p => p.type === 'pro').slice(0, 3);
  const cons = prosAndCons.filter(p => p.type === 'con').slice(0, 1);
  
  return [...pros, ...cons];
}

/**
 * Get material display name
 */
export function getMaterialDisplayName(title: string, description?: string): string {
  const analysis = analyzeProduct(title, description);
  
  if (analysis.materials.includes('leather')) return 'Genuine Leather';
  if (analysis.materials.includes('silicone')) return 'Premium Silicone';
  if (analysis.materials.includes('milanese')) return 'Milanese Mesh';
  if (analysis.materials.includes('metal')) return 'Stainless Steel';
  if (analysis.materials.includes('nylon')) return 'Woven Nylon';
  if (analysis.materials.includes('resin')) return 'Durable Resin';
  if (analysis.materials.includes('ceramic')) return 'Premium Ceramic';
  
  return 'Premium Quality';
}

/**
 * Get brand display name
 */
export function getBrandDisplayName(title: string, description?: string): string {
  const analysis = analyzeProduct(title, description);
  
  if (analysis.brands.includes('apple')) return 'Apple Watch';
  if (analysis.brands.includes('samsung')) return 'Samsung Galaxy';
  if (analysis.brands.includes('garmin')) return 'Garmin';
  if (analysis.brands.includes('fitbit')) return 'Fitbit';
  if (analysis.brands.includes('google')) return 'Google Pixel';
  if (analysis.brands.includes('huawei')) return 'Huawei';
  if (analysis.brands.includes('amazfit')) return 'Amazfit';
  
  return 'Universal';
}
