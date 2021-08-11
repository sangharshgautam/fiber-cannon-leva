import React, {Suspense, useEffect, useRef, useState} from "react"
import {Camera, Canvas, extend, useFrame, useThree, render} from "@react-three/fiber"
import * as THREE from "three"
import { Html, OrbitControls, TransformControls } from "@react-three/drei"
import './App.css';
import {ACESFilmicToneMapping, Color, Vector3} from "three";
import BasicScene from "./scene/BasicScene";
import {ObjectData} from "./store/ObjectStore";
import Plane from "./shapes/Plane";
import Cube from "./shapes/Cube";
import NPoint from "./shapes/NPoint";
import {LightConfig} from "./store/LightConfig";
import {CameraConfig} from "./store/CameraConfig";
import {buttonGroup, useControls} from "leva";
import {InputIcon} from "@radix-ui/react-icons";


const Fallback = () => (
    <Html>
        <div className="loading">Loading...</div>
    </Html>
)

function App() {
    const [selectedObject, setSelectedObject] = useState<THREE.Object3D>();
    const lights: Array<LightConfig> = [
        {
            index: 0,
            position: [0, 0, 0],
            color: 'indianred'
        },
        {
            index: 1,
            position: [10, 10, -10],
            color: 'orange'
        },
        {
            index: 2,
            position: [-10, -10, 10],
            color: 'lightblue'
        }
    ];
    const renderLight = (config: LightConfig, index: number) => {
        return <pointLight key={config.index} position={config.position} color={new Color(config.color)} />;
    }
    return (
        <>
            <canvas id="canvas-hoverinc" style={{width: 500, height: 500, background: "white", display: "none"}}></canvas>
            <Canvas id={"canvas-webgl"} style={{ background: "#BFD1E5"}}
                    camera={{position: [10, 5, 10], rotation: [0, 0, 0], fov: 50}}
                    gl={{alpha: true}}
                    // raycaster={{ filter: (intersects, state) => intersects.reverse()}}
            >

                <axesHelper args={[20]}/>
                {lights.map(renderLight)}
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
