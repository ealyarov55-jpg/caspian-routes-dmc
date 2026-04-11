"use client";

import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: number;
}

export default function StarRating({ value, onChange, readonly = false, size = 20 }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{
            background: "none",
            border: "none",
            cursor: readonly ? "default" : "pointer",
            padding: 0,
            fontSize: size,
            color: star <= (hover || value) ? "#c9a84c" : "#e2eded",
            transition: "color 0.15s",
            lineHeight: 1,
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}