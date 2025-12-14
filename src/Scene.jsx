import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import { Suspense } from "react";
import { Ground } from "./Ground";
import { Track } from "./Track";
import { Car } from "./Car";



export const Scene = () => (
  <Suspense fallback={null}>
    <Environment files={process.env.PUBLIC_URL + "/textures/envmap.hdr"} background={"both"} />
    <PerspectiveCamera makeDefault position={[-6, 3.9, 6.21]} fov={40} />
    <OrbitControls target={[-2.64, -0.71, 0.03]} />

      <Track/>
      <Ground/>
      <Car/>
  </Suspense>
);
