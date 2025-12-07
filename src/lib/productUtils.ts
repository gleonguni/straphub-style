// Utility functions to dynamically extract product information from Shopify data
// This enables future-proofed, smart product details based on title, description, and tags

/**
 * Normalize text for parsing - convert hyphens/underscores to spaces
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

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
  seriesNumbers: string[];
  isAccessory: boolean;
  accessoryType: string | null;
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
  glass: /tempered glass|glass|screen protector/i,
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

// Accessory type patterns
const ACCESSORY_PATTERNS = {
  screenProtector: /screen\s*protector|tempered\s*glass|protective\s*film|glass\s*protector/i,
  case: /case|cover|bumper|armor|protective\s*case/i,
  charger: /charger|charging\s*dock|charging\s*cable|charging\s*stand/i,
  stand: /stand|dock|holder|cradle/i,
  cleaningKit: /cleaning|cleaner|tool\s*kit/i,
};

// Extract watch sizes (e.g., 38mm, 40mm, 42mm, 44mm, etc.) - handles various formats
const SIZE_PATTERN = /(\d{2})\s*(?:mm)?/gi;
const SERIES_PATTERN = /series\s*(\d+)/gi;
const IWATCH_SERIES_PATTERN = /iwatch\s*(?:series\s*)?(\d+)/gi;

/**
 * Check if product is an accessory (not a strap/band)
 */
export function checkIsAccessory(title: string, description?: string): boolean {
  const text = `${title} ${description || ''}`.toLowerCase();
  const accessoryKeywords = [
    'protector', 'screen protector', 'case', 'cover', 'charger', 'charging', 
    'stand', 'dock', 'holder', 'cleaning', 'tool', 'adapter', 'cable',
    'tempered glass', 'film', 'bumper', 'armor', 'shield'
  ];
  const strapKeywords = ['strap', 'band', 'bracelet', 'wristband', 'watchband', 'loop'];
  
  const hasAccessoryKeyword = accessoryKeywords.some(kw => text.includes(kw));
  const hasStrapKeyword = strapKeywords.some(kw => text.includes(kw));
  
  return hasAccessoryKeyword && !hasStrapKeyword;
}

/**
 * Detect accessory type from title
 */
export function getAccessoryType(title: string): string | null {
  const text = title.toLowerCase();
  
  for (const [type, pattern] of Object.entries(ACCESSORY_PATTERNS)) {
    if (pattern.test(text)) {
      return type;
    }
  }
  return null;
}

/**
 * Analyze a product's title and description to extract meaningful attributes
 */
export function analyzeProduct(title: string, description?: string): ProductAnalysis {
  const text = normalizeText(`${title} ${description || ''}`);
  
  const materials = Object.entries(MATERIAL_PATTERNS)
    .filter(([_, pattern]) => pattern.test(text))
    .map(([material]) => material);
    
  const brands = Object.entries(BRAND_PATTERNS)
    .filter(([_, pattern]) => pattern.test(text))
    .map(([brand]) => brand);
    
  const features = Object.entries(FEATURE_PATTERNS)
    .filter(([_, pattern]) => pattern.test(text))
    .map(([feature]) => feature);
  
  // Extract watch sizes - look for 2-digit numbers that are valid watch sizes
  const watchSizes: string[] = [];
  // Match patterns like "40mm", "41 mm", "40 41 44 45mm", "40/41/44/45mm"
  const sizePattern = /\b(3[89]|4[0-79])\s*(?:mm)?\b/g;
  let sizeMatch;
  while ((sizeMatch = sizePattern.exec(text)) !== null) {
    const num = sizeMatch[1];
    // Valid Apple Watch sizes
    if (['38', '40', '41', '42', '44', '45', '46', '47', '49'].includes(num)) {
      if (!watchSizes.includes(`${num}mm`)) {
        watchSizes.push(`${num}mm`);
      }
    }
  }
  
  // Extract series numbers - look for "series" followed by numbers
  const seriesNumbers: string[] = [];
  
  // Pattern 1: "series 9 8 7 6 5" or "series 9, 8, 7" etc
  const seriesBlockMatch = text.match(/series\s+([\d\s,\/&]+)/i);
  if (seriesBlockMatch) {
    const numbersStr = seriesBlockMatch[1];
    const nums = numbersStr.match(/\d+/g);
    if (nums) {
      nums.forEach(n => {
        const num = parseInt(n);
        if (num >= 1 && num <= 11 && !seriesNumbers.includes(n)) {
          seriesNumbers.push(n);
        }
      });
    }
  }
  
  // Pattern 2: "iwatch series X" or "iwatch X"
  const iwatchMatch = text.match(/iwatch\s+(?:series\s+)?([\d\s,\/&]+)/i);
  if (iwatchMatch) {
    const numbersStr = iwatchMatch[1];
    const nums = numbersStr.match(/\d+/g);
    if (nums) {
      nums.forEach(n => {
        const num = parseInt(n);
        if (num >= 1 && num <= 11 && !seriesNumbers.includes(n)) {
          seriesNumbers.push(n);
        }
      });
    }
  }
  
  // Sort series numbers
  const sortedSeries = [...new Set(seriesNumbers)].sort((a, b) => parseInt(a) - parseInt(b));
  
  // Sort sizes by number
  const sortedSizes = [...new Set(watchSizes)].sort((a, b) => parseInt(a) - parseInt(b));
  
  // Check if it's an accessory
  const isAccessory = checkIsAccessory(title, description);
  const accessoryType = isAccessory ? getAccessoryType(title) : null;
  
  return {
    materials,
    brands,
    features,
    isWaterproof: features.includes('waterproof'),
    isSportStyle: features.includes('sport'),
    isLuxury: features.includes('luxury'),
    isCasual: features.includes('casual'),
    hasQuickRelease: features.includes('quickRelease'),
    watchSizes: sortedSizes,
    seriesNumbers: sortedSeries,
    isAccessory,
    accessoryType,
  };
}

/**
 * Generate dynamic compatibility text based on product analysis
 */
export function getCompatibilityText(title: string, description?: string): string {
  const analysis = analyzeProduct(title, description);
  const text = normalizeText(`${title} ${description || ''}`);
  
  // Check for SE mention
  const hasSE = /\bse\b/i.test(text);
  // Check for Ultra mention
  const hasUltra = /\bultra\b/i.test(text);
  
  // Apple Watch specific
  if (analysis.brands.includes('apple')) {
    const sizes = analysis.watchSizes;
    const series = analysis.seriesNumbers;
    
    let modelText = '';
    let sizeText = '';
    
    // Build series/model text from extracted numbers
    if (series.length > 0) {
      const seriesNums = series.map(s => parseInt(s)).filter(n => n >= 1 && n <= 11);
      if (seriesNums.length > 0) {
        // Check if consecutive range (e.g., 1-9)
        const sorted = [...seriesNums].sort((a, b) => a - b);
        const min = sorted[0];
        const max = sorted[sorted.length - 1];
        const isConsecutive = sorted.length === (max - min + 1);
        
        if (isConsecutive && sorted.length >= 3) {
          modelText = `Series ${min}-${max}`;
        } else {
          modelText = `Series ${sorted.join('/')}`;
        }
      }
    }
    
    // Add SE if mentioned
    if (hasSE) {
      modelText = modelText ? `${modelText}, SE` : 'SE';
    }
    
    // Add Ultra if mentioned
    if (hasUltra) {
      modelText = modelText ? `${modelText}, Ultra` : 'Ultra';
    }
    
    // Build size text
    if (sizes.length > 0) {
      sizeText = ` (${sizes.join('/')})`;
    }
    
    // If no specific series/model detected, say "All Apple Watches"
    if (!modelText) {
      return `All Apple Watches${sizeText}`;
    }
    
    return `Apple Watch ${modelText}${sizeText}`;
  }
  
  // Samsung specific
  if (analysis.brands.includes('samsung')) {
    const sizes = analysis.watchSizes;
    let sizeText = sizes.length > 0 ? ` (${sizes.join('/')})` : '';
    
    // Parse entire text for all Galaxy Watch models including Classic variants
    const models: string[] = [];
    
    // Look for all numbers after "galaxy watch" including separated mentions
    // Patterns: "galaxy watch 7 6 classic", "galaxy watch 8/8c", "galaxy watch 7 / 6 / 6 classic"
    const galaxyWatchSection = text.match(/galaxy\s*watch[^a-z]*(?:[\d\s\/,c]+(?:classic)?)+/gi);
    
    if (galaxyWatchSection) {
      const sectionText = galaxyWatchSection.join(' ');
      
      // Find all numbers in the section
      const allNums = sectionText.match(/\d+/g);
      if (allNums) {
        const processedNums = new Set<number>();
        
        allNums.forEach(n => {
          const num = parseInt(n);
          if (num >= 1 && num <= 10 && !processedNums.has(num)) {
            processedNums.add(num);
            
            // Check if this number has a Classic variant
            // Patterns: "6c", "6 c", "6 classic", "6c", "watch 6 classic"
            const classicPatterns = [
              new RegExp(`\\b${n}\\s*c\\b`, 'i'),
              new RegExp(`\\b${n}\\s+classic\\b`, 'i'),
              new RegExp(`\\b${n}c\\b`, 'i'),
            ];
            
            const hasClassic = classicPatterns.some(p => p.test(text));
            
            if (hasClassic) {
              models.push(`${n}c`);
            } else {
              models.push(n);
            }
          }
        });
      }
    }
    
    // Check for Ultra variant  
    const hasUltra = /ultra/i.test(text);
    
    // Sort models numerically, keeping 'c' suffix
    const sortedModels = [...new Set(models)].sort((a, b) => {
      const numA = parseInt(a.replace('c', ''));
      const numB = parseInt(b.replace('c', ''));
      if (numA !== numB) return numB - numA; // Descending order (newer first)
      return a.includes('c') ? 1 : -1; // Regular before classic
    });
    
    let result = 'Samsung Galaxy Watch';
    if (sortedModels.length > 0) {
      result += ` ${sortedModels.join('/')}`;
    }
    if (hasUltra) {
      result += ' Ultra';
    }
    if (sizeText) {
      result += sizeText;
    }
    
    // If no specific model, say "All Samsung Galaxy Watches"
    if (sortedModels.length === 0 && !hasUltra) {
      return `All Samsung Galaxy Watches${sizeText}`;
    }
    
    return result;
  }
  
  // Garmin specific
  if (analysis.brands.includes('garmin')) {
    return 'All Garmin Watches';
  }
  
  // Fitbit specific
  if (analysis.brands.includes('fitbit')) {
    return 'All Fitbit Devices';
  }
  
  // Google Pixel specific
  if (analysis.brands.includes('google')) {
    return 'Google Pixel Watch 1 & 2';
  }
  
  // Huawei specific
  if (analysis.brands.includes('huawei')) {
    return 'All Huawei Watches';
  }
  
  // Amazfit specific
  if (analysis.brands.includes('amazfit')) {
    return 'All Amazfit Watches';
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
  
  // Check if it's an accessory first
  if (analysis.isAccessory) {
    const accessoryType = analysis.accessoryType;
    
    if (accessoryType === 'screenProtector') {
      prosAndCons.push({ type: 'pro', text: 'Keeps original touch responsiveness intact' });
      prosAndCons.push({ type: 'pro', text: 'Protects against scratches and daily wear' });
      prosAndCons.push({ type: 'pro', text: 'Crystal clear visibility with anti-fingerprint coating' });
      prosAndCons.push({ type: 'con', text: 'Requires careful bubble-free installation' });
      return prosAndCons;
    }
    
    if (accessoryType === 'case') {
      prosAndCons.push({ type: 'pro', text: 'Full protection against bumps and drops' });
      prosAndCons.push({ type: 'pro', text: 'Slim fit that doesn\'t add bulk' });
      prosAndCons.push({ type: 'pro', text: 'Easy snap-on installation' });
      prosAndCons.push({ type: 'con', text: 'May need removal for some charging docks' });
      return prosAndCons;
    }
    
    if (accessoryType === 'charger' || accessoryType === 'stand') {
      prosAndCons.push({ type: 'pro', text: 'Convenient bedside or desk charging' });
      prosAndCons.push({ type: 'pro', text: 'Keeps your watch at a perfect viewing angle' });
      prosAndCons.push({ type: 'pro', text: 'Stable non-slip base design' });
      prosAndCons.push({ type: 'con', text: 'Requires nearby power outlet' });
      return prosAndCons;
    }
    
    // Generic accessory pros/cons
    prosAndCons.push({ type: 'pro', text: 'Enhances your smartwatch experience' });
    prosAndCons.push({ type: 'pro', text: 'High-quality materials for durability' });
    prosAndCons.push({ type: 'pro', text: 'Perfect fit guaranteed' });
    prosAndCons.push({ type: 'con', text: 'Accessory only — watch not included' });
    return prosAndCons;
  }
  
  // Material-based pros and cons for straps
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
  
  // For accessories, return specific material info
  if (analysis.isAccessory) {
    if (analysis.materials.includes('glass')) return 'Tempered Glass';
    if (analysis.accessoryType === 'screenProtector') return 'Tempered Glass';
    if (analysis.accessoryType === 'case') return 'Hard Polycarbonate';
    if (analysis.accessoryType === 'charger') return 'ABS Plastic';
    if (analysis.accessoryType === 'stand') return 'Aluminum Alloy';
    return 'Premium Materials';
  }
  
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

/**
 * Get product specifications - smarter detection for accessories
 */
export function getProductSpecifications(title: string, description?: string): Array<{ label: string; value: string }> {
  const analysis = analyzeProduct(title, description);
  const specs: Array<{ label: string; value: string }> = [];
  
  // Always add material
  specs.push({ label: 'Material', value: getMaterialDisplayName(title, description) });
  
  // Always add compatibility
  specs.push({ label: 'Compatibility', value: getBrandDisplayName(title, description) });
  
  if (analysis.isAccessory) {
    // Accessory-specific specs
    if (analysis.accessoryType === 'screenProtector') {
      specs.push({ label: 'Hardness', value: '9H Tempered Glass' });
      specs.push({ label: 'Transparency', value: '99% HD Clear' });
    } else if (analysis.accessoryType === 'case') {
      specs.push({ label: 'Protection Level', value: 'Full Coverage' });
      specs.push({ label: 'Charging Compatible', value: 'Yes' });
    } else if (analysis.accessoryType === 'charger' || analysis.accessoryType === 'stand') {
      specs.push({ label: 'Input', value: 'USB-C / USB-A' });
      specs.push({ label: 'Fast Charge', value: 'Supported' });
    }
  } else {
    // Strap specs
    specs.push({ label: 'Closure Type', value: analysis.materials.includes('milanese') ? 'Magnetic Clasp' : 'Pin & Tuck' });
    
    // Water resistance based on material
    let waterResistance = 'Yes';
    if (analysis.materials.includes('leather')) {
      waterResistance = 'Splash Resistant';
    } else if (analysis.materials.includes('nylon')) {
      waterResistance = 'Quick-Dry';
    }
    specs.push({ label: 'Water Resistant', value: waterResistance });
  }
  
  return specs;
}