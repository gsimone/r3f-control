import * as THREE from 'three'
import React, { useEffect, useMemo, useRef } from "react";
import { Extrude, useCubeTextureLoader, OrbitControls } from "drei";

import { useFrame } from "react-three-fiber";
import Lights from "./lights";
import { useControl } from 'react-three-gui';

import { useSpring, useSprings } from "@react-spring/core"
import {  a } from '@react-spring/three'


function Frame({ rot, depth = .3, color = "#333", ...props}) {
  const shape = useMemo(() => {
    //Create a frame shape..
    var frame = new THREE.Shape();
    frame.moveTo(-8, -3);
    frame.lineTo( 8, -3);
    frame.lineTo( 8,  3);
    frame.lineTo(-8,  3);

    //..with a hole:
    var hole = new THREE.Path();
    hole.moveTo(-5, -2);
    hole.lineTo( 5, -2);
    hole.lineTo( 5,  2);
    hole.lineTo(-5,  2);
    frame.holes.push(hole);

    return frame
  }, [])

  const extrudeSettings = useMemo(
    () => ({
      steps: 1,
      depth,
      bevelEnabled: false,
    }),
    [depth]
  )
  

  return (
    <a.group  {...props} rotation-z={rot}>
       <Extrude args={[shape, extrudeSettings]}> 
        <meshStandardMaterial 
          color="#999"
          roughness={.7}
          castShadow
          receiveShadow
          shadowSide={THREE.FrontSide}
        />
      </Extrude>
    </a.group>
     
  )
}

function Floater(props) {
  const {isLaunching} = props

  const randomDelay = useMemo(() => Math.random() * 100, [])
  const direction = useMemo(() => new THREE.Vector3(Math.random(), Math.random(), Math.random()), [])
  
  const $ref = useRef()
  useFrame(({clock}) => {
    $ref.current.rotation.x += direction.x / 140
    $ref.current.rotation.y += direction.y / 140
    $ref.current.rotation.z += direction.z / 140

    $ref.current.position.y += Math.sin(randomDelay + clock.getElapsedTime()/2) / 400
  })

  const envMap = useCubeTextureLoader(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'], { path: '/cube/' })
  
  const [spring, set] = useSpring(() => ({
    loop: true,
    position: props.position,
    config: { mass: 10, friction: 100, tension: 1600 },
  }))

  useEffect(() => {

    if (isLaunching) {
      set({position: [
        1, 
        -.5,
        1.4
      ]})
    } else {
      set({ position: props.position })
    }

  }, [isLaunching, props.position, set])

  return (
    <a.mesh {...props} {...spring}  
      castShadow
      receiveShadow
      ref={$ref} 
      onPointerDown={props.handleClick}
    >
      <boxBufferGeometry args={[.5, 1, .5]} />
      <meshStandardMaterial color="#333" reflectivity={1} roughness={0.7} envMap={envMap} />
    </a.mesh>
  )
}

function Frames() {

  const [springs] = useSprings(40, i => ({
    loop: true,
    from: { theta: 0 },
    to: async next => {
      while (1) {
        await next({ theta: -Math.PI/2 -(0.004 * (i * i)) - (i * 0.06) });
        await next({ theta: 0 });
      }
    },
    config: {
      mass: 100,
      tension: 400,
      friction: 400
    },
    delay: (i) => 1000 + (i * 12) + i
  }));

  return springs.map((spring, i) => {
   
      const { theta } = spring

      return (<Frame 
        key={i} 
        depth={.5} 
        scale={[.6, 1, 1]} 
        position={[0, 0, 3 - i * 0.5]} 
        rot={theta} 
      />)
    
  })

}


function Scene() {
  const [launching, setLaunching] = React.useState(false)
  
  const orbitControls = useControl("Orbit Controls", {type: "boolean"})
  return (
    <>
      <Lights />
      <Frames />
      <Floater onClick={() => setLaunching(0)} isLaunching={launching === 0} scale={[.3,.3,.3]}  position={[1.2, -1, -3]}  args={[1, 2, 1]} rotation={[2, .3, .5]} />
      <Floater onClick={() => setLaunching(0)} isLaunching={launching === 0} scale={[.3,.3,.3]}  position={[-1, 1, -4]}  args={[1, 2, 1]} rotation={[2, .3, .5]} />
      <Floater onClick={() => setLaunching(1)} isLaunching={launching === 1} scale={[0.6, 0.6, 0.6]}  position={[.8, 0, -6]}  args={[1, 2, 1]} rotation={[.5, .3, .5]} />
      <Floater onClick={() => setLaunching(2)} isLaunching={launching === 2} position={[-1.5, .1, -6]} rotation={[-2, 3, 1]} />
      <Floater onClick={() => setLaunching(3)} isLaunching={launching === 3} position={[0, 1, -2]} rotation={[-2, 3, 1]} />
      <Floater onClick={() => setLaunching(4)} isLaunching={launching === 4} position={[0, -1, -4]} rotation={[-2, 3, 1]} />
      <Floater onClick={() => setLaunching(5)} isLaunching={launching === 5} position={[1, 0, 0]} rotation={[1, 4, 1]} />
      <Floater onClick={() => setLaunching(6)} isLaunching={launching === 6} position={[-1.2, 0, 1]} rotation={[1, 4, 1]} />

      
      {orbitControls && <OrbitControls />}
    </>
  );
}

export default Scene;
