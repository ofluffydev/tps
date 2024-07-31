// noinspection ExceptionCaughtLocallyJS

"use client";

import React, { useState, useEffect } from "react";

interface FillerElementProps {
  paragraphs?: number;
  className?: string;
}

const FillerElement: React.FC<FillerElementProps> = ({
  paragraphs = 1,
  className = "",
}) => {
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchText = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://baconipsum.com/api/?type=meat-and-filler&paras=${paragraphs}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch text");
        }
        const data = await response.json();
        setText(Array.isArray(data) ? data.join("\n\n") : data);
      } catch (err) {
        setError("Error loading text. Please try again.");
        console.error("Error fetching filler text:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchText().then(() => {});
  }, [paragraphs]);

  if (isLoading) {
    return <div className={className}>Loading...</div>;
  }

  if (error) {
    return <div className={className}>{error}</div>;
  }

  return <div className={className}>{text}</div>;
};

export default FillerElement;
