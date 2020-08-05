import * as THREE from 'three'
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Icosahedron, Box, Extrude, useTextureLoader, useCubeTextureLoader, OrbitControls } from "drei";

import vert from "./shaders/default.vert";
import frag from "./shaders/default.frag";
import { useFrame, useThree } from "react-three-fiber";
import Lights from "./lights";
import { Vector2 } from 'three';
import { useControl } from 'react-three-gui';

import { useMove } from 'react-use-gesture'

import { useSpring, useSprings } from "@react-spring/core"
import {  a } from '@react-spring/three'
import Floaters from './Floaters';


function Frame({ rot, depth = .3, color = "#333", ...props}) {
  const shape = useMemo(() => {
    //Create a frame shape..
    var frame = new THREE.Shape();
    frame.moveTo(-12, -14);
    frame.lineTo( 12, -14);
    frame.lineTo( 12,  14);
    frame.lineTo(-12,  14);

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
       <Extrude 
       
      castShadow
       receiveShadow args={[shape, extrudeSettings]}>
        <meshStandardMaterial 
          color="#999"
          roughness={.7}
          shadowSide={THREE.FrontSide}   
        />
      </Extrude>
    </a.group>
     
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
  
  const orbitControls = useControl("Orbit Controls", {type: "boolean", value: true})
  return (
    <>
      <Lights />
      <Frames />
      <Floaters />
      
      {orbitControls && <OrbitControls />}
    </>
  );
}

export default Scene;
