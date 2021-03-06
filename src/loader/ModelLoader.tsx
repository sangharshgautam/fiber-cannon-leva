import {useLoader, useThree} from "@react-three/fiber";
import {TextureLoader} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import React, {useState} from "react";
import {ModelConfig} from "../models/ModelConfig";

const ModelLoader = (modelConfig: ModelConfig, index: number) => {
    const [position, setPosition] = useState(modelConfig.position);
    const [rotation, setRotation] = useState(modelConfig.rotation);
    const [scale, setScale] = useState(modelConfig.scale);

    const { raycaster, mouse, camera, scene, gl } = useThree();
    // @ts-ignore
    // const envMap = useLoader(HDRCubeTextureLoader, ['assets/hoverinc/street-by-water.hdr']);
    // const envMapLDR = useLoader(TextureLoader, 'assets/hoverinc/envmap.jpg');
    const gltf = useLoader(GLTFLoader, modelConfig.url);
    const model = gltf.scene;
    model.scale.set(modelConfig.scale[0], modelConfig.scale[1], modelConfig.scale[2]);
    model.position.set(modelConfig.position[0], modelConfig.position[1], modelConfig.position[2]);
    model.rotation.set(modelConfig.rotation[0], modelConfig.rotation[1], modelConfig.rotation[2]);
    model.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
            // only necessary for WebGLRenderer
            child.castShadow = true;
            child.receiveShadow = true;
        }
        if (child.material && child.material.name == 'LensesMat') {
            child.material.transparent = true;
        }
    });
    model.userData ={
        controls: {
            transform: {
                position: {
                    label: 'Position',
                        value: position,
                        onChange: (value: [number, number, number]) => {
                        setPosition(value);
                    }
                },
                rotation: {
                    label: 'Rotation',
                        value: rotation,
                        onChange: (value: [number, number, number]) => {
                        setRotation(value);
                    }
                },
                scale: {
                    label: 'Scale',
                        value: scale,
                        onChange: (value: [number, number, number]) => {
                        setScale(value);
                    },
                        lock: true
                }
            }
        }
    }
    return(<primitive key={index} object={model}></primitive>)
}
export default ModelLoader;
