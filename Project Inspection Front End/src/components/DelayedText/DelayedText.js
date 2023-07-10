import React, { useState, useEffect } from "react";
import "./DelayedText.css";

const DelayedText = ({ text, delay }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    let timeout;

    const displayNextLetter = () => {
      setDisplayText((prevDisplayText) => prevDisplayText + text[currentIndex]);
      currentIndex++;

      if (currentIndex < text.length) {
        timeout = setTimeout(displayNextLetter, delay);
      }
    };

    if (text && text.length > 0) {
      setDisplayText(""); // Reset the display text when the 'text' prop changes
      timeout = setTimeout(displayNextLetter, delay);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [text, delay]);

  if (!text || text.length === 0) {
    return null; // Return null if the 'text' prop is undefined or empty
  }

  return <span className="group-name">{displayText}</span>;
};

export default DelayedText;
