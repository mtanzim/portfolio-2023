import type { FullCarouselImage } from "../types/images";

type Props = {
  images: FullCarouselImage[];
  sectionPrefix: string;
};
export default function FullCarousel({ images, sectionPrefix }: Props) {
  function genSlideName(idx: number) {
    return `${sectionPrefix}-slide-${idx + 1}`;
  }
  return (
    <>
      <div className="carousel w-full h-[256px] md:h-[768px]">
        {images.map((image, idx) => (
          <div
            id={genSlideName(idx)}
            className="carousel-item w-full h-full relative"
            key={image.url}
          >
            <img
              src={image.url}
              alt={image.url}
              className="w-full object-contain py-12"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center w-full py-2 gap-2">
        {images.map((img, idx) => (
          <a href={`#${genSlideName(idx)}`} key={img.url}>
            <div className="tooltip" data-tip={img.title}>
              <button className="btn btn-xs">{idx + 1}</button>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
