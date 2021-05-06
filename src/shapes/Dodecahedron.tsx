// @ts-ignore
import {useBox, useSphere} from "@react-three/cannon";
import React, {useState} from "react";
import usePromise from "react-promise-suspense";
import {Html} from "@react-three/drei";
import * as THREE from "three";
import { meshBounds } from '@react-three/drei'




// @ts-ignore
const Dodecahedron = ({ time,...props }) => {

    const [radius, setRadius] = useState(2);
    const [color, setColor] = useState('#fff');
    // const controls = useControls('Shape', {
    //     radius:{
    //         value: 2,
    //         min : 1,
    //         max: 10,
    //         step: 1
    //     },
    //     color: {
    //         value: '#fff'
    //     }
    // });
    const mass = 1;
    const [ref] = useSphere(() => ({ mass,args: radius, ...props }));

    const [hovered, setHover] = useState(false)

    // In here it could load textures, images, triangulate textgeometry, etc
    // The line below produces a fake load, emulating loading assets/set-up processing
    usePromise(ms => new Promise(res => setTimeout(res, ms)), [time])
    // React will bail out until the suspense is lifted, then it renders the view

    const materialDefault = new THREE.MeshPhysicalMaterial({
        color: color,
        roughness: 0.8
    })
    const materialHover = new THREE.MeshPhysicalMaterial({
        color: 0xcc0000,
        roughness: 0.1
    })
    return (
        <mesh ref={ref} {...props} raycast={meshBounds} userData={{
            controls: [
                {
                    title: 'radius',
                    value: 2
                }
            ]
        }}
              onPointerOver={() => setHover(true)}
              onPointerOut={() => setHover(false)}
              material={hovered ? materialHover : materialDefault} >
            <dodecahedronBufferGeometry args={[hovered ? (radius+radius/10): radius]}></dodecahedronBufferGeometry>
            <Html scale={10} style={{ pointerEvents: "none", display: hovered ? "block" : "none" }}>
                <div className="content">
                    Suspense <br />
                    {mass}ms
                </div>
            </Html>
        </mesh>
    )

}
export default Dodecahedron;
