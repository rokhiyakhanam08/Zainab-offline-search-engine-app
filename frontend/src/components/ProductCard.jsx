import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { getProductImage } from '../utils/productImage';

export default function ProductCard({ product, onSelect, isFavorite, onToggleFavorite }) {
  if (!product) return null;

  return (
    <div className="product-card">
      {/* Score Tag if search match score is available */}
      {product.score !== undefined && (
        <span className="score-tag-top">
          {Math.round(product.score * 100)}% Match
        </span>
      )}

      {/* Favorite Button */}
      <button
        className={`fav-btn-top ${isFavorite ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(product);
        }}
        aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} />
      </button>

      {/* Product Image Container */}
      <div className="card-img-container" onClick={() => onSelect(product)}>
        <img
          src={getProductImage(product)}
          alt={product.title}
          className="card-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/placeholder.svg';
          }}
        />
      </div>

      {/* Product Information */}
      <div className="card-brand">{product.brand}</div>
      <h3 className="card-title" onClick={() => onSelect(product)}>
        {product.title}
      </h3>
      <p className="card-desc">{product.description}</p>

      {/* Footer & Pricing */}
      <div className="card-footer">
        <div className="card-price">${Number(product.price).toFixed(2)}</div>
        <button
          className="btn-secondary"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
          onClick={() => onSelect(product)}
        >
          Details <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
