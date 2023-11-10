import type { FullCarouselImage } from "../components/FullCarousel";

const s3Path = "https://tm-photo-portfolio.s3.amazonaws.com";
// TODO: add titles and description to images
export const travelImages2023: FullCarouselImage[] = [
  ["DSC09717.jpg.webp", "Kyoto, Japan"],
  ["DSC09760.jpg.webp", "Fushimi Inari Shrines, Japan"],
  ["DSC09679.jpg.webp", "Kyoto, Japan"],
  ["DSC09659.jpg.webp", "Tsukiji Fish Market, Tokyo, Japan"],
  ["DSC09875.jpg.webp", "Osaka, Japan"],
  ["DSC00044.jpg.webp", "Jigokudani, Hokkaido, Japan"],
  ["DSC00103.jpg.webp", "Ginko Avenue, Sapporo, Japan"],
  ["DSC08419.jpg.webp", "Zion NP, USA"],
  ["DSC08521.jpg.webp", "Zion NP, USA"],
  ["DSC08625.jpg.webp", "Arches NP, USA"],
  ["DSC08707.jpg.webp", "Canyonlands, USA"],
  ["DSC08920.jpg.webp", "Lisbon, Portugal"],
  ["DSC08947.jpg.webp", "Lisbon, Portugal"],
  ["DSC08990.jpg.webp", "Lagos, Morocco"],
  ["DSC09102.jpg.webp", "Marrakekch, Morocco"],
  ["DSC09220.jpg.webp", "Marrakekch, Canada"],
  ["DSC09526.jpg.webp", "Banff NP, Canada"],
].map(([filename, title]) => ({ url: `${s3Path}/2023/${filename}`, title }));

export const travelImages2022: FullCarouselImage[] = [
  ["DSC07446.jpg.webp", "Banff NP, Canada"],
  ["DSC07486.jpg.webp", "Banff NP, Canada"],
  ["DSC07849.jpg.webp", "Isle of Skye, Scotland"],
  ["DSC07870.jpg.webp", "Isle of Skye, Scotland"],
  ["DSC08251.jpg.webp", "Cabot Trail, NS, Canada"],
  ["DSC08271.jpg.webp", "Cabot Trail, NS, Canada"],
].map(([filename, title]) => ({ url: `${s3Path}/2022/${filename}`, title }));
