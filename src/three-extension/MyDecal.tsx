import DecalData from "./../store/DecalData";
import {
    BoxGeometry,
    BufferGeometry,
    Euler, FrontSide,
    ImageUtils,
    Mesh,
    MeshBasicMaterial,
    MeshPhysicalMaterial, TextureLoader,
    Vector2,
    Vector3
} from "three";
import {useEffect, useRef, useState} from "react";
import {DecalGeometry} from "three/examples/jsm/geometries/DecalGeometry";
import {useLoader, useThree} from "@react-three/fiber";
import {MeshPhysicalMaterialParameters} from "three/src/materials/MeshPhysicalMaterial";

export interface MyDecalProps {
    mesh: Mesh;
    decalData: DecalData;
}
const MyDecal = (props: MyDecalProps) => {
    // console.log(props.mesh.geometry.isBufferGeometry);
    // const [args, setArgs] = useState<[]>(decalDate.geometry.args);
    const [position, setPosition] = useState<[number, number, number]>(props.decalData.transform.position);
    const [rotation, setRotation] = useState<[number, number, number]>(props.decalData.transform.rotation);
    const [scale, setScale] = useState<[number, number, number]>(props.decalData.transform.scale);

    const { scene } = useThree();
    const geometry =  new DecalGeometry(props.mesh, new Vector3(position[0], position[1], position[2]), new Euler(rotation[0], rotation[1], rotation[2]), new Vector3(scale[0], scale[1], scale[2]));

    const texture_1 = useLoader(TextureLoader, 'assets/Label2.png');
    const material = new MeshPhysicalMaterial({
        // specular: 0xffffff,
        // shininess: 10,
        map: texture_1,
        // normalMap: ImageUtils.loadTexture( 'assets/wrinkle-normal.jpg' ),
        normalScale: new Vector2( .15, .15 ),
        transparent: true,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        wireframe: props.decalData.material.wireframe,
        side: FrontSide,
        reflectivity: props.decalData.material.reflectivity,
        roughness: props.decalData.material.roughness
    });
    // const test = useUpdate(() => {
    //
    // })
    const ref = useRef<Mesh>(null!);
    // const [currentGeometry, setCurrentGeometry] = useState<any>();
    // useEffect(() => {
    //     if(props.mesh && geometry !== props.mesh.geometry){
    //         console.log(scale);
    //         // const geo = new DecalGeometry(props.mesh, new Vector3(position[0], position[1], position[2]), new Euler(rotation[0], rotation[1], rotation[2]), new Vector3(scale[0], scale[1], scale[2]));
    //         if(ref.current.geometry){
    //             ref.current.geometry.dispose();
    //             // ref.current.geometry = geo;
    //             (ref.current as any).needsUpdate = true;
    //         }
    //     }
    // })
    // const geometry = new BoxGeometry(1,1, 1);
    return(
        <mesh ref={ref} name="Decal" material={material} userData={{
            controls: {
                // castShadow: {
                //     label: 'Cast Shadow',
                //     value: castShadow,
                //     onChange: (value: boolean) => {
                //         setCastShadow(value);
                //     }
                // },
                transform: {
                    position: {
                        label: 'Position',
                        value: position,
                        onChange: (value: [number, number, number]) => {
                            console.log(position)
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
                        min: 0.1,
                        step: 0.1,
                        onChange: (value: [number, number, number]) => {
                            setScale(value);
                        },
                        lock: true
                    }
                },
                // geometry: {
                //     args: {
                //         label: 'Dimension',
                //         value: args,
                //         min: 0.1,
                //         step: 0.2,
                //         onChange: (value: any) => {
                //             setArgs(value);
                //         }
                //     }
                // },
                // material: {
                //     color: {
                //         label: 'color',
                //         value: color,
                //         onChange: (value: string) => {
                //             setColor(value);
                //         }
                //     },
                //     wireframe: {
                //         label: 'Wireframe',
                //         value: wireframe,
                //         onChange: (value: boolean) => {
                //             setWireframe(value);
                //         }
                //     },
                //     reflectivity: {
                //         label: 'Reflectivity',
                //         value: reflectivity,
                //         onChange: (value: number) => {
                //             setReflectivity(value);
                //         }
                //     }
                // },
                // physics: {
                //     mass: {
                //         label: 'Mass',
                //         value: mass,
                //         onChange: (value: number) => {
                //             setMass(value);
                //         }
                //     }
                // }
            }
        }} onUpdate={(self: any) => self.needsUpdate = true}>
            {geometry && <primitive attach={"geometry"} object={geometry}/> }
        </mesh>
        // <mesh name="Decal">
        //     <primitive attach={"geometry"} object={geometry}/>
        //     <meshPhysicalMaterial color={0x00ff00}></meshPhysicalMaterial>
        // </mesh>
    )
}
export default MyDecal;
