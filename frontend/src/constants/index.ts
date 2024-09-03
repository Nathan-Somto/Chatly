import {
  GitPullRequestIcon,
  GroupIcon,
  LogOutIcon,
  TrashIcon,
  Wallpaper,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Dark1 from "@/assets/wallpapers/dark1.png";
import Dark2 from "@/assets/wallpapers/dark2.jpg";
import Dark3 from "@/assets/wallpapers/dark3.jpg";
import Coffee from "@/assets/wallpapers/coffee.jpg";
import Green1 from "@/assets/wallpapers/green1.jpg";
import Leaves from "@/assets/wallpapers/leaves.jpg";
import Light1 from "@/assets/wallpapers/light1.jpg";
import Light2 from "@/assets/wallpapers/light2.jpg";
import Stones from "@/assets/wallpapers/stones.jpg";
import Sunset from "@/assets/wallpapers/sunset.jpg";
import Wood from "@/assets/wallpapers/wood.jpg";

export const defaultWallpapers = {
  dark1: Dark1,
  dark2: Dark2,
  dark3: Dark3,
  coffee: Coffee,
  green1: Green1,
  leaves: Leaves,
  light1: Light1,
  light2: Light2,
  stones: Stones,
  sunset: Sunset,
  wood: Wood,
};

export default defaultWallpapers;

export const TOKEN_REFRESH_TIME = 24 * 60 * 60 * 1000; // 1 day
export const clerkConfig = (theme: string) => {
  return {
    variables: {
      colorBackground: theme === "dark" ? "#17191C" : "#f9fafb",
      colorText: theme === "dark" ? "white" : "#030712",
    },
  };
};
export const customReactSelectStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: "hsl(var(--input))",
    borderColor: "transparent",
    boxShadow: "none",
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "hsl(var(--input))",
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "hsl(var(--input))",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "hsl(var(--secondary-foreground))",
  }),
};

export const linkData = [
  {
    text: "features",
    link: "#features",
    id: uuidv4(),
  },
  {
    text: "about",
    link: "#",
    id: uuidv4(),
  },
  {
    text: "blog",
    link: "#",
    id: uuidv4(),
  },
  {
    text: "contact",
    link: "#footer",
    id: uuidv4(),
  },
];

export const settingsItemData = [
  {
    text: "New Group chat",
    icon: GroupIcon,
  },
  {
    text: "Request Feature",
    icon: GitPullRequestIcon,
  },
  {
    text: "Change Wallpaper",
    icon: Wallpaper,
  },
  {
    text: "Logout",
    icon: LogOutIcon,
  },
  {
    text: "Delete Account",
    icon: TrashIcon,
  },
] as const;
export const solidLightColors = [
  "#4CAF50", // Green
  "#FFEB3B", // Yellow
  "#2196F3", // Blue
  "#FF9800", // Orange
  "#9C27B0", // Purple
  "#00BCD4", // Cyan
  "#E91E63", // Pink
  "#8BC34A", // Light Green
  "#FFC107", // Amber
  "#673AB7", // Deep Purple
  "#03A9F4", // Light Blue
  "#CDDC39", // Lime
  "#FF5722", // Deep Orange
  "#009688", // Teal
  "#3F51B5", // Indigo
];

export const solidDarkColors = [
  "#388E3C", // Dark Green
  "#FBC02D", // Dark Yellow
  "#1976D2", // Dark Blue
  "#F57C00", // Dark Orange
  "#7B1FA2", // Dark Purple
  "#0097A7", // Dark Cyan
  "#C2185B", // Dark Pink
  "#689F38", // Dark Light Green
  "#FFA000", // Dark Amber
  "#512DA8", // Dark Deep Purple
  "#0288D1", // Dark Light Blue
  "#AFB42B", // Dark Lime
  "#D84315", // Dark Deep Orange
  "#00796B", // Dark Teal
  "#303F9F", // Dark Indigo
];


