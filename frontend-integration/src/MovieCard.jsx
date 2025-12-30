import React, { useState } from "react";

// MovieCard component displays a movie title and a favorite button
const MovieCard = ({ title }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Toggle favorite state
  const handleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, margin: 8, borderRadius: 8 }}>
      <h3>{title}</h3>
      <button onClick={handleFavorite}>
        {isFavorite ? "Unfavorite" : "Favorite"}
      </button>
    </div>
  );
};

export default MovieCard;
