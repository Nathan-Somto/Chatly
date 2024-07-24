import { v4 as uuidv4 } from "uuid";
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
    color: 'hsl(var(--foreground))',
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