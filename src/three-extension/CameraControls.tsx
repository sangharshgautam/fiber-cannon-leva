// Extend will make OrbitControls available as a JSX element called orbitControls for us to use.
import {extend, useFrame, useThree} from "@react-three/fiber";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import React, {useRef} from "react";

extend({ OrbitControls });
const CameraControls = (props:{enabled: boolean}) => {
    // Get a reference to the Three.js Camera, and the canvas html element.
    // We need these to setup the OrbitControls component.
    // https://threejs.org/docs/#examples/en/controls/OrbitControls
    const {
        camera,
        gl: { domElement },
    } = useThree();
    // Ref to the controls, so that we can update them on every frame using useFrame
    const controls = useRef<OrbitControls>();
    if(controls && controls.current){
        controls.current.enabled = props.enabled;
    }
    // @ts-ignore
    useFrame((state) => controls.current.update());
    // @ts-ignore
    return <orbitControls ref={controls} args={[camera, domElement]} />;
};
export default CameraControls;
