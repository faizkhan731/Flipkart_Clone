

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ArrowRight, Zap,
  Laptop, Footprints, Smartphone, Tv, BookOpen,
  Headphones, Shirt, Dumbbell, Watch, Camera,
  Refrigerator, Sofa, Gamepad2, Sparkles
} from 'lucide-react';
import { productService, categoryService } from '../services/api';
import ProductCard from '../components/ProductCard';
import CategoryList from '../components/CategoryList';
import SkeletonGrid, { BannerSkeleton } from '../components/Skeleton';

// Real Flipkart-style banners with actual product images from Unsplash
const BANNERS = [
  {
    id: 1,
    // tag: '🔥 BIG BILLION DAYS',
    title: 'Electronics Sale',
    subtitle: 'Laptops, Phones & more',
    discount: 'Up to 80% OFF',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&q=80',
    link: '/products?category=Electronics',
    cta: 'Shop Now',
    overlay: 'from-blue-900/80 via-blue-800/40 to-transparent',
    badge: 'bg-yellow-400 text-gray-900',
  },
  {
    id: 2,
    // tag: '👗 FASHION WEEK',
    title: 'Trendy Styles',
    subtitle: 'Tops, Jeans, Shoes & more',
    discount: 'Up to 70% OFF',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&q=80',
    link: '/products?category=Fashion',
    cta: 'Shop Fashion',
    overlay: 'from-pink-900/80 via-pink-700/40 to-transparent',
    badge: 'bg-white text-pink-700',
  },
  {
    id: 3,
    // tag: '📱 MOBILE FEST',
    title: 'Smartphones',
    subtitle: 'iPhone, Samsung, OnePlus',
    discount: 'Up to 40% OFF',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80',
    link: '/products?category=Mobiles',
    cta: 'Explore Phones',
    overlay: 'from-indigo-900/85 via-indigo-800/50 to-transparent',
    badge: 'bg-green-400 text-gray-900',
  },
  {
    id: 4,
    // tag: '💻 TECH DEALS',
    title: 'Laptops & Gadgets',
    subtitle: 'MacBook, Dell, Sony & more',
    discount: 'Up to 50% OFF',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80',
    link: '/products?category=Electronics',
    cta: 'Shop Laptops',
    overlay: 'from-gray-900/85 via-gray-800/50 to-transparent',
    badge: 'bg-orange-400 text-white',
  },
  {
    id: 5,
    // tag: '🏠 HOME SALE',
    title: 'Appliances & Furniture',
    subtitle: 'Refrigerators, ACs, Sofas',
    discount: 'Up to 45% OFF',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80',
    link: '/products?category=Appliances',
    cta: 'Shop Home',
    overlay: 'from-emerald-900/80 via-emerald-800/40 to-transparent',
    badge: 'bg-yellow-300 text-gray-900',
  },
];
const DEALS = [
  { label: "Mobiles", discount: "40% OFF", Icon: Smartphone, cat: "Mobiles" },
  { label: "Electronics", discount: "50% OFF", Icon: Laptop, cat: "Electronics" },
  { label: "Fashion", discount: "60% OFF", Icon: Shirt, cat: "Fashion" },
  { label: "Appliances", discount: "30% OFF", Icon: Refrigerator, cat: "Appliances" },
  { label: "Furniture", discount: "45% OFF", Icon: Sofa, cat: "Furniture" },
  { label: "Gaming", discount: "35% OFF", Icon: Gamepad2, cat: "Gaming" },
  { label: "Fitness", discount: "25% OFF", Icon: Dumbbell, cat: "Fitness" },
  { label: "Books", discount: "20% OFF", Icon: BookOpen, cat: "Books" },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => goTo((c) => (c + 1) % BANNERS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const goTo = (fn) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(typeof fn === 'function' ? fn : () => fn);
      setAnimating(false);
    }, 200);
  };

  const b = BANNERS[current];

  return (
    // <div className="relative overflow-hidden rounded-sm shadow-card" style={{ height: '260px' }}>
    <div className="relative overflow-hidden rounded-sm shadow-card h-40 sm:h-52 md:h-64">
      {/* Background Image */}
      < div
        className={`absolute inset-0 transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`
        }
        style={{
          backgroundImage: `url(${b.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Dark gradient overlay — left side text readable */}
      <div className={`absolute inset-0 bg-gradient-to-r ${b.overlay}`} />

      {/* Content */}
      <div className={`relative h-full flex items-center px-8 sm:px-14 transition-all duration-300 ${animating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
        {/* <div className="text-white max-w-sm"> */}
        <div className="text-white max-w-xs sm:max-w-sm">

          {/* Tag */}
          {/* <div className={`inline-block ${b.badge} text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wide shadow`}>
            {b.tag}
          </div> */}

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight drop-shadow-lg">
            {b.title}
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-white/85 mt-1 font-medium drop-shadow">
            {b.subtitle}
          </p>

          {/* Discount */}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xl sm:text-2xl font-black text-yellow-300 drop-shadow">
              {b.discount}
            </span>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => navigate(b.link)}
            className="mt-4 bg-white text-gray-900 hover:bg-yellow-400 font-bold text-sm px-6 py-2.5 rounded-full transition-all active:scale-95 shadow-lg flex items-center gap-2"
          >
            {b.cta}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={() => goTo((c) => (c - 1 + BANNERS.length) % BANNERS.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg transition-all backdrop-blur-sm"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => goTo((c) => (c + 1) % BANNERS.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg transition-all backdrop-blur-sm"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${i === current
              ? 'bg-white w-6 h-2'
              : 'bg-white/50 hover:bg-white/70 w-2 h-2'
              }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      {/* <div className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm font-medium">
        {current + 1} / {BANNERS.length}
      </div> */}
    </div >
  );
};



const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [catRes, featRes, prodRes] = await Promise.all([
          categoryService.getAll(),
          // productService.getFeatured(),
          productService.getAll({ limit: 16 }),
        ]);
        if (catRes.data.success) setCategories(catRes.data.categories);
        // if (featRes.data.success) setFeatured(featRes.data.products);
        if (prodRes.data.success) setProducts(prodRes.data.products);
      } catch (err) {
        console.error('Home load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page-container py-4 space-y-4">
      {/* Categories */}
      {categories.length > 0 && <CategoryList categories={categories} />}

      {/* Hero Banner */}
      <Banner />

      {/* Today's Deals */}
      <div className="bg-white rounded-sm shadow-card p-3 sm:p-4">
        {/* <div className="bg-white rounded-sm shadow-card p-4"> */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-flipkart-text-dark flex items-center gap-2">
            <Zap size={18} className="text-orange-500 fill-orange-500" />
            Today's Deals
          </h2>
          <Link to="/products" className="text-flipkart-blue text-xs font-semibold flex items-center gap-1 hover:underline">
            View All <ArrowRight size={13} />
          </Link>
        </div>

        <div
          className="flex gap-1 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {DEALS.map(({ label, discount, Icon, cat }) => (
            <button
              key={label}
              onClick={() => navigate(`/products?category=${cat}`)}
              className="flex-shrink-0 flex flex-col items-center gap-2 w-[76px] py-3 px-1 rounded-xl hover:bg-orange-50 transition-all duration-200 active:scale-95 group"
            >
              {/* Icon Circle — same style as CategoryList */}
              <div className="w-11 h-11 rounded-full bg-white border-2 border-gray-200 group-hover:border-orange-400 group-hover:shadow-md flex items-center justify-center transition-all duration-200 shadow-sm">
                <Icon size={20} className="text-orange-500 stroke-2" />
              </div>

              {/* Label */}
              <span className="text-[10.5px] font-semibold text-gray-600 group-hover:text-orange-500 whitespace-nowrap text-center leading-tight transition-colors">
                {label}
              </span>

              {/* Discount badge */}
              <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full whitespace-nowrap leading-none">
                {discount}
              </span>
            </button>
          ))}
        </div>
      </div>


      {/* Featured Products */}
      {/* <div className="bg-white rounded-sm shadow-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-flipkart-text-dark"> Featured Products</h2>
          <Link to="/products" className="text-flipkart-blue text-sm font-medium flex items-center gap-1 hover:underline">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <SkeletonGrid count={8} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
            {featured.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div> */}

      {/* All Products */}
      <div className="bg-white rounded-sm shadow-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-flipkart-text-dark">All Products</h2>
          <Link to="/products" className="text-flipkart-blue text-sm font-medium flex items-center gap-1 hover:underline">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <SkeletonGrid count={12} />
        ) : (
          // <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {products.slice(0, 20).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
        <div className="mt-6 text-center">
          <Link to="/products"
            className="inline-flex items-center gap-2 bg-flipkart-blue hover:bg-flipkart-blue-dark text-white font-semibold px-5 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base rounded-sm transition-all shadow hover:shadow-md active:scale-95">
            See All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;