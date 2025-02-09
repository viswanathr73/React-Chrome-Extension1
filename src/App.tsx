import "./App.css";
import { useState, useEffect } from "react";
import { Shuffle, PaintBucket } from "lucide-react"; // Using lucide-react for icons

function App() {
  const [color, setColor] = useState<string>("#ffffff"); // Default white

  // Load stored color on startup
  useEffect(() => {
    chrome.storage.sync.get(["bgColor"], (result) => {
      if (result.bgColor) {
        setColor(result.bgColor);
        applyBackgroundColor(result.bgColor); // Ensure background color is applied
      }
    });
  }, []);

  const applyBackgroundColor = async (bgColor: string) => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      alert("No active tab found.");
      return;
    }

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [bgColor],
      func: (bgColor: string) => {
        document.body.style.backgroundColor = bgColor;
      },
    });

    chrome.storage.sync.set({ bgColor });
  };

  // Reset Background to Default
  const resetBackground = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return alert("No active tab found!");

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        document.body.style.backgroundColor = "";
        localStorage.removeItem("bgColor");
      },
    });

    chrome.storage.sync.remove(["bgColor"]);
    setColor("#ffffff");
  };

  const changeBackground = () => {
    applyBackgroundColor(color);
  };

  const generateRandomColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setColor(randomColor);
    applyBackgroundColor(randomColor);
  };

  return (
    <div className="container">
      <h1>🌈 Background Changer</h1>

      <div className="color-picker">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.currentTarget.value)}
        />
        <span>{color.toUpperCase()}</span>
      </div>

      <div className="button-group">
        <button onClick={changeBackground} className="primary">
          <PaintBucket size={16} /> Apply Color
        </button>
        <button onClick={generateRandomColor} className="secondary">
          <Shuffle size={16} /> Random Color
        </button>
        <button onClick={resetBackground} className="reset-btn">
          🔄 Reset
        </button>
      </div>
    </div>
  );
}

export default App;
