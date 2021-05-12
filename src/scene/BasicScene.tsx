import Plane from "../shapes/Plane";
import {Physics} from "@react-three/cannon";
import React, {useEffect} from "react";
import {button, buttonGroup, folder, LevaInputs, useControls} from "leva";
import niceColors from 'nice-color-palettes'
import {useThree} from "@react-three/fiber";
import TransformControlsLock from "../three-extension/TransformControlsLock";
import {ACESFilmicToneMapping, Object3D} from "three";
import {DimensionsIcon, InputIcon} from "@radix-ui/react-icons";
//@ts-ignore
import { RayTracingRenderer } from 'ray-tracing-renderer'
import {useTransform} from "leva/plugin";


// @ts-ignore
const BasicScene = () => {
    const { raycaster, mouse, camera, scene, gl } = useThree();


    useTransform();
    console.log(gl.domElement);

    const canvasRef = React.useRef() as React.MutableRefObject<HTMLCanvasElement>;
    const hoverinc = new RayTracingRenderer({
        canvas: gl.domElement,
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
                    tick();
                    hoverinc.gammaOutput = true;
                    hoverinc.gammaFactor = 2.2;
                    hoverinc.setPixelRatio(1.0);
                    hoverinc.toneMapping = ACESFilmicToneMapping;
                    hoverinc.toneMappingExposure = 1.5;
                    hoverinc.renderWhenOffFocus = false;
                    hoverinc.bounces = 3;
                    hoverinc.render(scene, camera);
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

    return (

        <>
            <Physics>
                <TransformControlsLock></TransformControlsLock>
                {/*<Dodecahedron time={0}/>*/}
            </Physics>
            {/*<canvas ref={canvasRef}></canvas>*/}
        </>

    )
}
export default BasicScene;
