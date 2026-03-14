import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, X, Search } from 'lucide-react';
import { productService, categoryService } from '../services/api';
import ProductCard from '../components/ProductCard';
import SkeletonGrid from '../components/Skeleton';

const SORT_OPTIONS = [
  { value: 'default', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'discount', label: 'Best Discount' },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'default';
  const page = parseInt(searchParams.get('page') || '1');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 16 };
      if (category) params.category = category;
      if (search) params.search = search;
      if (sort !== 'default') params.sort = sort;

      const { data } = await productService.getAll(params);
      if (data.success) {
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('fetchProducts error:', err);
    } finally {
      setLoading(false);
    }
  }, [category, search, sort, page]);

  useEffect(() => {
    categoryService.getAll().then(({ data }) => {
      if (data.success) setCategories(data.categories);
    });
  }, []);

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, [fetchProducts]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const clearAll = () => setSearchParams({});

  const hasFilters = category || search || sort !== 'default';

  return (
    <div className="page-container py-4">
      <div className="flex gap-4">
        {/* Sidebar Filter - Desktop */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-white rounded-sm shadow-card p-4 sticky-top">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-flipkart-text-dark flex items-center gap-2">
                <SlidersHorizontal size={16} /> Filters
              </h3>
              {hasFilters && (
                <button onClick={clearAll} className="text-flipkart-blue text-xs font-medium hover:underline">
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="border-t pt-3 mb-3">
              <h4 className="text-sm font-semibold text-flipkart-text-dark mb-2 uppercase tracking-wide">Category</h4>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="cat" value="" checked={!category}
                    onChange={() => setParam('category', '')}
                    className="accent-flipkart-blue" />
                  <span className="text-sm group-hover:text-flipkart-blue transition-colors">All Categories</span>
                </label>
                {categories.map(c => (
                  <label key={c.id} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="cat" value={c.name} checked={category === c.name}
                      onChange={() => setParam('category', c.name)}
                      className="accent-flipkart-blue" />
                    <span className="text-sm group-hover:text-flipkart-blue transition-colors">{c.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div className="border-t pt-3">
              <h4 className="text-sm font-semibold text-flipkart-text-dark mb-2 uppercase tracking-wide">Sort By</h4>
              <div className="space-y-1.5">
                {SORT_OPTIONS.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="sort" value={opt.value} checked={sort === opt.value}
                      onChange={() => setParam('sort', opt.value)}
                      className="accent-flipkart-blue" />
                    <span className="text-sm group-hover:text-flipkart-blue transition-colors">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="bg-white rounded-sm shadow-card px-4 py-3 flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              {search ? (
                <h1 className="font-semibold text-flipkart-text-dark">
                  Results for "<span className="text-flipkart-blue">{search}</span>"
                </h1>
              ) : category ? (
                <h1 className="font-semibold text-flipkart-text-dark">{category}</h1>
              ) : (
                <h1 className="font-semibold text-flipkart-text-dark">All Products</h1>
              )}
              {pagination.total !== undefined && (
                <p className="text-xs text-flipkart-gray-dark">{pagination.total} results</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Active filters chips */}
              {category && (
                <span className="flex items-center gap-1 bg-blue-50 text-flipkart-blue text-xs font-medium px-2 py-1 rounded-full">
                  {category}
                  <button onClick={() => setParam('category', '')}><X size={12} /></button>
                </span>
              )}
              {sort !== 'default' && (
                <span className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                  {SORT_OPTIONS.find(o => o.value === sort)?.label}
                  <button onClick={() => setParam('sort', '')}><X size={12} /></button>
                </span>
              )}

              {/* Mobile filter toggle */}
              <button onClick={() => setFilterOpen(!filterOpen)}
                className="lg:hidden flex items-center gap-1.5 border border-gray-300 rounded px-3 py-1.5 text-sm font-medium hover:bg-gray-50">
                <SlidersHorizontal size={14} /> Filters
              </button>

              {/* Sort dropdown */}
              <div className="relative hidden sm:block">
                <select value={sort} onChange={e => setParam('sort', e.target.value)}
                  className="appearance-none border border-gray-300 rounded px-3 py-1.5 pr-7 text-sm bg-white cursor-pointer outline-none focus:border-flipkart-blue">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Mobile Filter Panel */}
          {filterOpen && (
            <div className="lg:hidden bg-white rounded-sm shadow-card p-4 mb-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-bold mb-2">Category</h4>
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input type="radio" name="mcat" value="" checked={!category}
                        onChange={() => setParam('category', '')} className="accent-flipkart-blue" />
                      All
                    </label>
                    {categories.map(c => (
                      <label key={c.id} className="flex items-center gap-1.5 text-sm cursor-pointer">
                        <input type="radio" name="mcat" value={c.name} checked={category === c.name}
                          onChange={() => { setParam('category', c.name); setFilterOpen(false); }}
                          className="accent-flipkart-blue" />
                        {c.name}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-2">Sort By</h4>
                  <div className="space-y-1">
                    {SORT_OPTIONS.map(opt => (
                      <label key={opt.value} className="flex items-center gap-1.5 text-sm cursor-pointer">
                        <input type="radio" name="msort" value={opt.value} checked={sort === opt.value}
                          onChange={() => { setParam('sort', opt.value); setFilterOpen(false); }}
                          className="accent-flipkart-blue" />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <SkeletonGrid count={12} />
          ) : products.length === 0 ? (
            <div className="bg-white rounded-sm shadow-card p-16 text-center">
              <p className="text-6xl mb-4">🔍</p>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-sm text-gray-400 mb-4">Try different search terms or filters</p>
              <button onClick={clearAll}
                className="btn-blue px-6 py-2 text-sm">Clear All Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setParam('page', page - 1)}
                    className="px-4 py-2 border rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
                    Previous
                  </button>
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                    const pg = i + 1;
                    return (
                      <button key={pg}
                        onClick={() => setParam('page', pg)}
                        className={`w-9 h-9 rounded text-sm font-medium transition-colors
                          ${pg === page ? 'bg-flipkart-blue text-white' : 'border hover:bg-gray-50'}`}>
                        {pg}
                      </button>
                    );
                  })}
                  <button
                    disabled={page >= pagination.totalPages}
                    onClick={() => setParam('page', page + 1)}
                    className="px-4 py-2 border rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
