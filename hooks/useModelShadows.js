import { useLayoutEffect } from "react";

export default function useModelShadows(groupRef) {
    useLayoutEffect(() => {
        // Shadow flags belong on every mesh, including animated skinned meshes.
        groupRef.current?.traverse((object) => {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
    }, [groupRef]);
}
