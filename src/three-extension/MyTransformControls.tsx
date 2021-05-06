import * as React from 'react'
import { Object3D, Group, Camera } from 'three'
import { useThree, ReactThreeFiber } from '@react-three/fiber'
import { TransformControls as TransformControlsImpl } from 'three-stdlib'
import pick from 'lodash.pick'
import omit from 'lodash.omit'
import {MutableRefObject} from "react";

export type MyTransformControls = ReactThreeFiber.Object3DNode<TransformControlsImpl, typeof TransformControlsImpl>

declare global {
    namespace JSX {
        interface IntrinsicElements {
            transformControlsImpl: MyTransformControls
        }
    }
}

type Props = MyTransformControls &
    JSX.IntrinsicElements['group'] & {
    enabled: boolean
    axis: string | null
    mode: string
    translationSnap: number | null
    rotationSnap: number | null
    scaleSnap?: number | null
    space: string
    size: number
    dragging: boolean
    showX: boolean
    showY: boolean
    showZ: boolean
    object: Object3D,
    camera: Camera
}

export const MyTransformControls = React.forwardRef<TransformControlsImpl, Props>(({ object, ...props }, ref) => {
    const transformOnlyPropNames = [
        'enabled',
        'axis',
        'mode',
        'translationSnap',
        'rotationSnap',
        'scaleSnap',
        'space',
        'size',
        'dragging',
        'showX',
        'showY',
        'showZ',
    ]

    const { camera, ...rest } = props
    const transformProps = pick(rest, transformOnlyPropNames)
    const objectProps = omit(rest, transformOnlyPropNames)

    const gl = useThree(({ gl }) => gl)
    const defaultCamera = useThree(({ camera }) => camera)
    const invalidate = useThree(({ invalidate }) => invalidate)

    const explCamera = camera || defaultCamera

    const [controls] = React.useState(() => new TransformControlsImpl(explCamera, gl.domElement))

    const group = React.useRef<Group>()
    React.useLayoutEffect(() => void controls?.attach(object as Object3D), [object, controls])

    React.useEffect(() => {
        controls?.addEventListener?.('change', invalidate)
        return () => controls?.removeEventListener?.('change', invalidate)
    }, [controls, invalidate])

    return controls ? (
        <>
            <primitive ref={ref} dispose={undefined} object={controls} {...transformProps} />
        </>
    ) : null
})
