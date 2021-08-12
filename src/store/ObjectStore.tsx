import create, {
    State,
    SetState,
    GetState,
    StoreApi
    // StateCreator
} from "zustand";
import produce from "immer";
import {ObjectConfig} from "../models/ObjectConfig";

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

export const combineAndImmer = <
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

