import React, {useState} from "react";
import {GroupConfig} from "../models/GroupConfig";
import {useBox, usePlane} from "@react-three/cannon";
import BlockLoader from "./BlockLoader";
import {Html} from "@react-three/drei";

const GroupLoader = (config: GroupConfig, index: number) => {
    const [position, setPosition] = useState(config.transform.position);
    const [rotation, setRotation] = useState(config.transform.rotation);
    const [scale, setScale] = useState(config.transform.scale);

    const [castShadow, setCastShadow] = useState(config.castShadow);
    const [receiveShadow, setReceiveShadow] = useState(config.receiveShadow);

    const [enabled, setEnabled] = useState<boolean>(config.physics.enabled);
    const [mass, setMass] = useState<number>(config.physics?.mass || 0);

    const [hovered, setHover] = useState(false);

    const [ref, api] = useBox(() => ({ mass, position}));
    return <group ref={ref} key={index} name={config.name} castShadow={castShadow} receiveShadow={receiveShadow} scale={scale} userData={{
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
            },
            physics: {
                enabled: {
                    label: 'Enabled',
                    value: enabled,
                    onChange: (value: boolean) => {
                        setEnabled(value);
                    }
                },
                mass: {
                    label: 'Mass',
                    value: mass,
                    onChange: (value: number) => {
                        setMass(value);
                    },
                    render: (get: any) => get('enabled')
                }
            }
        }
    }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
    >
    {config.objects.map((object, index) => <BlockLoader key={index} {...object}/>)}
        <Html distanceFactor={10} style={{ pointerEvents: "none", display: hovered ? "block" : "none" }}>
            <div className="content">{config.name}</div>
        </Html>
    </group>;
}
export default GroupLoader;
