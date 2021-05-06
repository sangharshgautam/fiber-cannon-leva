import create, {
    State,
    SetState,
    GetState,
    StoreApi
    // StateCreator
} from "zustand";
import {v4 as uuidv4} from 'uuid';
import produce from "immer";

export interface ScenaData extends State {
    objects: ObjectData[]
}

export interface ObjectData extends State {
    uuid: string;
    position: [number, number, number],
    rotation: [number, number, number],
    scale: [number, number, number],
    material: ObjectMaterial
}
export interface ObjectGeometry {

}
export interface ObjectMaterial {
    color: string;
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
        set: SetState<PrimaryState>,
        get: GetState<PrimaryState>,
        api: StoreApi<PrimaryState>
    ) => SecondaryState
): StateCreator<PrimaryState & SecondaryState> => (set, get, api) =>
    Object.assign(
        {},
        initialState,
        create(
            set as SetState<PrimaryState>,
            get as GetState<PrimaryState>,
            api as StoreApi<PrimaryState>
        )
    );

const withImmer = <PrimaryState extends State, SecondaryState extends State>(
    initialState: PrimaryState,
    createState: (
        set: (fn: (draftState: PrimaryState) => void) => void,
        get: GetState<PrimaryState>,
        api: StoreApi<PrimaryState>
    ) => SecondaryState
): StateCreator<PrimaryState & SecondaryState> => (set, get, api) =>
    Object.assign(
        {},
        initialState,
        createState(
            (fn) => set((baseState) => produce(baseState, fn)),
            get as GetState<PrimaryState>,
            api as StoreApi<PrimaryState>
        )
    );

const combineAndImmer = <
    PrimaryState extends State,
    SecondaryState extends State
    >(
    initialState: PrimaryState,
    config: StateCreator<
        PrimaryState,
        (fn: (draft: PrimaryState) => void) => void,
        SecondaryState
        >
): StateCreator<PrimaryState & SecondaryState> => {
    return combine(initialState, immer(config));
};

const initialState = {
    objects: [{
        uuid: uuidv4(),
        position: [4.26, -4.01, 5.51],
        rotation: [0.2, 0, 0],
        scale: [1, 1, 7],
        material: {
            color: '#ce1a1a'
        }
    },
    {
        uuid: uuidv4(),
        position: [4.32, -0.68, 5.46],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        material: {
            color: '#4316ba'
        }
    }]
};
export const useObjectStore = create(
    combineAndImmer(initialState, (set) => ({
        updateObject: (object: ObjectData, index: number) =>
            set((state) => {
                state.objects[index] = object;
            }),
        addObject: (object: ObjectData) =>
            set((state) => {
                state.objects.push(object);
            })
    }))
);
