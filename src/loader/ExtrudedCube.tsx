import {useBox} from "@react-three/cannon";
import React, {useEffect, useRef, useState} from "react";
import {Color, Mesh} from "three";
import MyDecal from "../three-extension/MyDecal";
import DecalConfig from "../models/DecalConfig";
import * as THREE from "three";

// @ts-ignore
function ExtrudedCube(objectData: ObjectData) {
    const [args, setArgs] = useState<number[]>(objectData.geometry.args);

    const [position, setPosition] = useState(objectData.transform.position);
    const [rotation, setRotation] = useState(objectData.transform.rotation);
    const [scale, setScale] = useState(objectData.transform.scale);

    const [castShadow, setCastShadow] = useState(objectData.castShadow);

    const [color, setColor] = useState(objectData.material.color);
    const [wireframe, setWireframe] = useState(objectData.material.wireframe);
    const[reflectivity, setReflectivity] = useState(objectData.material.reflectivity);

    const mesh = useRef<Mesh>(null!)
    const renderDecal = (decalData: DecalConfig, index: number) => {
        if(mesh.current){
            return <MyDecal key={index} mesh={mesh.current} decalData={decalData}/>
        }
    }
    const length = args[0], width = args[1];
    const shape = new THREE.Shape();
    shape.moveTo( 0,0 );
    shape.lineTo( 0, width );
    shape.lineTo( length, width );
    shape.lineTo( length, 0 );
    shape.lineTo( 0, 0 );


    objectData.geometry.args.forEach((arg: any) => shape.lineTo(arg.x, arg.y));

    const extrudeSettings = {
        steps: 2,
        depth: args[2],
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 1
    };
    return (
        <>
            <mesh ref={mesh} name={"Cube"} castShadow={castShadow} position={position} rotation={rotation} scale={scale} userData={{
                controls: {
                    castShadow: {
                        label: 'Cast Shadow',
                        value: castShadow,
                        onChange: (value: boolean) => {
                            setCastShadow(value);
                        }
                    },
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
                    },
                    geometry: {
                        args: {
                            label: 'Dimension',
                            value: args,
                            min: 0.1,
                            step: 0.2,
                            onChange: (value: any) => {
                                setArgs(value);
                            }
                        }
                    },
                    material: {
                        color: {
                            label: 'color',
                            value: color,
                            onChange: (value: string) => {
                                setColor(value);
                            }
                        },
                        wireframe: {
                            label: 'Wireframe',
                            value: wireframe,
                            onChange: (value: boolean) => {
                                setWireframe(value);
                            }
                        },
                        reflectivity: {
                            label: 'Reflectivity',
                            value: reflectivity,
                            onChange: (value: number) => {
                                setReflectivity(value);
                            }
                        }
                    }
                }
            }}
            >
                <extrudeBufferGeometry args={[shape, extrudeSettings]}></extrudeBufferGeometry>
                <meshPhysicalMaterial color={color} wireframe={wireframe} reflectivity={reflectivity}></meshPhysicalMaterial>
            </mesh>
            {objectData.decals.map(renderDecal)}
        </>

    )
}
export default ExtrudedCube;
