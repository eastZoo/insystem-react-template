import { useEffect } from "react";

const NaverMapLoader = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.REACT_APP_NAVER_MAP_API_KEY}`;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null;
};

export default NaverMapLoader;
