import StoryShell from "./StoryShell";
import FourWallsXRPage from "../pages/xr/FourWallsXRPage.jsx";

function normalizePathname(pathname: string) {
  if (!pathname) return "/";
  const cleaned = pathname.replace(/\/+$/, "");
  return cleaned || "/";
}

export default function App() {
  const path = normalizePathname(typeof window !== "undefined" ? window.location.pathname : "/");

  if (path === "/xr" || path === "/xr/door") {
    return <FourWallsXRPage />;
  }

  return <StoryShell />;
}
