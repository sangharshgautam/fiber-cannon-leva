import React, {Suspense, useEffect, useRef, useState} from "react"
import {Camera, Canvas, extend, useFrame, useThree, render} from "@react-three/fiber"
import * as THREE from "three"
import { Html, OrbitControls, TransformControls } from "@react-three/drei"
import './App.css';
import {Color} from "three";
import BasicScene from "./scene/BasicScene";


const Fallback = () => (
    <Html>
        <div className="loading">Loading...</div>
    </Html>
)

function App() {
    const [selectedObject, setSelectedObject] = useState<THREE.Object3D>();

    return (
        <>
            <canvas id="canvas-hoverinc" style={{width: 500, height: 500, background: "white", display: "none"}}></canvas>
            <Canvas id={"canvas-webgl"} style={{ background: "#BFD1E5"}} camera={{ position: [10, 5, 10], rotation:[0, 0, 0], fov: 50 }}
                    gl={{alpha: true}}
                    // raycaster={{ filter: (intersects, state) => intersects.reverse()}}
            >

                <axesHelper args={[20]}/>
                <pointLight color={new Color('indianred')} />
                <pointLight position={[10, 10, -10]} color={new Color('orange')} />
                <pointLight position={[-10, -10, 10]} color={new Color('lightblue')} />
                <Suspense fallback={<Fallback />}>
                    <BasicScene />
                </Suspense>
                {/*<EffectComposer>*/}
                {/*    <SelectiveBloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />*/}
                {/*</EffectComposer>*/}
            </Canvas>
        </>

  );
}

export default App;
