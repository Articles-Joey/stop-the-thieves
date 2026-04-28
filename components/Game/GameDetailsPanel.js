import { useGameStore } from "@/hooks/useGameStore"
import { useSocketStore } from "@/hooks/useSocketStore"
// import { useIceSlideStore } from "@/hooks/useIceSlideStore"

export default function GameDetailsPanel() {

    const players = useGameStore(state => state.gameState.players)
    const enemies = useGameStore(state => state.gameState.enemies)
    const barrels = useGameStore(state => state.gameState.barrels)

    const socket = useSocketStore(state => state.socket)

    return (
        <div className="card game-details-panel">

            <div className="card-body">

                {socket?.id}

                <div className="h6 mb-2 d-flex justify-content-between">
                    <RoundAndTimer />
                </div>

                <div>Players</div>

                {players?.length > 0 && players?.map((player, index) => (
                    <div key={player.id} className="player-entry border p-2">

                        {/* <div className="player-color" style={{ backgroundColor: player.color }}></div> */}

                        <div className="" style={{ fontSize: "0.6rem" }}>ID: {player.id}</div>

                        <div className="player-name d-flex align-items-center">
                            <span
                                className={`badge ${player.ready ? 'bg-success' : 'bg-danger'} me-1`}
                                style={{
                                    fontSize: "0.6rem"
                                }}
                            >
                                {player.ready ? "Ready" : "Not Ready"}
                            </span>
                            {player.nickname || "?"}
                        </div>

                        <div className="d-flex justify-content-between">

                            <div>X: {player?.position?.[0]?.toFixed(2) || 0} | </div>
                            <div>Y: {player?.position?.[1]?.toFixed(2) || 0} | </div>
                            <div>Z: {player?.position?.[2]?.toFixed(2) || 0}</div>

                            <div className="d-flex">
                                <div className="me-2">
                                    <i className="fad fa-rocket"></i>
                                    {player.hitPower}
                                </div>
                                <div>
                                    <i className="fad fa-undo"></i>
                                    {player.hitRotation}
                                </div>
                            </div>

                        </div>

                    </div>
                ))}

                <div>Enemies</div>

                {enemies?.length > 0 && enemies?.map((enemy, index) => (
                    <div key={enemy.id} className="enemy-entry border p-2">

                        {/* <div className="player-color" style={{ backgroundColor: player.color }}></div> */}

                        <div className="" style={{ fontSize: "0.6rem" }}>ID: {enemy.id}</div>

                        <div className="player-name d-flex align-items-center">
                            <span
                                className={`badge ${enemy.ready ? 'bg-success' : 'bg-danger'} me-1`}
                                style={{
                                    fontSize: "0.6rem"
                                }}
                            >
                                {enemy.ready ? "Ready" : "Not Ready"}
                            </span>
                            {enemy.nickname || "?"}
                        </div>

                        <div className="d-flex justify-content-between">

                            <div>X: {enemy?.x?.toFixed(2) || 0} | </div>
                            {/* <div>Y: {enemy?.y?.toFixed(2) || 0} | </div> */}
                            <div>Z: {enemy?.z?.toFixed(2) || 0}</div>

                        </div>

                    </div>
                ))}

                <div>Barrels</div>

                {barrels?.length > 0 && barrels?.map((barrel, index) => (
                    <div key={barrel.id} className="barrel-entry border p-2">

                        {/* <div className="player-color" style={{ backgroundColor: player.color }}></div> */}

                        <div className="" style={{ fontSize: "0.6rem" }}>ID: {barrel.id}</div>

                        <div className="player-name d-flex align-items-center">
                            {barrel.pickedUp ? "Picked Up" : "On Ground"}
                        </div>

                        <div className="d-flex justify-content-between">

                            <div>X: {barrel?.x?.toFixed(2) || 0} | </div>
                            {/* <div>Y: {barrel?.y?.toFixed(2) || 0} | </div> */}
                            <div>Z: {barrel?.z?.toFixed(2) || 0}</div>

                        </div>

                    </div>
                ))}

            </div>

        </div>
    )
}

function RoundAndTimer() {

    const gameState = useGameStore(state => state.gameState)

    return (
        <div className="d-flex align-items-center w-100 justify-content-between">
            <div>Round: {gameState?.round || 0}</div>
            <div>Time: {gameState?.timer || 0}</div>
        </div>
    )
}