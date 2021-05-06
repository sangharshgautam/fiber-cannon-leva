import {Box, OrbitControls, RoundedBox, TransformControls} from "@react-three/drei";
import React, {useEffect, useRef, useState} from "react";
import {LevaInputs, useControls} from "leva";
import {useThree} from "@react-three/fiber";
import Dodecahedron from "../shapes/Dodecahedron";
import * as THREE from 'three';
import Cube from "../shapes/Cube";
import {Control} from "../control/control";
import {ObjectData, useObjectStore} from "../store/ObjectStore";
import {MyTransformControls} from "./MyTransformControls";
import {Group} from "three";

const TransformControlsLock = () => {


    const [{ mode }, setMode] = useControls('Transform',() => ({ mode: {
            label: 'Mode',
            value: 'scale',
            options: {
                scale: 'scale',
                rotate: 'rotate',
                translate: 'translate'
            },
            // render: (get) => selectedObject != null
        } }));

    const [selectedObject, setSelectedObject] = useState<THREE.Object3D>();

    const orbitControls = useRef<any>(null!);
    const transformControls =  useRef<any>(null!);

    const { raycaster, mouse, camera, scene, gl } = useThree();
    useEffect(() => {
        if(transformControls.current) {
            const {current: controls} = transformControls;
            const callback = (event: any) => {
                orbitControls.current.enabled = !event.value;
                if (mode === "translate" && !event.value) {
                    setTransform({position: (transformControls.current?.object as THREE.Object3D).position.toArray()});
                }
                if (mode === "rotate" && !event.value) {
                    const orientation = (transformControls.current?.object as THREE.Object3D).rotation;
                    setTransform({rotation: [orientation.x, orientation.y, orientation.z]});
                }
                if (mode === "scale" && !event.value) {
                    setTransform({scale: (transformControls.current?.object as THREE.Object3D).scale.toArray()});
                }
            }
            controls.addEventListener('dragging-changed', callback)
            return () => controls.removeEventListener('dragging-changed', callback)
        }
    })

    const [, setTransform] = useControls('Transform', () => ({
        position: {
            label: 'Position',
            value: [0, 0, 0],
            onChange: (value: any) => {
                selectedObject?.userData.controls.position.onChange(value);
            },
            render: (get) => selectedObject != null
        },
        rotation: {
            label: 'Rotation',
            value: [0, 0, 0],
            onChange: (value: any) => {
                selectedObject?.userData.controls.rotation.onChange(value);
            },
            render: (get) => selectedObject != null

        },
        scale: {
            value: [0, 0, 0],
            onChange: (value: any) => {
                selectedObject?.userData.controls.scale.onChange(value);
            },
            render: (get) => selectedObject != null
        }
    }), [selectedObject]);


    const [, setMaterial] = useControls('Material', () => ({
        color: {
            label: 'Color',
            value: '#fff',
            onChange: (value: any) => {
                selectedObject?.userData.controls.material.color.onChange(value);
            },
            render: (get) => selectedObject != null
        }
    }), [selectedObject]);

    const [materialControls, setMaterialControls] = useState<any[]>([])
    const inputs = materialControls.reduce((control, _, i) => Object.assign(control, { [_.title]: {
            label: _.title,
            value: _.value,
            onChange: (value: any) => {
                _.onChange(value);
            }
        } }), {})
    const values = useControls('Material', inputs, [materialControls]);

    useEffect(() => {
        if(selectedObject && selectedObject.userData.controls){
            setTransform({position: selectedObject.userData.controls.position.value});
            setTransform({rotation: selectedObject.userData.controls.rotation.value});
            setTransform({scale: selectedObject.userData.controls.scale.value});
            // setMaterialControls([]);
            setMaterial({ color: selectedObject.userData.controls.material.color.value});
        } else {
            setMaterialControls([]);
        }
    },[selectedObject]);


    const objects: ObjectData[] = useObjectStore((state: any) => state.objects);

    const onPointerDown = (event: PointerEvent) => {
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children).filter(intersect => intersect.object.name === 'Cube');
        // .sort((a, b) => a.distance < b.distance ? 1: -1);
        if (intersects.length) {
            const object = intersects[0].object;
            if(object.userData){
                setSelectedObject(object);
            }
        }

    }
    document.addEventListener( 'pointerdown', onPointerDown );
    return (
        <>
            {selectedObject && <MyTransformControls
                ref={transformControls}
                enabled={true}
                position={selectedObject.position}
                rotation={selectedObject.rotation}
                scale={selectedObject.scale}
                mode={mode}
                camera={camera}
                showX={true}
                showY={true}
                showZ={true}
                size={1}
                space={"local"}
                axis={null}
                translationSnap={null}
                rotationSnap={null}
                scaleSnap={null}
                dragging
                castShadow receiveShadow
                object={selectedObject}
            >
            </MyTransformControls>
            }
            <OrbitControls
                ref={orbitControls}
                // enableDamping={true}
                // dampingFactor={0.25}
                // rotateSpeed={0.4}
                // keyPanSpeed={0.4}
                // screenSpacePanning={true}
                // zoomSpeed={0.6}
                // enablePan={true}
                // panSpeed={0.4}
                // minPolarAngle={Math.PI / 4}
                // maxPolarAngle={Math.PI / 2}
                // minDistance={-500}
                // maxDistance={1000}
            />
            <Dodecahedron time={0} />
            {objects.map((objectData, index)=> {
                return (
                    <Cube key={index} args={[3,3,3]} {...objectData}/>
                )
            })}
        </>

        )
}
export default TransformControlsLock;
