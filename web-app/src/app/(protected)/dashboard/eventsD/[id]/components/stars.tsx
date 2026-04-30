export default function Stars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return <span key={i}>★</span>;
        }

        if (i === fullStars && hasHalfStar) {
          return <span key={i}>☆</span>;
        }

        return <span key={i} className="text-gray-300">★</span>;
      })}
    </div>
  );
}