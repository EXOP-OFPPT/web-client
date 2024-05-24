import { RootState } from "@/state/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";


const ThemeSwitcher = () => {

  const pickedTheme = useSelector(
    (state: RootState) => state.navBar.pickedTheme
  );

  useEffect(() => {
    // Create a new link element
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = `/src/style/Themes/${pickedTheme}.css`;

    // Insert the link element into the head tag
    document.head.appendChild(linkElement);

  }, [pickedTheme]);

  return null; // This component doesn't render anything directly
};

export default ThemeSwitcher;
