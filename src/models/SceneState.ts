import {State} from "zustand";
import {ObjectConfig} from "./ObjectConfig";

export interface SceneState extends State {
    objects: ObjectConfig[]
}
