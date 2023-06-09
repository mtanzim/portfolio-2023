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

export default function Carousel({ images, customImgClasses }: Props) {
  if (images.length !== 3) {
    throw new Error("ugly, please fix");
  }
  return (
    <div className="rounded-box md:flex justify-center">
      {images.map((img: CarouselImage) => (
        <div key={img.alt} className="mb-4 md:mb-0 md:w-1/3">
          <img className={customImgClasses ?? ""} src={img.url} alt={img.alt} />
          <div className="divider"></div>
          <p className="ml-4 text-base">{img.title}</p>
          <p className="ml-4 text-xs">{img.desc ?? ""}</p>
        </div>
      ))}
    </div>
  );
}
