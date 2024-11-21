/*
 * Created by Asad on 21 Nov 2024
 */

import { useEffect } from "react";

export const useInfiniteScroll = (callback: () => void) => {
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        callback();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [callback]);
};
