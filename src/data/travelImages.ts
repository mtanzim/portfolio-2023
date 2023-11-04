const s3Path = "https://tm-photo-portfolio.s3.amazonaws.com/2023/";
// TODO: add titles and description to images
const fileNames = [
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

export const travelImagePaths2023 = fileNames.map((name) => `${s3Path}${name}`);
