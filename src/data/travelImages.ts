import type { FullCarouselImage } from "../types/images";

const s3Path = "https://tm-photo-portfolio.s3.amazonaws.com";
export const travelImages2024: FullCarouselImage[] = [
  ["DSC00230.jpg.webp", "London, England"],
  ["DSC00185.jpg.webp", "London, England"],
  ["howth.webp", "Howth, Ireland"],
  ["dublin.webp", "Dublin, Ireland"],
  ["DSC00264.jpg.webp", "Old Trafford, Manchester, England"],
  ["nl-gm-2.webp", "Gros Morne NP, Newfoundland, Canada"],
  ["nl-gm-3.webp", "Gros Morne NP, Newfoundland, Canada"],
].map(([filename, title]) => ({ url: `${s3Path}/2024/${filename}`, title }));

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
  ["DSC08990.jpg.webp", "Lagos, Portugal"],
  ["DSC09102.jpg.webp", "Marrakech, Morocco"],
  ["DSC09220.jpg.webp", "Marrakech, Morocco"],
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

export const travelImagesOlder: FullCarouselImage[] = [
  ["DSC09781.jpg.webp", "Hoi An, Vietnam"],
  ["DSC08689.jpg.webp", "Don Det, Laos"],
  ["DSC08254.jpg.webp", "Muang Ngoi Neua, Laos"],
  ["DSC06815.jpg.webp", "Mui Ne, Vietnam"],
  ["DSC06404.jpg.webp", "Sapa, Vietnam"],
  ["DSC00284.jpg.webp", "Mai Chau, Vietnam"],
  ["DSC07640.jpg.webp", "Chiang Mai, Thailand"],
  ["DSC03225.jpg.webp", "Taroko Gorge, Taiwan"],
  ["DSC03553.jpg.webp", "Taipei, Taiwan"],
  ["DSC02580.jpg.webp", "Jeju Island, South Korea"],
  ["DSC02661.jpg.webp", "Jeju Island, South Korea"],
  ["DSC02771.jpg.webp", "Busan, South Korea"],
  ["DSC04636.jpg.webp", "Porto, Portugal"],
  ["DSC04894.jpg.webp", "Lisbon, Portugal"],
  ["DSC05092.jpg.webp", "Berlin, Germany"],
  ["DSC06260.jpg.webp", "Rome, Italy"],
  ["DSC06337.jpg.webp", "Rome, Italy"],
  ["DSC06515.jpg.webp", "Munich, Germany"],
  ["DSC06579.jpg.webp", "Mittenwald, Germany"],
  ["DSC02902.jpg.webp", "Toronto, Canada"],
].map(([filename, title]) => ({ url: `${s3Path}/older/${filename}`, title }));
