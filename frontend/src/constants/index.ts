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