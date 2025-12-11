import React from 'react'
import { Engine, Scene } from "@babylonjs/core"; // или через react-babylonjs

export const Babylon = () => {
  return (
    <div>
    <div>babyloJs</div>

    <canvas id="renderCanvas" style={{ width: '80%', height: '80%' }}></canvas>
    </div>
  )
}
