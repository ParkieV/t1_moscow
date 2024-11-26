export interface Pair {
  svgFile?: File;
  lottieFile?: File;
  name: string;
  category: string;
}

export type Platforms = "android" | "ios" | "web" | "admin"