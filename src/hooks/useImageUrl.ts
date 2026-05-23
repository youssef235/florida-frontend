import { useState, useEffect } from "react";

const SERVER_URL = "https://florida.king-prime.com/api";

export type ImageState = "loading" | "loaded" | "error";

export const useImageUrl = (path: string | undefined): { src: string; status: ImageState } => {
  const [src, setSrc] = useState<string>("/assets/placeholder.png");
  const [status, setStatus] = useState<ImageState>("loading");

  useEffect(() => {
    if (!path) {
      setSrc("/assets/placeholder.png");
      setStatus("error");
      return;
    }

    setStatus("loading");
    let objectUrl: string | null = null;

    const fullUrl = `${SERVER_URL}${path.startsWith("/") ? path : "/" + path}`;

    fetch(fullUrl, {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load image");
        return res.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
        setStatus("loaded");
      })
      .catch(() => {
        setSrc("/assets/placeholder.png");
        setStatus("error");
      });

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path]);

  return { src, status };
};