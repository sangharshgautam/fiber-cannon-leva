import {usePlane} from "@react-three/cannon";
import React from "react";
import * as THREE from "three";

// @ts-ignore
function Plane({ color, ...props }) {
    const [ref] = usePlane(() => ({...props }))
    return (
        <mesh ref={ref} name={"Plane"} receiveShadow={true}>
            <planeBufferGeometry args={props.args || [100, 100]}/>
            <meshPhysicalMaterial attach="material" color={color} wireframe={false} side={THREE.DoubleSide}></meshPhysicalMaterial>
        </mesh>
    )
}
export default Plane;
