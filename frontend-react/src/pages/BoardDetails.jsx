import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'

import { loadBoard } from '../store/actions/board.actions'
import { BoardHeader } from '../cmps/BoardHeader'

export function BoardDetails() {
    const { boardId } = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)

    useEffect(() => {
        loadBoard(boardId)
    }, [boardId])

    if (!board) return <div>Loading...</div>

    return (
        <section className="board-details">
            <BoardHeader board={board} />

            {/* AH: group list goes here */}
            <section className="group-list-placeholder">Groups</section>
        </section>
    )
}
