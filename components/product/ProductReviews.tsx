import React from 'react';
import { Star } from 'lucide-react';
import '@/app/styles/globals.css';

const ReviewsComponent = () => {
  const reviews = [
    {
      id: 1,
      rating: 4,
      title: "Кофта Sup...",
      date: "1 день назад",
      pros: "стильно, классика которую можно носить под любую стиль одежды...",
      cons: "клей на подошве. Подше...",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
      id: 2,
      rating: 4,
      title: "",
      date: "",
      pros: "стильно, классика которую можно нос...",
      cons: "не на...",
      avatar: "https://i.pravatar.cc/150?img=2"
    }
  ];

  const ratingStats = [
    { stars: 5, count: 45, percentage: 65 },
    { stars: 4, count: 15, percentage: 22 },
    { stars: 3, count: 5, percentage: 7 },
    { stars: 2, count: 3, percentage: 4 },
    { stars: 1, count: 1, percentage: 2 }
  ];

  const renderStars = (rating, size = 'sm') => {
    const sizeClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl bg-[var(--items-background)] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Отзывы на Supreme</h2>
        <button className="text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Rating Summary */}
      <div className="flex items-start gap-4 mb-6">
        {/* Left side - Rating */}
        <div className="flex flex-col items-start">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-bold">4.5</span>
            <Star className="w-5 h-5 fill-black-400 text-black-400" />
          </div>
          <span className="text-xs text-gray-500">84 отзывов</span>
        </div>

        {/* Right side - Rating bars */}
        <div className="flex-1 space-y-1">
          {ratingStats.map((stat) => (
            <div key={stat.stars} className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(stat.stars)].map((_, i) => (
                  <Star key={i} className="w-2 h-2 fill-gray-800 text-gray-800" />
                ))}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gray-800 h-full rounded-full"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Product images */}
        <div className="flex gap-1">
          <img 
            src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&h=100&fit=crop" 
            alt="Product 1" 
            className="w-10 h-10 rounded-lg object-cover"
          />
          <img 
            src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=100&h=100&fit=crop" 
            alt="Product 2" 
            className="w-10 h-10 rounded-lg object-cover"
          />
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-2 gap-3">
        {reviews.map((review) => (
          <div key={review.id} className="border border-gray-200 rounded-lg p-3 text-xs">
            {/* Review Header */}
            <div className="flex items-start gap-2 mb-2">
              <img 
                src={review.avatar} 
                alt="User" 
                className="w-6 h-6 rounded-full"
              />
              <div className="flex-1 min-w-0">
                {renderStars(review.rating)}
                {review.title && (
                  <p className="font-medium text-xs mt-1 truncate">{review.title}</p>
                )}
                {review.date && (
                  <p className="text-gray-400 text-xs">{review.date}</p>
                )}
              </div>
              <img 
                src={review.avatar} 
                alt="User" 
                className="w-6 h-6 rounded-full"
              />
            </div>

            {/* Review Content */}
            <div className="space-y-2">
              <div>
                <p className="font-semibold text-xs mb-0.5">Достоинства: <span className="font-normal">{review.pros}</span></p>
              </div>
              <div>
                <p className="font-semibold text-xs mb-0.5">Недостатки: <span className="font-normal text-red-500">{review.cons}</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ReviewsComponent;
