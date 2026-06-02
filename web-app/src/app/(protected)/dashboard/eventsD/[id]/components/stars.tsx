export default function Stars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => {
        // full star
        if (i < fullStars) {
          return (
            <span key={i} className="text-yellow-400 text-sm">
              ★
            </span>
          );
        }

        // half star
        if (i === fullStars && hasHalfStar) {
          return (
            <span key={i} className="relative text-sm">
              <span className="text-gray-300">★</span>

              <span className="absolute left-0 top-0 overflow-hidden w-1/2 text-yellow-400">
                ★
              </span>
            </span>
          );
        }

        // empty star
        return (
          <span key={i} className="text-gray-300 text-sm">
            ★
          </span>
        );
      })}

      <span className="ml-1 text-xs text-gray-500">
        ({rating.toFixed(1)})
      </span>
    </div>
  );
}