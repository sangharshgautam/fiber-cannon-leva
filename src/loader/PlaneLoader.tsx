import {useBox, usePlane} from "@react-three/cannon";
import React, {useEffect, useRef, useState} from "react";
import {DoubleSide} from "three";

// @ts-ignore
function PlaneLoader(objectData: ObjectData) {
    const [args, setArgs] = useState<[number, number]>(objectData.geometry.args);

    const [position, setPosition] = useState(objectData.transform.position);
    const [rotation, setRotation] = useState(objectData.transform.rotation);
    const [scale, setScale] = useState(objectData.transform.scale);

    const [castShadow, setCastShadow] = useState(objectData.castShadow);

    const [color, setColor] = useState(objectData.material.color);
    const [wireframe, setWireframe] = useState(objectData.material.wireframe);
    const[reflectivity, setReflectivity] = useState(objectData.material.reflectivity);

    const [mass, setMass] = useState(objectData.physics.mass);
    const userData = {
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
                    value: args,
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
    };
    const [ref, api] = usePlane(() => ({ mass }));

    useEffect(() => {
        api.position.set(position[0], position[1], position[2]);
        api.rotation.set(rotation[0], rotation[1], rotation[2])
        api.mass?.set(mass);
    }, [position, rotation, mass]);
    return (
        <>
            <mesh ref={ref} name={"Plane"} castShadow={castShadow} scale={scale} userData={userData}>
                <planeBufferGeometry args={args}/>
                <meshPhysicalMaterial color={color} wireframe={wireframe} reflectivity={reflectivity} side={DoubleSide}></meshPhysicalMaterial>
            </mesh>
        </>)
}
export default PlaneLoader;
