import { boardService } from '../services/board'
import { useEffect, useState } from 'react'
import { useNavigate, useMatch, NavLink } from 'react-router-dom';
import GridViewIcon from '@mui/icons-material/GridView';

import { useSelector } from 'react-redux'
import { useBoardCrud } from '../customHooks/useBoardCrud'
import { loadBoards } from '../store/actions/board.actions'

import { BoardList } from '../cmps/BoardList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from '@mui/material'
import Badge from '@mui/material/Badge';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

export function BoardSidebar({ isOpen, setIsSidebarOpen }) {
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const view = useSelector(storeState => storeState.boardModule.sidebarView)
    const filteredBoards = boardService.filterBoardsByView(boards, view)
    const { onAddEmptyBoard } = useBoardCrud()
    const isIndex = !!useMatch('/board')   // exact match: true only on /board, not /board/123

    useEffect(() => {
        loadBoards()
    }, [])

    async function addEmptyBoard() {
        await onAddEmptyBoard()
    }

    return <aside className={`boards-sidebar ${!isOpen ? 'collapsed' : 'expanded'}`}>
        <div className='workspace-header'>
            <button className='btn-icon' onClick={() => setIsSidebarOpen(false)}>
                <KeyboardDoubleArrowLeftIcon />
            </button>
            <div className='header-title'>Workspace</div>
            <div className='workspace-dropdown'>
                <div className='workspace-avatar position-relative'>
                    <div className='container'>
                        <span>M</span>
                    </div>
                    <HomeFilledIcon className='icon'
                        sx={{
                            color: 'black',
                            stroke: 'white',
                            strokeWidth: 5,
                            paintOrder: 'stroke'
                        }} />

                </div>
                <div className='workspace-title'>
                    Main workspace
                </div>
            </div>
        </div>


        <nav >
            <ul>
                {view === 'workspace' &&
                    <li className={`board-list-item 
            ${isIndex ? 'selected' : ''}`}>

                        <NavLink to={`board`} className='board-link aligned-center board-index-link' >
                            <div className='board-link-icon' >
                                <GridViewIcon className="icon" sx={{ fontSize: '16px', lineHeight: '100%' }} />

                            </div>
                            <div className='board-link-title'>Manage workspace</div>
                        </NavLink>



                    </li>}


            </ul>
            <div className='board-list-header'>
                <span>{view === 'workspace' ? 'Content' : 'Favorites'}</span>
                {view === 'workspace' && <Tooltip title="Add item to workspace">
                    <button className="add-board-btn" onClick={addEmptyBoard}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </Tooltip>}
            </div>
            <BoardList
                boards={filteredBoards} />


        </nav>
    </aside >



}