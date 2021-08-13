import React, {Suspense, useState} from "react";
import {SceneConfig} from "../models/SceneConfig";
import {Canvas} from "@react-three/fiber";
import * as THREE from "three";
import {LightConfig} from "../models/LightConfig";
import Fallback from "../Fallback";
import SceneLoader from "../loader/SceneLoader";


const SceneEditor = (config: SceneConfig, index: number) => {
    const [selectedObject, setSelectedObject] = useState<THREE.Object3D>();

    const renderLight = (config: LightConfig, index: number) => {
        if(config.type === "Hemisphere"){
            return <hemisphereLight args={[0xffffff, 0x444444]} position={config.position} />
        }
        if(config.type === "Directional") {
            return <directionalLight args={[0xffffff]} position={config.position} />
        }
        return <pointLight args={[config.color, 1, 100]} key={index} position={config.position}/>;
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
                    <SceneLoader {...config}/>
                </Suspense>
                {/*<EffectComposer>*/}
                {/*    <SelectiveBloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />*/}
                {/*</EffectComposer>*/}
            </Canvas>
        </>

    );
}
export default SceneEditor;
