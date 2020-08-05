import React, { useRef } from 'react'
import { useHelper } from 'drei'
import { SpotLightHelper } from 'three'
import { useControl } from 'react-three-gui'

function Lights() {

    const $dirLight = useRef()

    const color = useControl('lights color', { type: "color", value: "#ff0000"})
    const fog = useControl('fog color', { type: "color", value: "#ff0000"})
  
    return (
      <>
        <fog attach="fog" color={fog} near={5} far={16} />
        <spotLight 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          distance={9}
          angle={.4}
          penumbra={.3}
          castShadow 
          ref={$dirLight} color={color} position={[0, 0, -10]} />
        <pointLight 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          castShadow
          color={color} 
          position={[0, 1, -10]} 
          intensity={0.3}

        />
        <directionalLight position={[0, 0, 0]} intensity={.1} />
      </>
    )

}

export default Lights
