import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-sm shadow-card overflow-hidden">
    <div className="skeleton h-48 w-full" />
    <div className="p-3 space-y-2">
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/3 rounded" />
      <div className="skeleton h-5 w-1/2 rounded" />
      <div className="skeleton h-8 w-full rounded mt-2" />
    </div>
  </div>
);

export const BannerSkeleton = () => (
  <div className="skeleton w-full h-48 sm:h-64 rounded-sm" />
);

const SkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export default SkeletonGrid;
