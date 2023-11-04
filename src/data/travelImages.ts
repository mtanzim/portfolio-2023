const s3Path = "https://tm-photo-portfolio.s3.amazonaws.com";
// TODO: add titles and description to images
const fileNames2023 = [
  "DSC09717.jpg.webp",
  "DSC09760.jpg.webp",
  "DSC09679.jpg.webp",
  "DSC09659.jpg.webp",
  "DSC09875.jpg.webp",
  "DSC00044.jpg.webp",
  "DSC00103.jpg.webp",
  "DSC08419.jpg.webp",
  "DSC08521.jpg.webp",
  "DSC08625.jpg.webp",
  "DSC08707.jpg.webp",
  "DSC08920.jpg.webp",
  "DSC08947.jpg.webp",
  "DSC08990.jpg.webp",
  "DSC09102.jpg.webp",
  "DSC09220.jpg.webp",
  "DSC09526.jpg.webp",
];

const fileNames2022 = [
  "DSC07446.jpg.webp",
  "DSC07486.jpg.webp",
  "DSC07849.jpg.webp",
  "DSC07870.jpg.webp",
  "DSC08251.jpg.webp",
  "DSC08271.jpg.webp",
];

export const travelImagePaths2023 = fileNames2023.map(
  (name) => `${s3Path}/2023/${name}`
);

export const travelImagePaths2022 = fileNames2022.map(
  (name) => `${s3Path}/2022/${name}`
);
