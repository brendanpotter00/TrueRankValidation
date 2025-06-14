import { useDispatch, useSelector } from "react-redux";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { toggleDarkMode } from "../store/uiSlice";
import type { RootState } from "../types/reduxTypes";

export const ThemeToggle = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  return (
    <button
      onClick={() => dispatch(toggleDarkMode())}
      className="nav-button"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <SunIcon width="20" height="20" />
      ) : (
        <MoonIcon width="20" height="20" />
      )}
    </button>
  );
};
