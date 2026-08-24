import React, { useState, useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { useSearch } from './hooks/useSearch';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import SearchResults from './components/SearchResults';
import ProductDetail from './components/ProductDetail';
import CategoriesPage from './components/CategoriesPage';
import FavoritesPage from './components/FavoritesPage';
import AboutPage from './components/AboutPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
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
  } = useSearch();

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, selectedProduct]);

  // Android Hardware Back Button Handling
  useEffect(() => {
    let listenerHandler = null;

    if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform()) {
      CapApp.addListener('backButton', () => {
        if (activeTab === 'detail') {
          setActiveTab('search');
        } else if (activeTab !== 'home') {
          setActiveTab('home');
        } else {
          CapApp.minimizeApp();
        }
      }).then(handler => {
        listenerHandler = handler;
      });
    }

    return () => {
      if (listenerHandler && listenerHandler.remove) {
        listenerHandler.remove();
      }
    };
  }, [activeTab]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActiveTab('detail');
  };

  const handleSelectCategory = (catName) => {
    setCategoryFilter(catName);
    setActiveTab('search');
  };

  const handleResetFilters = () => {
    setBrandFilter('');
    setCategoryFilter('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('relevance');
    setQuery('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favorites.length}
        query={query}
        setQuery={setQuery}
      />

      {/* Main Content Area */}
      <main className="page-wrapper">
        {activeTab === 'home' && (
          <HomePage
            query={query}
            setQuery={setQuery}
            setActiveTab={setActiveTab}
            categoriesList={categoriesList}
            featuredProducts={featuredProducts}
            onSelectCategory={handleSelectCategory}
            onSelectProduct={handleSelectProduct}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            systemStats={systemStats}
            triggerImport={triggerImport}
            loading={loading}
          />
        )}

        {activeTab === 'search' && (
          <SearchResults
            query={query}
            results={results}
            loading={loading}
            error={error}
            brandFilter={brandFilter}
            setBrandFilter={setBrandFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categoriesList={categoriesList}
            onSelectProduct={handleSelectProduct}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onResetFilters={handleResetFilters}
          />
        )}

        {activeTab === 'detail' && (
          <ProductDetail
            product={selectedProduct}
            onBack={() => setActiveTab('search')}
            isFavorite={isFavorite(selectedProduct?.id)}
            onToggleFavorite={toggleFavorite}
            featuredProducts={featuredProducts}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesPage
            categoriesList={categoriesList}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesPage
            favorites={favorites}
            onSelectProduct={handleSelectProduct}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        setCategoryFilter={setCategoryFilter}
      />
    </div>
  );
}
