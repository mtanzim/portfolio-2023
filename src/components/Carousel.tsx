import React from "react";

export type CarouselImage = {
  url: string;
  alt: string;
  title: string;
  desc?: string;
};
type Props = {
  images: CarouselImage[];
};

export const CarouselImageItem = ({ img }: { img: CarouselImage }) => {
  return (
    <div className="flex flex-col">
      <img src={img.url} alt={img.alt} />
      <div className="divider"></div>
      <div>
        <p className="ml-4 text-base">{img.title}</p>
        <p className="ml-4 text-xs">{img.desc ?? ""}</p>
      </div>
    </div>
  );
};

export default function Carousel({ images }: Props) {
  const len = images.length;
  return (
    <div className="carousel carousel-center rounded-box">
      {images.map((img: CarouselImage) => (
        <div key={img.alt} className={`carousel-item w-1/3`}>
          <CarouselImageItem img={img} />
        </div>
      ))}
    </div>
  );
}
