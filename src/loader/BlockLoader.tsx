import {useBox, usePlane} from "@react-three/cannon";
import React, {useEffect, useRef, useState} from "react";
import {Color, DoubleSide, Mesh} from "three";
import MyDecal from "../three-extension/MyDecal";
import DecalConfig from "../models/DecalConfig";
import {BlockConfig} from "../models/BlockConfig";
import * as THREE from "three";

// @ts-ignore
function BlockLoader(config: BlockConfig) {
    const [args, setArgs] = useState<Array<any>>(config.geometry.args);

    const [position, setPosition] = useState(config.transform.position);
    const [rotation, setRotation] = useState(config.transform.rotation);
    const [scale, setScale] = useState(config.transform.scale);

    const [color, setColor] = useState(config.material.color);
    const [wireframe, setWireframe] = useState(config.material.wireframe);
    const[reflectivity, setReflectivity] = useState(config.material.reflectivity);

    const mesh = useRef<Mesh>(null!)
    const renderDecal = (decalData: DecalConfig, index: number) => {
        if(mesh.current){
            return <MyDecal key={index} mesh={mesh.current} decalData={decalData}/>
        }
    }

    // @ts-ignore
    const length = args[0];
    // @ts-ignore
    const width = args[1];
    const shape = new THREE.Shape();
    shape.moveTo( 0,0 );
    // @ts-ignore
    shape.lineTo( 0, width );
    // @ts-ignore
    shape.lineTo( length, width );
    // @ts-ignore
    shape.lineTo( length, 0 );
    shape.lineTo( 0, 0 );

    // @ts-ignore
    const extrudeSettings = {
        steps: 2,
        depth: args[2],
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 1
    };

    const points = [new THREE.Vector2( 0, 0) ];
    for ( let i = 0; i < 10; i ++ ) {
        points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
    }

    const renderGeometry = () => {
        switch (config.type) {
            case "Box":
                // @ts-ignore
                return <boxBufferGeometry args={args}/>
            case "Circle":
                // @ts-ignore
                return <circleBufferGeometry args={args} />
            case "Cone":
                // @ts-ignore
                return <coneBufferGeometry args={args} />
            case "Cylinder":
                // @ts-ignore
                return <cylinderBufferGeometry args={args}/>
            case "Dodecahedron":
                // @ts-ignore
                return <dodecahedronBufferGeometry args={args} />
            case "Edges":
                // @ts-ignore
                return <edgesGeometry args={args}/>
            case "Extruded":
                return <extrudeBufferGeometry args={[shape, extrudeSettings]}></extrudeBufferGeometry>
            case "Ground":
                // @ts-ignore
                return <planeBufferGeometry args={args}/>;
            case "Icosahedron":
                // @ts-ignore
                return <icosahedronBufferGeometry args={args}/>
            case "Lathe":
                return <latheBufferGeometry args={[points]}></latheBufferGeometry>
            case "Octahedron":
                // @ts-ignore
                return <octahedronBufferGeometry args={args} />
            case "Parametric":
                // @ts-ignore
                return <parametricBufferGeometry args={args}/>
            case "Plane":
                // @ts-ignore
                return <planeBufferGeometry args={args}/>;
            case "Polyhedron":
                // @ts-ignore
                return <polyhedronBufferGeometry args={args}/>
            case "Ring":
                // @ts-ignore
                return <ringBufferGeometry args={args} />
            case "Shape":
                // @ts-ignore
                return <shapeBufferGeometry args={args} />
            case "Sphere":
                // @ts-ignore
                return <sphereBufferGeometry args={args} />
            case "Tetrahedron":
                // @ts-ignore
                return <tetrahedronBufferGeometry args={args}/>
            case "Text":
                // @ts-ignore
                return <textBufferGeometry args={args} />
            case "Torus":
                // @ts-ignore
                return <torusBufferGeometry args={args}/>
            case "TorusKnot":
                // @ts-ignore
                return <torusKnotBufferGeometry args={args}/>
            case "Tube":
                // @ts-ignore
                return <tubeBufferGeometry args={args} />
            case "Wireframe":
                // @ts-ignore
                return <wireframeGeometry args={args}/>
        }
    }
    return (
        <>
            <mesh ref={mesh} name={config.name} position={position} rotation={rotation} scale={scale} userData={{
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
                    },
                    geometry: {
                        args: {
                            value: args,
                            onChange: (value: any) => {
                                setArgs(value);
                            }
                        }
                    },
                    material: {
                        color: {
                            label: 'color',
                            value: color,
                            onChange: (value: string) => {
                                setColor(value);
                            }
                        },
                        wireframe: {
                            label: 'Wireframe',
                            value: wireframe,
                            onChange: (value: boolean) => {
                                setWireframe(value);
                            }
                        },
                        reflectivity: {
                            label: 'Reflectivity',
                            value: reflectivity,
                            onChange: (value: number) => {
                                setReflectivity(value);
                            }
                        }
                    }
                }
            }}>

                {renderGeometry()}
                <meshPhysicalMaterial color={color} wireframe={wireframe} reflectivity={reflectivity} side={DoubleSide}></meshPhysicalMaterial>
            </mesh>
            {config.decals.map(renderDecal)}
        </>

    )
}
export default  BlockLoader;
