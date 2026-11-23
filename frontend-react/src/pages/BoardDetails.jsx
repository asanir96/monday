import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'

import { loadBoard } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { BoardHeader } from '../cmps/BoardHeader'
import { GroupList } from '../cmps/GroupList'

export function BoardDetails() {
    const { boardId } = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)

    useEffect(() => {
        onLoadBoard()
    }, [boardId])

    async function onLoadBoard() {
        try {
            await loadBoard(boardId)
        } catch (err) {
            showErrorMsg(`Cannot load board ${boardId}`)
        }
    }

    if (!board) return <div>Loading...</div>

    return (
        <section className="board-details board-details-layout">
            <BoardHeader board={board} />

            <GroupList board={board} />
        </section>
    )
}
