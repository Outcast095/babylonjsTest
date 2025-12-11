import { Scene, MeshBuilder, Mesh, Vector3, PhysicsImpostor } from "@babylonjs/core";


export function createBabylonBox(scene: Scene): Mesh {
  const box = MeshBuilder.CreateBox("box", { size: 2 }, scene);
  box.position = new Vector3(0, 5, 0);  // Высоко, чтобы падал

  box.physicsImpostor = new PhysicsImpostor(
    box,
    PhysicsImpostor.BoxImpostor,
    { mass: 1, friction: 0.5, restitution: 0.7 },
    scene
  );

  return box;
}
