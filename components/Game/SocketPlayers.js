import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useGameStore } from "@/hooks/useGameStore"

import { Model as SpacesuitModel } from "@/components/Models/Spacesuit";

// Server sends state at 30 Hz — interpolate between ticks to smooth motion
const NETWORK_RATE = 1 / 30;

function InterpolatedPlayer({ player }) {
    const groupRef = useRef()

    const interpRef = useRef({
        prevPos: new THREE.Vector3(),
        targetPos: new THREE.Vector3(),
        prevQuat: new THREE.Quaternion(),
        targetQuat: new THREE.Quaternion(),
        elapsed: 0,
        initialized: false,
    })

    // On each server tick (player data changes), shift target → prev and set new target
    useEffect(() => {
        if (!player?.position) return
        const s = interpRef.current

        const newPos = new THREE.Vector3(
            player.position[0] || 0,
            player.position[1] || 0,
            player.position[2] || 0,
        )
        const newQuat = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(
                player.rotation?.[0] || 0,
                player.rotation?.[1] || 0,
                player.rotation?.[2] || 0,
            )
        )

        if (!s.initialized) {
            // Snap to first received position without interpolating
            s.prevPos.copy(newPos)
            s.targetPos.copy(newPos)
            s.prevQuat.copy(newQuat)
            s.targetQuat.copy(newQuat)
            s.initialized = true
            if (groupRef.current) {
                groupRef.current.position.copy(newPos)
                groupRef.current.quaternion.copy(newQuat)
            }
            return
        }

        // Use the current rendered position as the new start to avoid jumps
        if (groupRef.current) {
            s.prevPos.copy(groupRef.current.position)
            s.prevQuat.copy(groupRef.current.quaternion)
        }
        s.targetPos.copy(newPos)
        s.targetQuat.copy(newQuat)
        s.elapsed = 0
    }, [
        player?.position?.[0],
        player?.position?.[1],
        player?.position?.[2],
        player?.rotation?.[1],
    ])

    useFrame((_, delta) => {
        if (!groupRef.current) return
        const s = interpRef.current
        if (!s.initialized) return

        s.elapsed = Math.min(s.elapsed + delta, NETWORK_RATE)
        const alpha = s.elapsed / NETWORK_RATE

        groupRef.current.position.lerpVectors(s.prevPos, s.targetPos, alpha)
        groupRef.current.quaternion.slerpQuaternions(s.prevQuat, s.targetQuat, alpha)
    })

    return (
        <group ref={groupRef}>
            <SpacesuitModel
                scale={0.75}
                action={player?.action || "Idle"}
            />
        </group>
    )
}

export default function SocketPlayers() {
    const players = useGameStore(state => state.gameState.players)

    return (
        <group>
            {players?.length > 0 && players?.map((player, index) => (
                <InterpolatedPlayer key={player?.id || index} player={player} />
            ))}
        </group>
    )
}