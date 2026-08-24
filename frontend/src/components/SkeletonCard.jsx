import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-box" style={{ height: '160px', width: '100%' }}></div>
      <div className="skeleton-box" style={{ height: '14px', width: '40%' }}></div>
      <div className="skeleton-box" style={{ height: '20px', width: '90%' }}></div>
      <div className="skeleton-box" style={{ height: '14px', width: '70%' }}></div>
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton-box" style={{ height: '24px', width: '35%' }}></div>
        <div className="skeleton-box" style={{ height: '32px', width: '30%' }}></div>
      </div>
    </div>
  );
}
