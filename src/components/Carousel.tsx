import React from "react";

export type CarouselImage = {
  url: string;
  alt: string;
};
type Props = {
  images: CarouselImage[];
};

export default function Carousel({ images }: Props) {
  return (
    <div className="carousel carousel-center rounded-box">
      {images.map((img: CarouselImage) => (
        <div key={img.alt} className="carousel-item w-1/3">
          <img src={img.url} alt={img.alt} />
        </div>
      ))}
    </div>
  );
}
