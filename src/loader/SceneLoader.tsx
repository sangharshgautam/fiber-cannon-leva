import {Physics, useBox, usePlane} from "@react-three/cannon";
import React, {useEffect, useState} from "react";
import {button, buttonGroup, folder, LevaInputs, useControls} from "leva";
import niceColors from 'nice-color-palettes'
import {useThree} from "@react-three/fiber";
import TransformControlsLock from "../three-extension/TransformControlsLock";
import {ACESFilmicToneMapping, Object3D, PerspectiveCamera, Vector3} from "three";
import {DimensionsIcon, InputIcon} from "@radix-ui/react-icons";
//@ts-ignore
import { RayTracingRenderer } from 'ray-tracing-renderer'
import {useTransform} from "leva/plugin";
import {SceneConfig} from "../models/SceneConfig";


const SceneLoader = (config: SceneConfig) => {
    const { raycaster, mouse, camera, scene, gl } = useThree();


    useTransform();

    const canvasRef = React.useRef() as React.MutableRefObject<HTMLCanvasElement>;
    const hoverinc = new RayTracingRenderer({
        canvas: document.getElementById("canvas-hoverinc"),
        antialias: true,
        alpha: true,
    });
    hoverinc.setSize(window.innerWidth, window.innerHeight);

    const tick = () => {

        hoverinc.render(scene, camera);
        requestAnimationFrame(tick);
    }


    // @ts-ignore
    const [{renderer}, setRenderer] = useControls('Renderer', () => ({
        renderer: {
            label: 'Provider',
            value: 'webgl',
            options: {
                webgl: 'webgl',
                hoverinc: 'hoverinc',
                erichlof: 'erichlof'
            },
            onChange(value: string) {
                if(value === 'hoverinc'){
                    // @ts-ignore
                    document.getElementById("canvas-hoverinc").style.display = 'block';
                    // @ts-ignore
                    document.getElementById("canvas-webgl").style.display = 'none';
                    hoverinc.gammaOutput = true;
                    hoverinc.gammaFactor = 2.2;
                    hoverinc.setPixelRatio(1.0);
                    hoverinc.toneMapping = ACESFilmicToneMapping;
                    hoverinc.toneMappingExposure = 1.5;
                    hoverinc.renderWhenOffFocus = false;
                    hoverinc.bounces = 3;
                    tick();
                }
                if(value == 'webgl') {
                    // @ts-ignore
                    document.getElementById("canvas-hoverinc").style.display = 'none';
                    // @ts-ignore
                    document.getElementById("canvas-webgl").style.display = 'block';
                }
            }
            // render: (get) => selectedObject != null
        },
        'Preset': buttonGroup({
            label: <InputIcon/>,
            opts: {
                'webgl': () => setRenderer({ renderer: 'webgl' }),
                'hoverinc': () => setRenderer({ renderer: 'hoverinc' }),
                'erichlof': () => setRenderer({ renderer: 'erichlof' }),
            }})
    }));

    const [, setCamera] = useControls('Camera', () => ({
        position: {
            label: 'Position',
            value: [camera.position.x, camera.position.y, camera.position.z],
            step: 5,
            onChange: (value: [number, number, number]) => {
                camera.position.setX(value[0]);
                camera.position.setY(value[1]);
                camera.position.setZ(value[2]);
            }
        },
        rotation: {
            label: 'Rotation',
            value: [camera.rotation.x, camera.rotation.y, camera.rotation.z],
            onChange: (value: [number, number, number]) => {
                camera.rotation.set(value[0], value[1], value[2]);
            }
        },
        fov: {
            label: 'FOV',
            value: (camera as PerspectiveCamera).fov,
            onChange: (value: number) => {
                (camera as PerspectiveCamera).fov = value;
            }
        }
    }));
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
            <mesh ref={ref}>
                <boxBufferGeometry />
            </mesh>
        )
    }

    return (
        <Physics>
            <TransformControlsLock></TransformControlsLock>
        </Physics>

    )
}
export default SceneLoader;
