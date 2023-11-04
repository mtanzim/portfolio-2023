const s3Path = "https://tm-photo-portfolio.s3.amazonaws.com/2023/";
const fileNames = [
  "DSC09679.jpg",
  "DSC09717.jpg",
  "DSC09760.jpg",
  "DSC09659.jpg",
  "DSC09875.jpg",
  "DSC00044.jpg",
  "DSC00103.jpg",
  "DSC08419.jpg",
  "DSC08521.jpg",
  "DSC08625.jpg",
  "DSC08707.jpg",
  "DSC08920.jpg",
  "DSC08943.jpg",
  "DSC08947.jpg",
  "DSC08990.jpg",
  "DSC09102.jpg",
  "DSC09220.jpg",
  "DSC09526.jpg",
  "DSC09603.jpg",
];

export const travelImagePaths2023 = fileNames.map((name) => `${s3Path}${name}`);