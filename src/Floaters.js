import * as THREE from 'three'
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {  Box, Plane, Sphere, useCubeTextureLoader } from "drei";

import { useFrame } from "react-three-fiber";
import {  a } from '@react-spring/three'
import { Physics, useBox, useDistanceConstraint, useHingeConstraint, useLockConstraint, usePlane, usePointToPointConstraint, useSphere, useSpring as useSpringConstrain } from 'use-cannon';

function FloaterMaterial() {

  const envMap = useCubeTextureLoader(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'], { path: '/cube/' })

  return (
    <meshStandardMaterial color="#333" reflectivity={1} roughness={0.7} envMap={envMap} />
  )

}

function Floater({ position, rotation, ...props }) {

  const [ref, api] = useBox(() => ({ 
    mass: .1, 
    size: [.5, 1, .5], 
    position,
    rotation 
  }))
  
  const ctrlRef = useRef(props.controlled)
  
  useFrame(({ clock, mouse, viewport }) => {
    if (ctrlRef.current) {
      api.position.set(
        (mouse.x * viewport.width) / 2, 
        (mouse.y * viewport.height) / 2, 
        0
      )
    }
  })

  useEffect(() => {
    const x = new THREE.Vector3().random()
    api.angularVelocity.set(x.x,x.y,x.z)
  }, [api])

  const launch = useCallback(() => {
      ctrlRef.current = false
      api.applyImpulse([0, 0, -2], [0, 0, 0])
  }, [api])

  useEffect(() => {
    if (props.controlled) {
      window.addEventListener('mousedown', launch)
    }

    return () => {
      window.removeEventListener("mousedown", launch)
    }
  })

  return (
    <>
      <a.mesh 
        {...props}  
        castShadow
        receiveShadow
        ref={ref} 
      >
        <boxBufferGeometry args={[.5, 1, .5]} />
        <FloaterMaterial />
      </a.mesh>
    </>
  )
}

function Room({position, rotation, size}) {
  const [ref] = usePlane(() => ({ position, rotation }))

  return <Plane args={[...size]} position={position} rotation={rotation} material-wireframe />
}

function Floaters() {

  const floaters = useMemo(() => {

    return [
      {position: [0, 0, 0], rotation: [2, .3, .5] },
      { position: [-1, 1, -4], rotation: [2, .3, .5] },
      { position: [.8, 0, -6], rotation: [.5, .3, .5] },
      {position: [-1.5, .1, -6], rotation: [-1, 3, 1] },
      {position: [0, 1, -2], rotation: [-3, 3, 1] },
      {position: [0, -1, -4], rotation: [-2, 3, 1] },
      { position: [1.2, .1, -.5], rotation: [1, 2, 4] },
      { position: [-1.2, 0, 1], rotation: [13, 4, 1] }
    ]

  }, [])

  return <>
    <Physics gravity={[0, 0, 0]} defaultContactMaterial={{ friction: 1, restitution: 0.5, angularDamping: 2 }}>

      <Room size={[10, 20]} position={[0, 3, 0]} rotation={[-Math.PI/2, 0, 0]} />
      <Room size={[10, 20]} position={[0, -2, 0]} rotation={[-Math.PI/2, 0, 0]} />
      {(
        floaters.map((floater, i) => <Floater key={i} {...floater} />)
      )}
    </Physics>
  </>

}


export default Floaters
