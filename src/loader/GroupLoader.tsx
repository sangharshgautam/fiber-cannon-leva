import React, {useState} from "react";
import {GroupConfig} from "../models/GroupConfig";
import ObjectLoader from "./ObjectLoader";
import {useBox} from "@react-three/cannon";

const GroupLoader = (config: GroupConfig, index: number) => {

    const [position, setPosition] = useState(config.position);
    const [rotation, setRotation] = useState(config.rotation);
    const [scale, setScale] = useState(config.scale);

    const [castShadow, setCastShadow] = useState(config.castShadow);

    const [ref, api] = useBox(() => ({ mass: 1, position, rotation, scale }));

    return <group ref={ref} key={index} name={config.name} castShadow={castShadow} position={position} rotation={rotation} scale={scale} userData={{
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
    }}>
        {config.objects.map((object, index) => <ObjectLoader key={index} {...object}></ObjectLoader>)}
    </group>;
}
export default GroupLoader;
