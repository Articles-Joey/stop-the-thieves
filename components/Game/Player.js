import { useFrame, useThree } from "@react-three/fiber"
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier"
import { useEffect, useRef, useState, memo, forwardRef, useImperativeHandle } from "react"
import { Vector3 } from "three"
import { useKeyboard } from "@/hooks/useKeyboard"
import { useGameStore } from "@/hooks/useGameStore"
import { useControlsStore } from "@/hooks/useControlsStore"
import { useSocketStore } from "@/hooks/useSocketStore"
import { useStore } from "@/hooks/useStore"
import { Model as SpacesuitModel } from "@/components/Models/Spacesuit"
import { AIM_DISTANCE, PLAYER_COLLISION_GROUPS, PROJECTILE_COLLISION_GROUPS, PROJECTILE_SPEED, SHOT_COOLDOWN_MS, SHOOTING_STATUSES } from "./physics"

const JUMP_FORCE = 6;
const SPEED = 4;
const CONTROLLER_DEADZONE = 0.15;
const LOOK_SENSITIVITY = 0.04;
const THIRD_PERSON_MIN_DISTANCE = 2;
const THIRD_PERSON_MAX_DISTANCE = 20;
const THIRD_PERSON_DEFAULT_DISTANCE = 6;
const THIRD_PERSON_HEIGHT = 0.5;
const THIRD_PERSON_SHOULDER_OFFSET = 0.65;
const THIRD_PERSON_CAMERA_LIFT = 0.8;
const CAMERA_GROUND_OFFSET = 0.3;
const SCROLL_SENSITIVITY = 0.5;
const PLAYER_USER_DATA = { isPlayer: true };

function PlayerBase() {

    const setTopCheckpoint = useGameStore((state) => state.setTopCheckpoint);
    const setPlayer = useGameStore((state) => state.setPlayer);
    const setPosition = useGameStore((state) => state.setPosition);
    const setIsThirdPerson = useGameStore((state) => state.setIsThirdPerson);
    const addProjectile = useGameStore((state) => state.addProjectile);
    const setAction = useGameStore((state) => state.setAction);
    // const setCameraDistance = useGameStore((state) => state.setCameraDistance);

    const { moveBackward, moveForward, moveRight, moveLeft, jump, shift, crouch, cameraView } = useKeyboard()

    const { camera, gl } = useThree()
    const { world, rapier } = useRapier()
    const ref = useRef(null)
    const pos = useRef([0, 1, 0])
    const vel = useRef([0, 0, 0])

    const [action, setLocalAction] = useState("Idle")
    const [isJumping, setIsJumping] = useState(false)
    const [isThirdPerson, setIsThirdPersonLocal] = useState(false)

    const prevCameraView = useRef(false)
    const cameraDistanceRef = useRef(THIRD_PERSON_DEFAULT_DISTANCE)
    const modelRef = useRef()
    const groundedFrames = useRef(0)
    const lastJumpTime = useRef(0)
    const lastForwardPressTime = useRef(0)
    const isDoubleTapSprinting = useRef(false)
    const wasMovingForward = useRef(false)
    const knockbackEndTime = useRef(0)
    const explosionRef = useRef(null)
    const fireRef = useRef({ mouse: false, keyboard: false, pending: false })

    // Sprint state
    const SPRINT_MAX = 1.5       // seconds of sprint energy
    const SPRINT_COOLDOWN = 5  // seconds before refill starts
    const SPRINT_REFILL = 1  // energy per second (fills in 2s)
    const sprintEnergyRef = useRef(SPRINT_MAX)
    const lastSprintActiveRef = useRef(0)  // timestamp of last active sprint frame

    const handleCollision = ({ other }) => {
        const data = other.rigidBodyObject?.userData;
        if (data?.topCheckpoint) setTopCheckpoint?.(true);
        if (!data?.obstacle) return;

        const isSpikyBall = data.spikyBall;
        const hForce = isSpikyBall ? 28 : 18;
        knockbackEndTime.current = Date.now() + (isSpikyBall ? 800 : 500);
        ref.current?.setLinvel({
            x: (Math.random() - 0.5) * hForce,
            y: isSpikyBall ? 20 : 14,
            z: (Math.random() - 0.5) * hForce,
        }, true);
        if (isSpikyBall) explosionRef.current?.trigger([...pos.current]);
    };

    useEffect(() => {
        // Convert to yaw/pitch order while preserving the current orientation.
        // Assigning .order directly reinterprets the angles and can add roll.
        camera.rotation.reorder('YXZ');
        setPlayer(ref, ref.current);
        return () => setPlayer(null, null);
    }, [camera, setPlayer]);

    // Toggle third-person on key press (not release)
    useEffect(() => {
        if (cameraView && !prevCameraView.current) {
            setIsThirdPersonLocal(prev => !prev);
        }
        prevCameraView.current = cameraView
    }, [cameraView])

    // Sync local isThirdPerson state to the game store
    useEffect(() => {
        setIsThirdPerson(isThirdPerson);
    }, [isThirdPerson, setIsThirdPerson])

    // Holding left click or Enter fires at most once per second.
    useEffect(() => {
        const handleMouseDown = (e) => {
            if (e.button === 0 && (e.target === gl.domElement || document.pointerLockElement === gl.domElement)) {
                fireRef.current.mouse = true;
                fireRef.current.pending = true;
            }
        };
        const handleMouseUp = (e) => {
            if (e.button === 0) fireRef.current.mouse = false;
        };
        const handleKeyDown = (e) => {
            if (e.code === 'Enter' && !e.target.closest?.('input, textarea, select, button, [contenteditable="true"]')) {
                fireRef.current.keyboard = true;
                if (!e.repeat) fireRef.current.pending = true;
            }
        };
        const handleKeyUp = (e) => {
            if (e.code === 'Enter') fireRef.current.keyboard = false;
        };
        const resetFire = () => {
            fireRef.current = { mouse: false, keyboard: false, pending: false };
        };
        const handlePointerLock = () => {
            if (document.pointerLockElement !== gl.domElement) resetFire();
        };
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        document.addEventListener('pointerlockchange', handlePointerLock);
        window.addEventListener('blur', resetFire);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('pointerlockchange', handlePointerLock);
            window.removeEventListener('blur', resetFire);
        };
    }, [gl]);

    // Scroll wheel to adjust third-person camera distance
    useEffect(() => {
        const handleWheel = (e) => {
            const setCameraDistance = useGameStore.getState().setCameraDistance;
            cameraDistanceRef.current = Math.min(
                THIRD_PERSON_MAX_DISTANCE,
                Math.max(THIRD_PERSON_MIN_DISTANCE, cameraDistanceRef.current + e.deltaY * SCROLL_SENSITIVITY * 0.01)
            );
            setCameraDistance(cameraDistanceRef.current);
        }
        document.addEventListener('wheel', handleWheel, { passive: true })
        return () => document.removeEventListener('wheel', handleWheel)
    }, [])

    // Animation state from keyboard
    useEffect(() => {
        if (isJumping) return;
        if (moveLeft || moveRight || moveBackward || moveForward) {
            const next = shift || isDoubleTapSprinting.current ? "Run" : "Walk";
            setLocalAction(next);
            setAction(next);
        } else {
            setLocalAction("Idle");
            setAction("Idle");
        }
    }, [moveBackward, moveForward, moveRight, moveLeft, isJumping, shift])

    useFrame((_, delta) => {
        const body = ref.current;
        if (!body) return;
        let translation = body.translation();
        if (translation.y < -25) {
            body.setTranslation({ x: 0, y: 5, z: 0 }, true);
            body.setLinvel({ x: 0, y: 0, z: 0 }, true);
            translation = body.translation();
        }
        const velocity = body.linvel();
        pos.current = [translation.x, translation.y, translation.z];
        vel.current = [velocity.x, velocity.y, velocity.z];
        setPosition(pos.current);

        // Keep model in sync with physics body even during knockback
        if (modelRef.current) {
            modelRef.current.position.set(pos.current[0], pos.current[1], pos.current[2]);
        }

        // --- Gamepad input ---
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const gamepad = gamepads[0];

        const tc = useControlsStore.getState().touchControls;

        let forwardInput = ((moveBackward || tc.backward) ? 1 : 0) - ((moveForward || tc.forward) ? 1 : 0);
        let sideInput = ((moveLeft || tc.left) ? 1 : 0) - ((moveRight || tc.right) ? 1 : 0);
        let rotationX = 0;
        let rotationY = 0;

        const isForward = moveForward || tc.forward;
        if (isForward && !wasMovingForward.current) {
            if (Date.now() - lastForwardPressTime.current < 300) isDoubleTapSprinting.current = true;
            lastForwardPressTime.current = Date.now();
        }
        if (!isForward) isDoubleTapSprinting.current = false;
        wasMovingForward.current = isForward;

        if (gamepad) {
            const axisX = gamepad.axes[0];
            const axisY = gamepad.axes[1];
            if (Math.abs(axisX) > CONTROLLER_DEADZONE) sideInput -= axisX;
            if (Math.abs(axisY) > CONTROLLER_DEADZONE) forwardInput += axisY;
            const lookX = gamepad.axes[2];
            const lookY = gamepad.axes[3];
            if (Math.abs(lookX) > CONTROLLER_DEADZONE) rotationY = -lookX * LOOK_SENSITIVITY;
            if (Math.abs(lookY) > CONTROLLER_DEADZONE) rotationX = -lookY * LOOK_SENSITIVITY;
        }

        // Touch look contribution (continuous per-frame, rate = 2 rad/sec at full deflection)
        const TOUCH_LOOK_SENSITIVITY = 2.0;
        if (tc.lookX) rotationY += -tc.lookX * TOUCH_LOOK_SENSITIVITY * delta;
        if (tc.lookY) rotationX += tc.lookY * TOUCH_LOOK_SENSITIVITY * delta;

        if (rotationX !== 0 || rotationY !== 0) {
            camera.rotation.y += rotationY;
            camera.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, camera.rotation.x + rotationX));
            camera.rotation.z = 0; // prevent roll drift
        }

        // Preserve the look direction independently of the elevated shoulder
        // position. The player stays below/left of the center aiming reticle.
        const forward = camera.getWorldDirection(new Vector3());
        if (isThirdPerson) {
            const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
            camera.position.set(translation.x, translation.y + THIRD_PERSON_HEIGHT + THIRD_PERSON_CAMERA_LIFT, translation.z);
            camera.position.addScaledVector(forward, -cameraDistanceRef.current);
            camera.position.addScaledVector(right, THIRD_PERSON_SHOULDER_OFFSET);
            camera.position.y = Math.max(CAMERA_GROUND_OFFSET, camera.position.y);
        } else {
            camera.position.set(translation.x, translation.y + (crouch ? -0.2 : 0.3), translation.z);
        }

        const now = performance.now();
        const game = useGameStore.getState();
        const menuOpen = useStore.getState().showMenu;
        const wantsFire = fireRef.current.pending || fireRef.current.mouse || fireRef.current.keyboard || gamepad?.buttons[7]?.pressed;
        fireRef.current.pending = false;
        if (menuOpen) fireRef.current = { mouse: false, keyboard: false, pending: false };

        if (!menuOpen && SHOOTING_STATUSES.includes(game.gameState.status) && wantsFire
            && (game.lastShotAt === null || now - game.lastShotAt >= SHOT_COOLDOWN_MS)) {
            // Trace through the center of the screen, then converge the shot
            // from the player's muzzle onto that point instead of the player.
            const origin = isThirdPerson
                ? new Vector3(translation.x, translation.y + THIRD_PERSON_HEIGHT, translation.z)
                : camera.position.clone();
            // Begin the camera ray just ahead of the muzzle's depth plane so
            // objects between the camera and player cannot aim a shot backward.
            const muzzleDepth = Math.max(0, origin.clone().sub(camera.position).dot(forward)) + 0.13;
            const rayOrigin = camera.position.clone().addScaledVector(forward, muzzleDepth);
            const ray = new rapier.Ray(rayOrigin, forward);
            const hit = world.castRay(ray, AIM_DISTANCE, true, undefined, PROJECTILE_COLLISION_GROUPS, undefined, body);
            const aimPoint = rayOrigin.addScaledVector(forward, hit?.timeOfImpact ?? AIM_DISTANCE);
            const direction = aimPoint.sub(origin).normalize();
            // Start at the muzzle: a long spawn offset can skip close enemies.
            const spawnPos = origin.toArray();
            const projId = `${Date.now()}-${Math.random()}`;
            game.setLastShotAt(now);
            addProjectile({
                id: projId,
                position: spawnPos,
                velocity: direction.clone().multiplyScalar(PROJECTILE_SPEED).toArray(),
            });
            if (game.gameMode === 'multiplayer' && game.gameState.status === 'In Progress') useSocketStore.getState().socket?.emit('projectile_fired', {
                id: projId,
                server: game.serverId,
                position: spawnPos,
                direction: direction.toArray(),
                cameraRotation: { x: camera.rotation.x, y: camera.rotation.y },
            });
        }

        // Camera and aiming keep working while movement is knocked back.
        if (Date.now() < knockbackEndTime.current) return;

        const isSprintingInput = shift || isDoubleTapSprinting.current;
        const frontVector = new Vector3(0, 0, forwardInput);
        const sideVector = new Vector3(sideInput, 0, 0);
        const isMoving = frontVector.length() > 0 || sideVector.length() > 0;

        // --- Sprint meter logic ---
        // Use isJumping + knockback as the "airborne" signal — grounded = neither jumping nor knocked back.
        // This correctly handles ramps where Y velocity is non-zero but the player is still on a surface.
        const isGrounded = !isJumping && Date.now() >= knockbackEndTime.current;
        const knockedBack = Date.now() < knockbackEndTime.current;
        const wantSprint = isSprintingInput && isMoving && isGrounded && !knockedBack;
        const isSprinting = wantSprint && sprintEnergyRef.current > 0;

        // if (isSprinting) {
        //     sprintEnergyRef.current = Math.max(0, sprintEnergyRef.current - delta);
        //     lastSprintActiveRef.current = Date.now();
        // } else {
        //     const idleMs = lastSprintActiveRef.current > 0
        //         ? Date.now() - lastSprintActiveRef.current
        //         : Infinity;
        //     const onCooldown = idleMs < SPRINT_COOLDOWN * 1000;
        //     if (!onCooldown) {
        //         sprintEnergyRef.current = Math.min(SPRINT_MAX, sprintEnergyRef.current + delta * SPRINT_REFILL);
        //     }
        // }

        // const sprintNormalized = sprintEnergyRef.current / SPRINT_MAX;
        // const sprintOnCooldown = lastSprintActiveRef.current > 0
        //     && (Date.now() - lastSprintActiveRef.current) < SPRINT_COOLDOWN * 1000
        //     && !isSprinting;
        // setSprintMeter(sprintNormalized, sprintOnCooldown);

        const direction = new Vector3()
        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .applyEuler(camera.rotation)
        direction.y = 0
        direction.normalize().multiplyScalar(SPEED * (isSprinting ? 2 : 1))

        body.setLinvel({ x: direction.x, y: vel.current[1], z: direction.z }, true)

        // --- Ground detection ---
        const groundHit = world.castRay(
            new rapier.Ray(translation, { x: 0, y: -1, z: 0 }),
            0.78, true, rapier.QueryFilterFlags.EXCLUDE_SENSORS,
            PLAYER_COLLISION_GROUPS, undefined, body,
        );
        if (groundHit && Math.abs(vel.current[1]) < 0.1) {
            groundedFrames.current++;
        } else {
            groundedFrames.current = 0;
        }

        // Landing
        if (isJumping && groundedFrames.current > 4 && Date.now() - lastJumpTime.current > 500) {
            setIsJumping(false);
            setAction("Idle");
            setLocalAction("Idle");
        }

        // Jump
        const isJumpingInput = jump || tc.jump || (gamepad?.buttons[0]?.pressed);
        if (isJumpingInput && groundedFrames.current > 2 && !isJumping) {
            body.setLinvel({ x: direction.x, y: JUMP_FORCE, z: direction.z }, true);
            setIsJumping(true);
            setAction("Jump");
            setLocalAction("Jump");
            lastJumpTime.current = Date.now();
            groundedFrames.current = 0;
            // Consume touch jump so it doesn't re-fire on landing while still held
            if (tc.jump) useControlsStore.getState().setTouchControls({ jump: false });
        }

        // In third person the player faces the reticle while moving sideways
        // or backward. First-person movement retains its existing model heading.
        if (modelRef.current && (isMoving || isThirdPerson)) {
            const facing = isThirdPerson ? forward : direction;
            const angle = Math.atan2(facing.x, facing.z)
            modelRef.current.rotation.y = angle
            useGameStore.getState().setModelRotation([0, angle, 0])
        }

    })

    return (
        <>
            <RigidBody
                ref={ref}
                position={[0, 1, 0]}
                lockRotations
                canSleep={false}
                ccd
                userData={PLAYER_USER_DATA}
                onCollisionEnter={handleCollision}
                onIntersectionEnter={handleCollision}
            >
                <CapsuleCollider
                    args={[0.4, 0.3]}
                    mass={1}
                    friction={0}
                    restitution={0}
                    collisionGroups={PLAYER_COLLISION_GROUPS}
                />
            </RigidBody>
            <Explosion ref={explosionRef} />
            <group ref={modelRef} visible={isThirdPerson}>
                <SpacesuitModel
                    scale={0.75}
                    position={[0, -0.75, 0]}
                    action={isJumping ? "Jump" : action}
                />
            </group>
        </>
    )
}

export const Player = memo(PlayerBase);

// ---------------------------------------------------------------------------
// Explosion effect — imperative API via forwardRef so PlayerBase can trigger it
// ---------------------------------------------------------------------------

const PARTICLE_COUNT = 24;

const Explosion = forwardRef(function Explosion(_, ref) {
    // Each particle: { position, velocity, life, maxLife }
    const particles = useRef([]);
    const meshRefs = useRef([]);
    const active = useRef(false);

    useImperativeHandle(ref, () => ({
        trigger(origin) {
            active.current = true;
            particles.current = Array.from({ length: PARTICLE_COUNT }, () => {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                const speed = 4 + Math.random() * 8;
                return {
                    position: [...origin],
                    velocity: [
                        Math.sin(phi) * Math.cos(theta) * speed,
                        Math.sin(phi) * Math.sin(theta) * speed,
                        Math.cos(phi) * speed,
                    ],
                    life: 1,
                };
            });
        }
    }), []);

    useFrame((_, delta) => {
        if (!active.current) return;

        let allDead = true;
        particles.current.forEach((p, i) => {
            if (p.life <= 0) return;
            allDead = false;

            p.life -= delta * 1.8;
            p.position[0] += p.velocity[0] * delta;
            p.position[1] += p.velocity[1] * delta;
            p.position[2] += p.velocity[2] * delta;
            p.velocity[1] -= 9.8 * delta; // gravity

            const mesh = meshRefs.current[i];
            if (mesh) {
                mesh.position.set(...p.position);
                const t = Math.max(0, p.life);
                mesh.scale.setScalar(t * 0.3);
                mesh.material.opacity = t;
                mesh.material.emissiveIntensity = t * 4;
            }
        });

        if (allDead) active.current = false;
    });

    return (
        <group>
            {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
                <mesh
                    key={i}
                    ref={el => meshRefs.current[i] = el}
                    scale={0}
                >
                    <sphereGeometry args={[1, 6, 6]} />
                    <meshStandardMaterial
                        color="#ff4400"
                        emissive="#ff8800"
                        emissiveIntensity={4}
                        transparent
                        opacity={1}
                        depthWrite={false}
                    />
                </mesh>
            ))}
        </group>
    );
});
