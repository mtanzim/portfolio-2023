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

export type CarouselClip = {
  url: string;
  alt: string;
  title: string;
  desc?: string;
};
type VideoProps = {
  clips: CarouselClip[];
};

export function VideoCarousel({ clips }: VideoProps) {
  return (
    <div className="rounded-box">
      {clips.map((clip: CarouselClip) => (
        <div className="mb-4 md:mb-0">
          <p className="ml-4 text-base">{clip.title}</p>
          <p className="ml-4 text-xs mb-4">{clip.desc ?? ""}</p>
          <video key={clip.url} controls>
            <source src={clip.url} type="video/webm" />
            Sorry, your browser doesn't support embedded videos, but don't
            worry, you can
            <a href={clip.url}>download it</a>
            and watch it with your favorite video player!
          </video>
          <div className="divider"></div>
        </div>
      ))}
    </div>
  );
}
