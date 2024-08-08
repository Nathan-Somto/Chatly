import { GitPullRequestIcon, GroupIcon, LogOutIcon, TrashIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
export const TOKEN_REFRESH_TIME = 24 * 60 * 60 * 1000 // 1 day
export const clerkConfig = (theme: string) => {
 return {
    variables: {
      colorBackground: theme === 'dark' ? "#17191C" : "#f9fafb",
      colorText: theme === "dark" ? "white" : "#030712",
    }
}
}
export const customReactSelectStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: 'hsl(var(--input))', 
    borderColor: 'transparent',
    boxShadow: 'none',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: 'hsl(var(--input))',
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: 'hsl(var(--input))',
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: 'hsl(var(--secondary-foreground))',

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
    text: "Logout",
    icon: LogOutIcon,
  },
  {
    text: "Delete Account",
    icon: TrashIcon,
  },
] as const;