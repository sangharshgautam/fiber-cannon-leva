import React, {Suspense, useEffect, useRef, useState} from "react"
import {Camera, Canvas, extend, useFrame, useThree, render} from "@react-three/fiber"
import * as THREE from "three"
import { Html, OrbitControls, TransformControls } from "@react-three/drei"
import './App.css';
import {ACESFilmicToneMapping, Color, Vector3} from "three";
import BasicScene from "./scene/BasicScene";
import {LightConfig} from "./models/LightConfig";
import sceneConfig from "./scenes/model.json";
import {SceneConfig} from "./models/SceneConfig";
import create from "zustand";
import {ObjectConfig} from "./models/ObjectConfig";
import {combineAndImmer} from "./store/ObjectStore";

const Fallback = () => (
    <Html>
        <div className="loading">Loading...</div>
    </Html>
)
const config: SceneConfig = sceneConfig as any;
export const useObjectStore = create(
    combineAndImmer({objects: config.objects, models: config.models}, (set) => ({
        updateObject: (object: ObjectConfig, index: number) =>
            set((state) => {
                // state.objects[index] = object;
            }),
        addObject: (object: ObjectConfig) =>
            set((state) => {
                // state.objects.push(object);
            })
    }))
);
function App() {

    const [selectedObject, setSelectedObject] = useState<THREE.Object3D>();

    const renderLight = (config: LightConfig, index: number) => {
        if(config.type === "Hemisphere"){
            return <hemisphereLight args={[0xffffff, 0x444444]} position={config.position} />
        }
        if(config.type === "Directional") {
            return <directionalLight args={[0xffffff]} position={config.position} />
        }
        return <pointLight args={[config.args]} key={index} position={config.position}/>;
    }
    return (
        <>
            <canvas id="canvas-hoverinc" style={{width: 500, height: 500, background: "white", display: "none"}}></canvas>
            <Canvas id={"canvas-webgl"} style={config.canvas}
                    camera={config.camera}
                    gl={config.gl}
                    // raycaster={{ filter: (intersects, state) => intersects.reverse()}}
            >

                <axesHelper args={[20]}/>
                {config.lights.map(renderLight)}
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
