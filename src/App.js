import * as THREE from 'three'
import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import { OrbitControls } from "drei";
import Effects from "./Effects";
import Scene from "./Scene";
import { Controls } from 'react-three-gui';

function App() {
  return (
    <>
      <Canvas
        shadowMap
        colorManagement
        camera={{ position: [0, 0, 3], far: 1000, fov: 70 }}
        style={{
          background: "#121212",
        }}
        concurrent
      >
        
        <Suspense fallback={"Loading."}>
          <Scene />
          </Suspense>
          <Effects />
        </Canvas>
      {window.location.search.includes("ctrl") && <div className="controls">
        <Controls />
      </div>}

      <div className="title">
        TAKE CONTROL
      </div>
    </>
  );
}

export default App;
