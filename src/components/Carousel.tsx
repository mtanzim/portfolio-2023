import type { HTMLProps } from "react";

export type CarouselImage = {
  url: string;
  alt: string;
  title: string;
  desc?: string;
};
type Props = {
  images: CarouselImage[];
  customImgClasses?: HTMLProps<HTMLElement>["className"];
};

export const CarouselImageItem = ({
  img,
  customImgClasses,
}: {
  img: CarouselImage;
  customImgClasses?: HTMLProps<HTMLElement>["className"];
}) => {
  return (
    <div className="flex flex-col">
      <img className={customImgClasses ?? ""} src={img.url} alt={img.alt} />
      <div className="divider"></div>
      <div>
        <p className="ml-4 text-base">{img.title}</p>
        <p className="ml-4 text-xs">{img.desc ?? ""}</p>
      </div>
    </div>
  );
};

export default function Carousel({ images, customImgClasses }: Props) {
  if (images.length !== 3) {
    throw new Error("ugly, please fix");
  }
  return (
    <div className="carousel carousel-center rounded-box">
      {images.map((img: CarouselImage) => (
        <div key={img.alt} className={`carousel-item w-1/3`}>
          <CarouselImageItem customImgClasses={customImgClasses} img={img} />
        </div>
      ))}
    </div>
  );
}
