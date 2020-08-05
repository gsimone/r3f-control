import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import { Html } from "drei";
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
        
          <Effects />
        <Suspense fallback={<Html center><span className="loading">Loading.</span></Html>}>
          <Scene />
          <Html center>
            <div className="title">
              TAKE CONTROL
            </div>
          </Html>
          </Suspense>
        </Canvas>

      {window.location.search.includes("ctrl") && <div className="controls">
        <Controls />
      </div>}

      
    </>
  );
}

export default App;
