import {useBox} from "@react-three/cannon";
import React, {useEffect, useState} from "react";
import {useControls} from "leva";
import * as THREE from 'three';
import {Html} from "@react-three/drei";
import {Color} from "three";
import {ObjectData} from "../store/ObjectStore";

// @ts-ignore
function Cube(objectData: ObjectData) {
    const [args, setArgs] = useState<[]>(objectData.geometry.args);
    const [position, setPosition] = useState(objectData.transform.position);
    const [rotation, setRotation] = useState(objectData.transform.rotation);
    const [scale, setScale] = useState(objectData.transform.scale);

    const [castShadow, setCastShadow] = useState(objectData.castShadow);

    const [color, setColor] = useState(objectData.material.color);
    const [mass, setMass] = useState(objectData.physics.mass);

    const [wireframe, setWireframe] = useState(objectData.material.wireframe);

    const[reflectivity, setReflectivity] = useState(objectData.material.reflectivity);

    const [ref, api] = useBox(() => ({ args, mass, position, rotation, scale }));
    const [hovered, setHover] = useState(false)


    useEffect(() => {
        api.position.set(position[0], position[1], position[2]);
        api.position.set(rotation[0], rotation[1], rotation[2])
        api.mass?.set(mass);
    }, [position, rotation, mass]);
    return (
        <mesh name={"Cube"} castShadow={castShadow} position={position} rotation={rotation} scale={scale} userData={{
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
                        }
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
                },
                physics: {
                    mass: {
                        label: 'Mass',
                        value: mass,
                        onChange: (value: number) => {
                            setMass(value);
                        }
                    }
                }
            }
        }}
              onPointerOver={() => setHover(true)}
              onPointerOut={() => setHover(false)}>
            <boxBufferGeometry args={args}/>
            <meshPhysicalMaterial color={color} wireframe={wireframe} reflectivity={reflectivity}></meshPhysicalMaterial>
            <Html distanceFactor={10} style={{ pointerEvents: "none", display: hovered ? "block" : "none" }}>
                <div className="content">
                    Mass: {mass}
                </div>
            </Html>
        </mesh>
    )
}
export default  Cube;
