import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { loadBoards } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { useBoardCrud } from '../customHooks/useBoardCrud'
import { BoardTable } from '../cmps/BoardTable'

// "Manage your boards" page (/board): list, create, rename, delete and open boards
export function BoardIndex() {
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const isAddingBoard = useSelector(storeState => storeState.boardModule.isAddingBoard)
    const [isLoading, setIsLoading] = useState(true)
    const { onAddEmptyBoard, onUpdateBoard, onRemoveBoard } = useBoardCrud()

    useEffect(() => {
        onLoadBoards()
    }, [])

    async function onLoadBoards() {
        try {
            await loadBoards()
        } catch (err) {
            showErrorMsg('Cannot load boards')
        } finally {
            setIsLoading(false)
        }
    }

    function onRenameBoard(board, title) {
        onUpdateBoard({ ...board, title })
    }

    function onDeleteBoard(board) {
        if (!confirm(`Delete board "${board.title}"?`)) return
        onRemoveBoard(board._id)
    }

    return (
        <section className="board-index">
            <header className="board-index-header">
                <h1>Boards</h1>
                <button className="btn-new-board" onClick={onAddEmptyBoard} disabled={isAddingBoard}>
                    {isAddingBoard ? 'Adding...' : '+ New board'}
                </button>
            </header>

            {isLoading && !boards.length
                ? <p className="board-index-msg">Loading boards...</p>
                : <BoardTable boards={boards} onRenameBoard={onRenameBoard} onDeleteBoard={onDeleteBoard} />
            }
        </section>
    )
}
