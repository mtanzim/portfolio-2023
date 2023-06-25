type Props = {
  images: string[];
};
export default function FullCarousel({ images }: Props) {
  function genSlideName(idx: number) {
    return `slide-${idx + 1}`;
  }
  return (
    <>
      <div className="carousel w-full h-[512px]">
        {images.map((imgLink, idx) => (
          <div id={genSlideName(idx)} className="carousel-item relative w-full">
            <img src={imgLink} className="w-full h-full object-contain" />
          </div>
        ))}
        <div className="flex justify-center w-full py-2 gap-2">
          {images.map((_, idx) => (
            <a href={`#${genSlideName(idx)}`} className="btn btn-xs">
              1
            </a>
          ))}
        </div>
      </div>
      <div className="flex justify-center w-full py-2 gap-2">
        {images.map((_, idx) => (
          <a href={`#${genSlideName(idx)}`} className="btn btn-xs">
            {idx + 1}
          </a>
        ))}
      </div>
    </>
  );
}
