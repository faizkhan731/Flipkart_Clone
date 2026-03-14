

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Smartphone, Laptop, Shirt, Home, BookOpen,
  Dumbbell, Gamepad2, Sparkles, ShoppingBag,
  Tv, Headphones, Watch, Camera, Sofa,
  Baby, Car, Utensils, Flower2, Palette
} from 'lucide-react';

// ✅ Lucide icon map — DB ka emoji string IGNORE karo
const categoryIcons = {
  'Mobiles': Smartphone,
  'Electronics': Laptop,
  'Fashion': Shirt,
  'Appliances': Home,
  'Books': BookOpen,
  'Sports': Dumbbell,
  'Toys': Gamepad2,
  'Beauty': Sparkles,
  'TV': Tv,
  'Audio': Headphones,
  'Watches': Watch,
  'Camera': Camera,
  'Furniture': Sofa,
  'Baby': Baby,
  'Automotive': Car,
  'Kitchen': Utensils,
  'Garden': Flower2,
  'Art': Palette,
};

// Extra categories jo DB mein nahi hain
const EXTRA_CATEGORIES = [
  { id: 'tv', name: 'TV' },
  { id: 'audio', name: 'Audio' },
  { id: 'watches', name: 'Watches' },
  { id: 'camera', name: 'Camera' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'baby', name: 'Baby' },
  { id: 'automotive', name: 'Automotive' },
];

const CategoryList = ({ categories = [] }) => {
  const navigate = useNavigate();

  const dbNames = categories.map(c => c.name);
  const extras = EXTRA_CATEGORIES.filter(e => !dbNames.includes(e.name));
  const allCategories = [...categories, ...extras];

  return (
    <div className="bg-white shadow-card rounded-sm px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-flipkart-text-dark uppercase tracking-wide">
          Shop by Category
        </h2>
        <button
          onClick={() => navigate('/products')}
          className="text-xs text-flipkart-blue font-semibold hover:underline"
        >
          View All →
        </button>
      </div>

      <div
        className="flex items-center gap-1 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allCategories.map((cat) => {
          const IconComponent = categoryIcons[cat.name] || ShoppingBag;
          const isDbCat = typeof cat.id === 'number';

          return (
            <button
              key={cat.id}
              onClick={() =>
                isDbCat
                  ? navigate('/products?category=' + encodeURIComponent(cat.name))
                  : navigate('/products')
              }
              className="flex flex-col items-center flex-shrink-0 gap-2 w-[76px] py-3 px-1 rounded-xl hover:bg-blue-50 transition-all duration-200 active:scale-95 group"
            >
              <div className="w-11 h-11 rounded-full bg-white border-2 border-gray-200 group-hover:border-flipkart-blue group-hover:shadow-md flex items-center justify-center transition-all duration-200 shadow-sm">
                <IconComponent size={20} className="text-flipkart-blue stroke-2" />
              </div>
              <span className="text-[10.5px] font-semibold text-gray-600 group-hover:text-flipkart-blue whitespace-nowrap text-center leading-tight transition-colors">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;