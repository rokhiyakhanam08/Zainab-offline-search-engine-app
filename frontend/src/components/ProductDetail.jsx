import React from 'react';
import { ArrowLeft, Heart, Tag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import ProductCard from './ProductCard';
import { getProductImage } from '../utils/productImage';

export default function ProductDetail({
  product,
  onBack,
  isFavorite,
  onToggleFavorite,
  featuredProducts,
  onSelectProduct
}) {
  if (!product) return null;

  const related = featuredProducts
    .filter(item => item.id !== product.id && item.category === product.category)
    .slice(0, 4);

  return (
    <div>
      {/* Navigation Back Link */}
      <button
        onClick={onBack}
        className="btn-secondary"
        style={{ marginBottom: '1.5rem', padding: '0.45rem 0.9rem' }}
      >
        <ArrowLeft size={16} /> Back to Search
      </button>

      {/* Main Detail View Card */}
      <div className="product-detail-view">
        {/* Image Preview Box */}
        <div className="detail-img-box">
          <img
            src={getProductImage(product)}
            alt={product.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/placeholder.svg';
            }}
          />
        </div>

        {/* Product Information */}
        <div className="detail-meta-group">
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {product.brand}
            </div>
            <h1 className="detail-title">{product.title}</h1>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
              <span className="tag-badge" style={{ background: 'var(--primary-subtle)', color: 'var(--primary-hover)', fontWeight: 600 }}>
                {product.category}
              </span>
              <span className="tag-badge">SKU: {product.sku}</span>
            </div>
          </div>

          <div className="detail-price">${Number(product.price).toFixed(2)}</div>

          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Product Description
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {product.description}
            </p>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Tags &amp; Keywords
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {product.tags.map((tag, i) => (
                  <span key={i} className="tag-badge">
                    <Tag size={12} /> #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              className={`btn-secondary ${isFavorite ? 'active' : ''}`}
              style={{ flex: 1, padding: '0.75rem', justifyContent: 'center', borderColor: isFavorite ? '#fca5a5' : 'var(--border-color)', color: isFavorite ? '#ef4444' : 'var(--text-main)' }}
              onClick={() => onToggleFavorite(product)}
            >
              <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} />
              {isFavorite ? 'Saved in Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Store Service Guarantees */}
          <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ShieldCheck size={16} /> Authentic Item</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Truck size={16} /> Fast Dispatch</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><RefreshCw size={16} /> 30-Day Returns</span>
          </div>
        </div>
      </div>

      {/* Related Products Recommendation */}
      {related.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h3 className="section-title" style={{ marginBottom: '1.25rem' }}>Related Products</h3>
          <div className="products-grid">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onSelect={onSelectProduct}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
