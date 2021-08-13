import {State} from "zustand";
import {BlockConfig} from "./BlockConfig";

export interface SceneState extends State {
    objects: BlockConfig[]
}
