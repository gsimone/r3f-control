import React, { Suspense, forwardRef, useMemo, useRef } from 'react'

import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Noise,
  Vignette,
  SSAO, SMAA, ColorAverage, Sepia, HueSaturation
} from "react-postprocessing";
import { useResource, useThree } from 'react-three-fiber'
 
import { GodRaysEffect, PixelationEffect, KernelSize, BlendFunction } from 'postprocessing'

import { ChromaticAberration } from 'react-postprocessing'

import { Circle } from 'drei';
import { useControl } from 'react-three-gui';

export const GodRays = forwardRef((props, ref) => {

  const {camera} = useThree()
  const { sun } = props
  
  const effect = useMemo(() => {

    const godRaysEffect = new GodRaysEffect(camera, sun.current, {
			height: 480,
			kernelSize: KernelSize.SMALL,
			density: 0.96,
			decay: 0.92,
			weight: 0.3,
			exposure: 0.54,
			samples: 40,
			clampMax: 1.0
    });
    
    return godRaysEffect
  }, [camera, sun])

  return <primitive ref={ref} object={effect} dispose={null} />
})

const Sun = forwardRef(function Sun(props, forwardRef) {

  const sunColor = useControl("sun color", {type: "color", value: "#FF0000"})

  return (
    <Circle args={[10, 10]} ref={forwardRef} position={[0, 0, -16]}>
      <meshBasicMaterial color={sunColor} />
    </Circle>
  )

})

function Effects() {
  const [$sun, sun] = useResource()

  const hue = useControl("Hue", {value: 3.11, min: 0, max: Math.PI * 2, type: "number" })
  const saturation = useControl("saturation", {value: 2.07, min: 0, max: Math.PI * 2, type: "number" })
  
  return (
    <Suspense fallback={null}>
      <Sun ref={$sun} />

      {sun && <EffectComposer>
        <GodRays sun={$sun} />

        <Noise
          opacity={0.2}
          premultiply // enables or disables noise premultiplication
          blendFunction={BlendFunction.ADD} // blend mode
        />
        <Vignette />

      </EffectComposer>}
    </Suspense>
  );
}

export default Effects;
