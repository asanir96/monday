import { useEffect } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'
import { useSelector } from 'react-redux'

import { loadBoard } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { BoardHeader } from '../cmps/BoardHeader'
import { GroupList } from '../cmps/GroupList'

export function BoardDetails() {
    const { boardId } = useParams()
    const navigate = useNavigate()
    const board = useSelector(storeState => storeState.boardModule.board)

    useEffect(() => {
        // Set when the user leaves this board before its load finished - a late failure is then ignored
        let isLeft = false

        onLoadBoard()

        async function onLoadBoard() {
            try {
                await loadBoard(boardId)
            } catch (err) {
                if (isLeft) return
                // The board doesn't exist (deleted, or an old link) - go back to the boards page
                showErrorMsg('Board not found')
                navigate('/board', { replace: true })
            }
        }

        return () => { isLeft = true }
    }, [boardId])

    // The store may still hold the previously open board - never show it under this board's url
    if (!board || board._id !== boardId) return <div>Loading...</div>

    return (
        <section className="board-details board-details-layout">
            <BoardHeader board={board} />

            <GroupList board={board} />

            {/* The open task's side panel (/board/:boardId/task/:taskId) - empty on the board's own url */}
            <Outlet />
        </section>
    )
}
