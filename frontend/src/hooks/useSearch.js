import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'zainab_favorites_v1';
const RECENT_KEY = 'zainab_recent_searches_v1';

export function getApiBaseUrl() {
  if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform()) {
    return import.meta.env.VITE_API_URL || 'http://10.45.44.152:8000';
  }
  return import.meta.env.VITE_API_URL || '';
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filters & Sorting
  const [brandFilter, setBrandFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  // Backend Stats & Summaries
  const [systemStats, setSystemStats] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Local Storage State
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favorites]);

  // Save recent searches to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recentSearches));
    } catch (e) {
      console.error('Failed to save recent searches', e);
    }
  }, [recentSearches]);

  // Fetch initial metadata on mount
  useEffect(() => {
    const apiBase = getApiBaseUrl();

    fetch(`${apiBase}/api/health`)
      .then(res => res.json())
      .then(data => setSystemStats(data))
      .catch(() => {});

    fetch(`${apiBase}/api/products/categories`)
      .then(res => res.json())
      .then(data => setCategoriesList(data))
      .catch(() => {});

    fetch(`${apiBase}/api/products/featured?limit=8`)
      .then(res => res.json())
      .then(data => setFeaturedProducts(data))
      .catch(() => {});
  }, []);

  // Native 300ms Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      if (query.trim()) {
        addRecentSearch(query.trim());
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  // Execute Search request
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchResults() {
      if (!debouncedQuery.trim() && !brandFilter && !categoryFilter) {
        setResults([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          q: debouncedQuery.trim() || '*',
          limit: '24'
        });
        if (brandFilter) params.append('brand', brandFilter);
        if (categoryFilter) params.append('category', categoryFilter);
        if (minPrice) params.append('min_price', minPrice);
        if (maxPrice) params.append('max_price', maxPrice);
        if (sortBy) params.append('sort_by', sortBy);

        const apiBase = getApiBaseUrl();
        const response = await fetch(`${apiBase}/api/products/search?${params}`, { signal });
        
        if (!response.ok) {
          throw new Error(`Search request failed with status ${response.status}`);
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'An unexpected error occurred during search.');
          setResults([]);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchResults();

    return () => controller.abort();
  }, [debouncedQuery, brandFilter, categoryFilter, minPrice, maxPrice, sortBy]);

  // Recent Searches helpers
  const addRecentSearch = (term) => {
    if (!term || term.trim() === '*') return;
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== term.toLowerCase());
      return [term, ...filtered].slice(0, 6);
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Favorites helpers
  const toggleFavorite = useCallback((product) => {
    setFavorites(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [product, ...prev];
      }
    });
  }, []);

  const isFavorite = useCallback((productId) => {
    return favorites.some(item => item.id === productId);
  }, [favorites]);

  const triggerImport = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/products/import`, { method: 'POST' });
      if (!res.ok) throw new Error('Import failed');
      const data = await res.json();
      
      const healthRes = await fetch(`${apiBase}/api/health`);
      const healthData = await healthRes.json();
      setSystemStats(healthData);
      
      const catRes = await fetch(`${apiBase}/api/products/categories`);
      const catData = await catRes.json();
      setCategoriesList(catData);

      return data;
    } catch (err) {
      setError(err.message || 'Database seeding failed.');
    } finally {
      setLoading(false);
    }
  };

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    brandFilter,
    setBrandFilter,
    categoryFilter,
    setCategoryFilter,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    sortBy,
    setSortBy,
    systemStats,
    categoriesList,
    featuredProducts,
    favorites,
    toggleFavorite,
    isFavorite,
    recentSearches,
    clearRecentSearches,
    triggerImport
  };
}
