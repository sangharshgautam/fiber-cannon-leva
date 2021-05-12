import create, {
    State,
    SetState,
    GetState,
    StoreApi
    // StateCreator
} from "zustand";
import {v4 as uuidv4} from 'uuid';
import produce from "immer";
import DecalData from "./DecalData";

export interface ScenaData extends State {
    objects: ObjectData[]
}
export interface ObjectData extends State {
    uuid: string;
    type: 'Plane'| 'Cube' | 'NPoint';
    castShadow: boolean;
    transform: ObjectTransform;
    geometry: ObjectGeometry;
    material: ObjectMaterial;
    physics: ObjectPhysics;
    decals: DecalData[];
}
export interface ObjectTransform {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
}

export interface ObjectPhysics {
    enabled: boolean;
    mass: number
}

export interface ObjectGeometry {
    args: []
}
export interface ObjectMaterial {
    color: string;
    wireframe: boolean;
    reflectivity: number;
    roughness?: number;
}
type StateCreator<
    T extends State,
    CustomSetState = SetState<T>,
    U extends State = T
    > = (set: CustomSetState, get: GetState<T>, api: StoreApi<T>) => U;

// @ts-ignore
const immer = <T extends State, U extends State>(config: StateCreator<T, (fn: (draft: T) => void) => void, U>): StateCreator<T, SetState<T>, U> => (set, get, api) => config((fn) => set(produce(fn) as (state: T) => T), get, api);

const combine = <PrimaryState extends State, SecondaryState extends State>(
    initialState: PrimaryState,
    create: (
        set: SetState<PrimaryState & SecondaryState>,
        get: GetState<PrimaryState & SecondaryState>,
        api: StoreApi<PrimaryState & SecondaryState>
    ) => SecondaryState
): StateCreator<PrimaryState & SecondaryState> => (set, get, api) =>
    Object.assign(
        {},
        initialState,
        create(
            set as SetState<PrimaryState & SecondaryState>,
            get as GetState<PrimaryState & SecondaryState>,
            api as StoreApi<PrimaryState & SecondaryState>
        )
    );



const combineAndImmer = <
    PrimaryState extends State,
    SecondaryState extends State
    >(
    initialState: PrimaryState,
    config: StateCreator<
        PrimaryState & SecondaryState,
        (fn: (draft: PrimaryState) => void) => void,
        SecondaryState
        >
): StateCreator<PrimaryState & SecondaryState> => {
    return combine(initialState, immer(config));
};

const initialState = {
    objects: [{
        uuid: uuidv4(),
        type: 'Plane',
        castShadow: true,
        transform: {
            position: [0, -10, 0],
            rotation: [-Math.PI / 2, 0, 0],
            scale: [2, 2, 2],
        },
        geometry: {
            args: [ 10, 10]
        },
        material: {
            color: {r: 0.9, g: 0.9, b: 0.9},
            wireframe: false,
            reflectivity: 0.5,
            roughness: 1.0
        },
        physics: {
            enabled: true,
            mass: 0
        },
        decals: new Array<DecalData>()
    },
    {
        uuid: uuidv4(),
        type: 'Cube',
        castShadow: true,
        transform: {
            position: [0, 0, 0],
            rotation: [0, Math.PI * 0.1, 0],
            scale: [1, 1, 7],
        },
        geometry: {
            args: [ 1, 1, 1]
        },
        material: {
            color: [0.95, 0.95, 0.95],
            wireframe: false,
            reflectivity: 0.5,
            roughness: 1.0
        },
        physics: {
            enabled: false,
            mass: 1
        },
        decals: new Array<DecalData>()
    },
    {
        uuid: uuidv4(),
        type: 'Cube',
        castShadow: false,
        transform: {
            position: [4.32, -0.68, 5.46],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
        },
        geometry: {
            args: [ 2, 2, 2]
        },
        material: {
            color: '#4316ba',
            wireframe: false,
            reflectivity: 1.0,
            roughness: 1.0
        },
        physics: {
            enabled: true,
            mass: 2
        },
        decals: [{
            uuid: uuidv4(),
            transform: {
                position: [4.32, -0.68, 5.46],
                rotation: [0, 0, 0],
                scale: [5, 5, 5],
            },
            material: {
                color: '#4316ba',
                wireframe: false,
                reflectivity: 0.5,
                roughness: 1.0
            },
        }]
    },
    // {
    //     uuid: uuidv4(),
    //     type: 'NPoint',
    //     castShadow: false,
    //     transform: {
    //         position: [1, 1, 1],
    //         rotation: [0, 0, 0],
    //         scale: [0.2, 0.2, 0.2],
    //     },
    //     geometry: {
    //         args: [
    //             {x: 5, y: -10},
    //             {x: 6.986693307950612, y: -8},
    //             {x: 8.894183423086506, y: -6},
    //             {x: 10.646424733950354, y: -4},
    //             {x: 12.173560908995228, y: -2},
    //             {x: 13.414709848078965, y: 0},
    //             {x: 14.320390859672264, y: 2},
    //             {x: 14.854497299884603, y: 4},
    //             {x: 14.99573603041505, y: 6},
    //             {x: 14.738476308781951, y: 8}
    //         ]
    //     },
    //     material: {
    //         color: '#4316ba',
    //         wireframe: false,
    //         reflectivity: 1.0
    //     },
    //     physics: {
    //         mass: 2
    //     },
    //     decals: []
    // }
    ]
};
export const useObjectStore = create(
    combineAndImmer(initialState, (set) => ({
        updateObject: (object: ObjectData, index: number) =>
            set((state) => {
                // state.objects[index] = object;
            }),
        addObject: (object: ObjectData) =>
            set((state) => {
                // state.objects.push(object);
            })
    }))
);