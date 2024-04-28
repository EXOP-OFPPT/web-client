import { useEffect } from "react";

type ThemeSwitcherProps = {
  currentTheme: string;
};

const ThemeSwitcher = ({ currentTheme }: ThemeSwitcherProps) => {
  useEffect(() => {
    console.log("Theme")
    // Create a new link element
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.type = "text/css";
    linkElement.href = `./src/${currentTheme}`;

    // Insert the link element into the head tag
    document.head.appendChild(linkElement);

    // Return a cleanup function to remove the link element when the component unmounts
    return () => {
      document.head.removeChild(linkElement);
    };
  }, [currentTheme]);

  return null; // This component doesn't render anything directly
};

export default ThemeSwitcher;
