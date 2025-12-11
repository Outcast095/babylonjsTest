import { Scene, MeshBuilder, Mesh, PhysicsImpostor, StandardMaterial, Color3  } from "@babylonjs/core";

export function createBabylonGround(scene: Scene): Mesh {
  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: 20, height: 20 },
    scene
  );

  // создаём материал
  const groundMaterial = new StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseColor = new Color3(0.4, 0.8, 0.4); // зелёный оттенок

  // применяем материал
  ground.material = groundMaterial;

  ground.physicsImpostor = new PhysicsImpostor(
    ground,
    PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0.7 },
    scene
  );
  

  return ground;
}

