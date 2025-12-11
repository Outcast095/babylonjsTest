import * as CANNON from 'cannon';

import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  CannonJSPlugin
} from "@babylonjs/core";

import {createBabylonBox} from '../Babylon/BabylonObjects/BabylonBox'
import {createBabylonGround} from '../Babylon/BabylonObjects/BabylonGround'
import { createWASDKeydownHandler, WasdKey } from './input/handleKeydown';

// 4. Теперь top-level код (после всех импортов — ESLint ок)
(window as any).CANNON = CANNON;

export default class BasicScene {
  private scene: Scene;
  private engine: Engine;
  
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);

    // Включаем физику (теперь с CANNON доступным)
    const physicsPlugin = new CannonJSPlugin();
    this.scene.enablePhysics(new Vector3(0, -9.81, 0), physicsPlugin);

    // Камера
    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 4,
      4,
      Vector3.Zero(),
      this.scene
    );
    camera.attachControl(canvas, true);

    // Свет
    new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);

    // примитив бокс 
    createBabylonBox(this.scene)
    // земля 
    createBabylonGround(this.scene)
    // Рендер-цикл
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    // Resize
    window.addEventListener("resize", this.resize);

    // Логирование WASD нажатий — обработчик создаётся чисто через фабрику, зависимости передаются явно
    const logger = (key: WasdKey): void => { console.log("Нажата клавиша:", key); };
    this.handleKeydown = createWASDKeydownHandler(logger);
    window.addEventListener("keydown", this.handleKeydown);
  }

  private resize = (): void => {
    this.engine.resize();
  };

  // Обработчик задаётся в конструкторе через чистую фабрику, тип строго указан
  private handleKeydown!: (event: KeyboardEvent) => void;

  dispose(): void {
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("keydown", this.handleKeydown);
    this.engine.dispose();
  }
}
