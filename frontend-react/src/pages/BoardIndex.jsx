import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { loadBoards } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { useBoardCrud } from '../customHooks/useBoardCrud'
import { BoardTable } from '../cmps/BoardTable'
import { Icon } from '../cmps/Icon'

// "Manage your boards" page (/board): list, create, rename, delete and open boards
export function BoardIndex() {
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const isAddingBoard = useSelector(storeState => storeState.boardModule.isAddingBoard)
    const [isLoading, setIsLoading] = useState(true)
    const [filterTxt, setFilterTxt] = useState('')
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

    // Only the boards whose title has the search text (not case sensitive) - filtered here, the store keeps them all
    const boardsToShow = boards.filter(board => board.title.toLowerCase().includes(filterTxt.trim().toLowerCase()))

    return (
        <section className="board-index">
            <header className="board-index-header">
                <div>
                    <h1>Boards</h1>
                    <p>All the boards in your workspace</p>
                </div>
                <button className="btn-new-board" onClick={onAddEmptyBoard} disabled={isAddingBoard}>
                    {isAddingBoard ? 'Adding...' : '+ New board'}
                </button>
            </header>

            <label className="board-index-search">
                <Icon name="search" />
                <input
                    type="search"
                    placeholder="Search boards"
                    value={filterTxt}
                    onChange={ev => setFilterTxt(ev.target.value)}
                />
            </label>

            {isLoading && !boards.length
                ? <p className="board-index-msg">Loading boards...</p>
                : <BoardTable
                    boards={boardsToShow}
                    emptyMsg={filterTxt ? `No boards match "${filterTxt}"` : 'No boards yet - create your first one.'}
                    onRenameBoard={onRenameBoard}
                    onDeleteBoard={onDeleteBoard} />
            }

            {!!boards.length && (
                <p className="board-index-count">
                    {boardsToShow.length === boards.length ? `${boards.length} boards` : `${boardsToShow.length} of ${boards.length} boards`}
                </p>
            )}
        </section>
    )
}
