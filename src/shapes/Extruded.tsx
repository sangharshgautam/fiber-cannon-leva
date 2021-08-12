import {useBox} from "@react-three/cannon";
import React, {useEffect, useRef, useState} from "react";
import {Color, Mesh} from "three";
import MyDecal from "../three-extension/MyDecal";
import DecalConfig from "../models/DecalConfig";
import * as THREE from "three";

// @ts-ignore
function Extruded(objectData: ObjectData) {
    const [args, setArgs] = useState<[]>(objectData.geometry.args);

    const [position, setPosition] = useState(objectData.transform.position);
    const [rotation, setRotation] = useState(objectData.transform.rotation);
    const [scale, setScale] = useState(objectData.transform.scale);

    const [castShadow, setCastShadow] = useState(objectData.castShadow);

    const [color, setColor] = useState(objectData.material.color);
    const [wireframe, setWireframe] = useState(objectData.material.wireframe);
    const[reflectivity, setReflectivity] = useState(objectData.material.reflectivity);

    const [physicsEnabled, setPhysicsEnabled] = useState(objectData.physics.enabled);
    const [mass, setMass] = useState(objectData.physics.mass);

    const [ref, api] = useBox(() => ({ args, mass, position, rotation, scale }));
    const [hovered, setHover] = useState(false)

    const mesh = useRef<Mesh>(null!)
    // useEffect(() => {
    //     api.position.set(position[0], position[1], position[2]);
    //     api.rotation.set(rotation[0], rotation[1], rotation[2]);
    //     api.mass?.set(mass);
    // }, [position, rotation, mass]);
    const renderDecal = (decalData: DecalConfig, index: number) => {
        if(mesh.current){
            return <MyDecal key={index} mesh={mesh.current} decalData={decalData}/>
        }
    }

    const shape = new THREE.Shape();
    shape.moveTo( 0,0 );
    objectData.geometry.args.forEach((arg: any) => shape.lineTo(arg.x, arg.y));

    const extrudeSettings = {
        steps: 2,
        depth: 2,
        bevelEnabled: false,
        bevelThickness: 1,
        bevelSize: 1,
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
                    },
                    physics: {
                        enabled: {
                            label: 'Enabled',
                            value: physicsEnabled,
                            onChange: (value: boolean) => {
                                setPhysicsEnabled(value);
                            }
                        },
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
                  // onPointerOver={() => setHover(true)}
                  // onPointerOut={() => setHover(false)}
            >
                <extrudeBufferGeometry args={[shape, extrudeSettings]}></extrudeBufferGeometry>
                <meshPhysicalMaterial color={color} wireframe={wireframe} reflectivity={reflectivity}></meshPhysicalMaterial>
            </mesh>
            {objectData.decals.map(renderDecal)}
        </>

    )
}
export default Extruded;
