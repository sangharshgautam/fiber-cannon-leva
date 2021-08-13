import React, {Suspense, useEffect, useRef, useState} from "react"
import './App.css';
import sceneConfig from "./scenes/model.json";
import {SceneConfig} from "./models/SceneConfig";
import create from "zustand";
import {BlockConfig} from "./models/BlockConfig";
import {combineAndImmer} from "./store/ObjectStore";
import SceneEditor from "./editor/SceneEditor";

const config: SceneConfig = sceneConfig as any;
export const useObjectStore = create(
    combineAndImmer({objects: config.objects, models: config.models, groups: config.groups}, (set) => ({
        updateObject: (object: BlockConfig, index: number) =>
            set((state) => {
                // state.objects[index] = object;
            }),
        addObject: (object: BlockConfig) =>
            set((state) => {
                // state.objects.push(object);
            })
    }))
);

function App() {
    return (
        <SceneEditor {...config}></SceneEditor>
  );
}

export default App;
