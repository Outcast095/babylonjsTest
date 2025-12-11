import React, { FC, useRef, useEffect } from "react";
import BasicScene from "../BasicScene"; // путь к твоему файлу

export const BabylonCanvas:FC = () => {

    const babylonCanvas = useRef<HTMLCanvasElement | null>(null);

   useEffect(() => {
    if (!babylonCanvas.current) return;

    const scene = new BasicScene(babylonCanvas.current);

    return () => {
      scene.dispose();
    };
  }, []);

  return (
     <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <canvas
        ref={babylonCanvas}
        style={{
          width: "80vw",
          height: "80vh",
          display: "block",
        }}
      />
    </div>
  )
}