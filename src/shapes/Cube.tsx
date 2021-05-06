import {useBox} from "@react-three/cannon";
import React, {useEffect, useState} from "react";
import {useControls} from "leva";
import * as THREE from 'three';
import {Html} from "@react-three/drei";
import {Color} from "three";

// @ts-ignore
function Cube({ ...props }) {
    const [position, setPosition] = useState(props.position);
    const [rotation, setRotation] = useState(props.rotation);
    const [scale, setScale] = useState(props.scale);

    const [color, setColor] = useState(props.material.color);
    const mass = 1;

    const [ref, api] = useBox(() => ({ mass, ...props }));
    const [hovered, setHover] = useState(false)


    return (
        <mesh position={position} rotation={rotation} scale={scale} name={"Cube"} userData={{
            controls: {
                position: {
                    label: 'Position',
                    value: position,
                    onChange: (value: THREE.Vector3) => {
                        setPosition(value);
                    }
                },
                rotation: {
                    label: 'Rotation',
                    value: rotation,
                    onChange: (value: THREE.Vector3) => {
                        setRotation(value);
                    }
                },
                scale: {
                    label: 'Scale',
                    value: scale,
                    onChange: (value: THREE.Vector3) => {
                        setScale(value);
                    }
                },
                material: {
                    color: {
                        label: 'color',
                        value: color,
                        onChange: (value: string) => {
                            setColor(value);
                        }
                    }
                }
            }
        }}
              // onPointerOver={() => setHover(true)}
              // onPointerOut={() => setHover(false)}
        >
            <boxBufferGeometry args={props.args}/>
            <meshPhysicalMaterial color={color}></meshPhysicalMaterial>
            <Html scale={10} style={{ pointerEvents: "none", display: hovered ? "block" : "none" }}>
                <div className="content">
                    Mass <br />
                    {mass}
                </div>
            </Html>
        </mesh>
    )
}
export default  Cube;
