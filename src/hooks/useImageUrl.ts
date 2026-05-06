import { useState, useEffect } from "react";

const SERVER_URL = "https://embezzle-phoenix-swinging.ngrok-free.dev";

export const useImageUrl = (path: string | undefined): string => {
  const [blobUrl, setBlobUrl] = useState<string>("/assets/placeholder.png");

  useEffect(() => {
    if (!path) {
      setBlobUrl("/assets/placeholder.png");
      return;
    }

    let objectUrl: string | null = null;

    const fullUrl = `${SERVER_URL}${path.startsWith("/") ? path : "/" + path}`;

    fetch(fullUrl, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load image");
        return res.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      })
      .catch(() => {
        setBlobUrl("/assets/placeholder.png");
      });

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [path]);

  return blobUrl;
};