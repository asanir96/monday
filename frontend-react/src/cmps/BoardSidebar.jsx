import { boardService } from '../services/board'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useBoardCrud } from '../customHooks/useBoardCrud'
import { loadBoards } from '../store/actions/board.actions'

import { BoardList } from '../cmps/BoardList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from '@mui/material'

export function BoardSidebar() {
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const view = useSelector(storeState => storeState.boardModule.sidebarView)
    const filteredBoards = boardService.filterBoardsByView(boards, view)
    const { onAddEmptyBoard } = useBoardCrud()

    useEffect(() => {
        loadBoards()
    }, [])

    async function addEmptyBoard() {
        await onAddEmptyBoard()
    }

    return <aside className='boards-sidebar'>
        <div className='sidebar-header'></div>
        <div className='board-list-header'>
            <span>{view === 'workspace' ? 'Content' : 'Favorites'}</span>
            {view === 'workspace' && <Tooltip title="Add item to workspace">
                <button className="add-board-btn" onClick={addEmptyBoard}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </Tooltip>}
        </div>
        <nav >
            <BoardList
                boards={filteredBoards} />
        </nav>
    </aside>



}