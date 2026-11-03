import { useDispatch, useSelector } from "react-redux";
import { Sun, Moon } from "lucide-react";
import { toggleTheme } from "../../redux/slices/uiSlice";
export default function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.ui.theme);
  return (
    <button
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#22231f] transition hover:bg-[#e6e3dc] dark:text-[#f4f2ec] dark:hover:bg-[#33352f]"
      onClick={() => dispatch(toggleTheme())}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-[18px] w-[18px]" />
      ) : (
        <Moon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
