const CATEGORY_IMAGES = {
  Electronics: '/images/electronics.svg',
  'Home & Kitchen': '/images/home_kitchen.svg',
  'Apparel & Clothing': '/images/apparel.svg',
  'Books & Stationery': '/images/books.svg',
  'Beauty & Personal Care': '/images/beauty.svg'
};

// More specific keywords must come first (e.g. headphone before phone).
const TYPE_RULES = [
  { keys: ['headphone', 'earphone', 'earbuds'], image: '/images/headphones.svg' },
  { keys: ['smartphone', 'iphone', 'android phone'], image: '/images/smartphone.svg' },
  { keys: ['smartwatch', 'watch'], image: '/images/smartwatch.svg' },
  { keys: ['speaker'], image: '/images/speaker.svg' },
  { keys: ['tablet', 'ipad'], image: '/images/tablet.svg' },
  { keys: ['camera'], image: '/images/camera.svg' },
  { keys: ['keyboard'], image: '/images/keyboard.svg' },
  { keys: ['monitor'], image: '/images/monitor.svg' },
  { keys: ['laptop'], image: '/images/laptop.svg' }
];

function haystack(product) {
  const tags = Array.isArray(product?.tags) ? product.tags.join(' ') : '';
  return `${product?.title || ''} ${product?.description || ''} ${tags}`.toLowerCase();
}

export function getProductImage(product) {
  if (!product) return '/images/placeholder.svg';

  const text = haystack(product);

  for (const rule of TYPE_RULES) {
    if (rule.keys.some((key) => text.includes(key))) {
      return rule.image;
    }
  }

  // Standalone "phone" (not headphone, already checked above)
  if (/\bphone\b/.test(text) || text.includes(' phone')) {
    return '/images/smartphone.svg';
  }

  if (product.category && CATEGORY_IMAGES[product.category]) {
    return CATEGORY_IMAGES[product.category];
  }

  return product.image_path || '/images/placeholder.svg';
}
