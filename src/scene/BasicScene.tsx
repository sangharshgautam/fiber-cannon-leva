import Plane from "../shapes/Plane";
import Dodecahedron from "../shapes/Dodecahedron";
import {Physics} from "@react-three/cannon";
import React, {useEffect, useRef} from "react";
import {folder, useControls} from "leva";
import niceColors from 'nice-color-palettes'
import {Canvas, useThree} from "@react-three/fiber";
import TransformControlsLock from "../three-extension/TransformControlsLock";
import {ObjectData, useObjectStore} from "../store/ObjectStore";
import {Box} from "@react-three/drei";
import Cube from "../shapes/Cube";
import {ValueIcon} from "@radix-ui/react-icons";

// @ts-ignore
const BasicScene = () => {

    const { raycaster, mouse, camera, scene, gl } = useThree();

    const values = useControls('Scene', {
        scene_id: {
            label: 'id',
            value: scene.id
        },
        name: scene.name,
        'Camera': folder({
            camera_id: {
                label: 'id',
                value: camera.id
            },
            camera_name: {
                label: 'Camera',
                value: camera.name
            },
            'Second Folder': folder({
                a: 'hello',
                b: 'ff005b',
            }),
            'Third Collapsed Folder': folder(
                {
                    a: 'hello',
                    b: 'ff005b',
                },
                {
                    collapsed: true,
                }
            ),
        },{
            collapsed: true,
        })
    }, [scene, camera]);
    return (

        <Physics>
            <TransformControlsLock></TransformControlsLock>
            <Plane color={niceColors[17][1]} args={[20,20]} position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}/>

            {/*<Dodecahedron time={0}/>*/}
        </Physics>
    )
}
export default BasicScene;
