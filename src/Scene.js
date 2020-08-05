import * as THREE from 'three'
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Icosahedron, Box, Extrude, useTextureLoader, useCubeTextureLoader } from "drei";

import vert from "./shaders/default.vert";
import frag from "./shaders/default.frag";
import { useFrame, useThree } from "react-three-fiber";
import Lights from "./lights";
import { Vector2 } from 'three';
import { useControl } from 'react-three-gui';

import { useMove } from 'react-use-gesture'

import { useSpring } from "@react-spring/core"
import {  a } from '@react-spring/three'


function Frame({ depth = .3, color = "#333", ...props}) {
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
      <Extrude castShadow receiveShadow args={[shape, extrudeSettings]} {...props}>
        {/* <meshPhysicalMaterial reflectivity={1} attach="material" color={color }  /> */}
        <meshPhysicalMaterial 
          color="#000"
          reflectivity={.1}
          roughness={.9} 
        />
      </Extrude>
  )
}

function Floater(props) {
  const {isLaunching} = props
  const direction = useMemo(() => new THREE.Vector3(Math.random(), Math.random(), Math.random()), [])
  
  const $ref = useRef()
  useFrame(({clock}) => {
    $ref.current.rotation.x += direction.x / 100
    $ref.current.rotation.y += direction.y / 100
    $ref.current.rotation.z += direction.z / 100

    $ref.current.position.y += Math.sin(clock.getElapsedTime() * 2) / 400
  })

  const envMap = useCubeTextureLoader(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'], { path: '/cube/' })
  
  const { viewport } = useThree()
  
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
      ref={$ref} 
      onPointerDown={props.handleClick}
    >
      <boxBufferGeometry args={[.5, 1, .5]} />
      <meshStandardMaterial color="#333" reflectivity={1} roughness={0.7} envMap={envMap} />
    </a.mesh>
  )
}


function Scene() {
  const theta = useControl('rot angle', { type:"number", value: 40, min: 0, max: 1000 })
  
  const [launching, setLaunching] = React.useState(false)
  
  return (
    <>
      <Lights />
      
      <Frame depth={14} position={[0, .3, -10]}  scale={[.53, 1, 1]} />
      
      {[...(new Array(40).fill())].map((_, i) => {

        const _i = i + 6
        const j = i

        return (<Frame 
          key={i} 
          depth={0.3} 
          scale={[.5, 1, 3]} 
          position={[0, -i * 0.01, - i * 0.6]} 
          rotation-z={-(theta / 10000) * -(_i*_i)} 
        />)})}

      <Floater onClick={() => setLaunching(0)} isLaunching={launching === 0} scale={[.3,.3,.3]}  position={[-1, 1, -4]}  args={[1, 2, 1]} rotation={[2, .3, .5]} />
      <Floater onClick={() => setLaunching(1)} isLaunching={launching === 1} scale={[0.6, 0.6, 0.6]}  position={[.8, 0, -6]}  args={[1, 2, 1]} rotation={[.5, .3, .5]} />
      <Floater onClick={() => setLaunching(2)} isLaunching={launching === 2} args={[.5, 1, .5]} position={[-1.5, .1, -6]} rotation={[-2, 3, 1]} />
      <Floater onClick={() => setLaunching(3)} isLaunching={launching === 3} args={[.5, 1, .5]} position={[0, 1, -2]} rotation={[-2, 3, 1]} />
      <Floater onClick={() => setLaunching(4)} isLaunching={launching === 4} args={[.5, 1, .5]} position={[0, -1, -4]} rotation={[-2, 3, 1]} />

    </>
  );
}

export default Scene;
