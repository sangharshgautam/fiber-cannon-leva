import {OrbitControls, useGLTF, useTexture} from "@react-three/drei";
import React, {useEffect, useRef, useState} from "react";
import {button, buttonGroup, folder, LevaInputs, useControls} from "leva";
import {useLoader, useThree} from "@react-three/fiber";
import Dodecahedron from "../shapes/Dodecahedron";
import * as THREE from 'three';
import {MyTransformControls} from "./MyTransformControls";
import {CubeTextureLoader, Object3D, TextureLoader, Vector2, Vector3} from "three";
import {DimensionsIcon} from "@radix-ui/react-icons";
import { Environment } from '@react-three/drei'
import {HDRCubeTextureLoader} from "three/examples/jsm/loaders/HDRCubeTextureLoader";
import {BlockConfig} from "../models/BlockConfig";
import {useObjectStore} from "../App";
import {ModelConfig} from "../models/ModelConfig";
import ModelLoader from "../loader/ModelLoader";
import {GroupConfig} from "../models/GroupConfig";
import GroupLoader from "../loader/GroupLoader";
import {useBox, usePlane} from "@react-three/cannon";

function Plane(props: any) {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
    return (
        <mesh ref={ref}>
            <planeBufferGeometry args={[100, 100]} />
        </mesh>
    )
}

function Cube(props: any) {
    const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 0], ...props }))
    return (
        <group ref={ref}>
            <mesh position={[5, 0, 5]}>
                <boxBufferGeometry />
                <meshPhysicalMaterial color={"#AA874D"}></meshPhysicalMaterial>
            </mesh>
        </group>

    )
}
const TransformControlsLock = () => {

    const { raycaster, mouse, camera, scene, gl } = useThree();
    const reduce = (objects: Object3D[], into: Object): {  } => {
        return objects.reduce((obj, child, i) => {
                const schema = {
                    // [`${child.type}_${child.name}`]: button(() => alert(child.id))
                    [`${child.type}_${child.uuid}_uuid`]: {
                        label: 'id',
                        value: child.uuid,
                        type: LevaInputs.STRING
                    }
                };
                if(child.name){
                    schema[`${child.type}_${child.name}_name`]= {
                        label: 'name',
                        value: child.name,
                        type: LevaInputs.STRING
                    }
                }
                const s = {[`Select_${child.uuid.substr(0, 4)}`]: button(() => setSelectedObject(scene.getObjectById(child.id)))}
                // console.log(child);
                reduce(child.children, {s});
                const p = {
                    [`${child.type}_${child.uuid.substr(0, 4)}`]: folder(s, {collapsed: true})
                }

                return Object.assign(obj, p);
            },
            into);
    }
    const sc = {'Scene': {
            label: 'uuid',
            value: scene.id,
            type: LevaInputs.STRING
        }};
    reduce(scene.children, sc);
    useControls('Scene', sc, [scene, scene.children]);

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
            // render: (get) => selectedObject != null
        },
        'Preset': buttonGroup({
            label: <DimensionsIcon/>,
            opts: {
            'Translate': () => setMode({ mode: 'translate' }),
            'Rotate': () => setMode({ mode: 'rotate' }),
            'Scale': () => setMode({ mode: 'scale' }),
        }})
    }));

    const [selectedObject, setSelectedObject] = useState<THREE.Object3D>();

    const orbitControls = useRef<any>(null!);
    const transformControls =  useRef<any>(null!);

    useEffect(() => {
        if(transformControls.current && orbitControls.current) {
            const {current: controls} = transformControls;
            const callback = (event: any) => {
                orbitControls.current.enabled = !event.value;
                if (mode === "translate" && !event.value) {
                    // setTransform({position: (transformControls.current?.object as THREE.Object3D).position.toArray()});
                }
                if (mode === "rotate" && !event.value) {
                    const orientation = (transformControls.current?.object as THREE.Object3D).rotation;
                    // setTransform({rotation: [orientation.x, orientation.y, orientation.z]});
                }
                if (mode === "scale" && !event.value) {
                    // setTransform({scale: (transformControls.current?.object as THREE.Object3D).scale.toArray()});
                }
            }
            controls.addEventListener('dragging-changed', callback)
            return () => controls.removeEventListener('dragging-changed', callback)
        }
    })

    const objectProps = selectedObject?.userData.controls || {};
    const [, setObjectProps] = useControls('Mesh', () => (objectProps) , [selectedObject]);

    const transform = selectedObject?.userData.controls?.transform || {
        position: [0, 0, 0],
        rotation : [0, 0, 0],
        scale: [1, 1, 1]};
    const [, setTransform] = useControls('Transform', () => (transform), [selectedObject]);

    const [args, setArgs] = useState<any[]>([])
    const inputs = args
        .reduce((control, _, i) =>{
            return Object.assign(control, { [`Point_${i}`]: {
                label: `Point_${i}`,
                value:_,
                onChange: (value: number) => {
                    // args[i] = value as any;
                    // selectedObject?.userData.controls.geometry.args.onChange(args);
                    console.log(value);
                }
            } })
        }, {})
    const values = useControls('Geometry', inputs, [args])

    const geometry = selectedObject?.userData.controls?.geometry || {};
    const [, setGeometry] = useControls('Geometry', () => (geometry), [selectedObject]);

    const material = selectedObject?.userData.controls?.material || {};
    const [, setMaterial] = useControls('Material', () => (material), [selectedObject]);

    const physics = selectedObject?.userData.controls?.physics || {};
    const [, setPhysics] = useControls('Physics', () => (physics), [selectedObject]);

    // const { y } = useControls({
    //     i: 100,
    //     y: plot({ expression: 'cos(x)' })
    // }, {})
    // useControls('Labels', {
    //     label: {
    //         image: ''
    //     },
    //     Apply: button(() => alert('click'))
    // });


    useEffect(() => {
        if(selectedObject){
            const orientation = selectedObject.rotation;
            setTransform({position: selectedObject.position.toArray()});
            setTransform({rotation: [orientation.x, orientation.y, orientation.z]});
            setTransform({scale: selectedObject.scale.toArray()});

            if(selectedObject.userData.controls){
                setObjectProps({castShadow: selectedObject.userData.controls.castShadow?.value});
                // setArgs({args: selectedObject.userData.controls.geometry.args.value});

                setGeometry({args: selectedObject.userData.controls.geometry.args.value});
                setMaterial({ color: selectedObject.userData.controls.material.color.value});
                setMaterial({ wireframe: selectedObject.userData.controls.material.wireframe.value});
                // setPhysics({enabled: selectedObject.userData.controls.physics?.enabled?.value});
                // setPhysics({mass: selectedObject.userData.controls.physics.mass.value});

            }else{

            }
        } else {
            // setMaterialControls([]);
        }
    },[selectedObject]);



    const objects: BlockConfig[] = useObjectStore((state: any) => state.objects);
    const models: ModelConfig[] = useObjectStore((state: any) => state.models);
    const groups: GroupConfig[] = useObjectStore((state: any) => state.groups);

    const onPointerDown = (event: PointerEvent) => {
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children).filter(intersect => intersect.object.type === 'Group');
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
            {/*{models.map((model, index) => <ModelLoader key={index}  {...model}></ModelLoader>)}*/}
            <Environment preset="sunset" background/>
            {/*{objects.map((object, index) => <ObjectLoader key={index} {...object}></ObjectLoader>)}*/}
            <Plane></Plane>
            {groups.filter(group=> group.disabled !== true).map((group, index) => <GroupLoader key={index} {...group}></GroupLoader>)}

        </>

        )
}
export default TransformControlsLock;
