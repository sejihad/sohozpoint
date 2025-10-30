// ScrollToTop.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // scroll on route change
    window.scrollTo(0, 0);

    // scroll on same-route link click
    const handleClick = (e) => {
      const target = e.target.closest("a");
      if (target && target.href.includes(window.location.origin + pathname)) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
