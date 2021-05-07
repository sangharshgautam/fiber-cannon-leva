import {OrbitControls} from "@react-three/drei";
import React, {useEffect, useRef, useState} from "react";
import {button, buttonGroup, useControls} from "leva";
import {useThree} from "@react-three/fiber";
import Dodecahedron from "../shapes/Dodecahedron";
import * as THREE from 'three';
import Cube from "../shapes/Cube";
import {ObjectData, useObjectStore} from "../store/ObjectStore";
import {MyTransformControls} from "./MyTransformControls";
import NPoint from "../shapes/NPoint";
import {Vector2} from "three";

const TransformControlsLock = () => {

    // @ts-ignore
    const [{mode}, setMode] = useControls('Transform', () => ({
        mode: {
            label: 'Mode',
            value: 'translate',
            options: {
                scale: 'scale',
                rotate: 'rotate',
                translate: 'translate'
            },
            render: (get) => selectedObject != null
        },
        'Preset': buttonGroup({
            'Translate': () => setMode({ mode: 'translate' }),
            'Rotate': () => setMode({ mode: 'rotate' }),
            'Scale': () => setMode({ mode: 'scale' }),
        }),
    }));

    const [selectedObject, setSelectedObject] = useState<THREE.Object3D>();

    const orbitControls = useRef<any>(null!);
    const transformControls =  useRef<any>(null!);

    const { raycaster, mouse, camera, scene } = useThree();
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
        castShadow: {
            label: 'Cast Shadow',
            value: false,
            onChange: (value: boolean) => {
                selectedObject?.userData.controls.castShadow.onChange(value);
            },
            render: (get) => selectedObject != null
        },
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
            label: 'Scale',
            hint: 'Scale',
            value: [0, 0, 0],
            min: 0.1,
            step: 0.2,
            onChange: (value: any) => {
                selectedObject?.userData.controls.scale.onChange(value);
            },
            render: (get) => selectedObject != null
        }
    }), [selectedObject]);

    const [changeCount, setChangeCount] = useState(0);
    const [args, setArgs] = useState([]);

    const reducer = (control: any, _: any, i: number) => {
        return Object.assign(control, { [`test${i}`]: {
            label: `test${i}`,
            value: _,
            onChange: (value: Vector2) => {
                // @ts-ignore
                args[i] = value;
                selectedObject?.userData.controls.geometry.args.onChange(args);
            }
        }});
    }
    const inputs = args.reduce(reducer, {});
    useControls('Geometry', inputs, [args, changeCount, setChangeCount]);
    useEffect(() => {
        console.log(args);
        if(selectedObject){
            console.log(args);
            selectedObject.userData.controls.geometry.args.onChange(args);
        }
    }, [args, selectedObject])

    const [, setMaterial] = useControls('Material', () => ({
        color: {
            label: 'Color',
            value: '#fff',
            onChange: (value: any) => {
                selectedObject?.userData.controls.material.color.onChange(value);
            },
            render: (get) => selectedObject != null
        },
        wireframe: {
            label: 'Wireframe',
            value: false,
            onChange: (value: boolean) => {
                selectedObject?.userData.controls.material.wireframe.onChange(value);
            },
            render: (get) => selectedObject != null
        },
        reflectivity: {
            label: 'Reflectivity',
            value: 0.5,
            min: 0.1,
            max: 1.0,
            step: 0.1,
            onChange: (value: number) => {
                selectedObject?.userData.controls.material.reflectivity.onChange(value);
            },
            render: (get) => selectedObject != null
        }
    }), [selectedObject]);

    const [, setPhysics] = useControls('Physics', () => ({
        mass: {
            label: 'Mass',
            value: 1,
            min: 0,
            max: 10,
            step: 1,
            suffix: 'kg',
            onChange: (value: any) => {
                selectedObject?.userData.controls.physics.mass.onChange(value);
            },
            render: (get) => selectedObject != null
        }
    }), [selectedObject]);

    useControls('Labels', {
        label: {
            image: ''
        },
        Apply: button(() => alert('click'))
    });

    useEffect(() => {
        if(selectedObject && selectedObject.userData.controls){
            setTransform({position: selectedObject.userData.controls.position.value});
            setTransform({rotation: selectedObject.userData.controls.rotation.value});
            setTransform({scale: selectedObject.userData.controls.scale.value});
            setTransform({castShadow: selectedObject.userData.controls.castShadow.value});
            setArgs(selectedObject.userData.controls.geometry.args.value);
            setMaterial({ color: selectedObject.userData.controls.material.color.value});
            setMaterial({ wireframe: selectedObject.userData.controls.material.wireframe.value});
            setPhysics({mass: selectedObject.userData.controls.physics.mass.value});
        } else {
            // setMaterialControls([]);
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
    const renderObject = (objectData: ObjectData, index: number) => {
        switch (objectData.type) {
            case "Cube":
                return <Cube key={index} {...objectData}/>;
            case "NPoint":
                return <NPoint key={index} {...objectData}/>;
        }
    }
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
            {objects.map(renderObject)}
        </>

        )
}
export default TransformControlsLock;
