import { boardService } from '../services/board'
import { useEffect } from 'react'
import { useMatch, NavLink } from 'react-router-dom';

import { useSelector } from 'react-redux'
import { useBoardCrud } from '../customHooks/useBoardCrud'
import { loadBoards } from '../store/actions/board.actions'

import { BoardList } from '../cmps/BoardList'

import { Tooltip } from '@mui/material'
import { Icon } from './Icon';

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
            <Tooltip title="Close workspace menu">
                <button className='btn-icon close-sidbar-btn' onClick={() => setIsSidebarOpen(false)}>
                   <Icon name="collapseSidebar" section="boardSidebar" />
                </button>
            </Tooltip>

            <div className='header-title'>Workspace</div>
            <div className='workspace-dropdown'>
                <div className='workspace-avatar position-relative'>
                    <div className='container'>
                        <span>M</span>
                    </div>
                    <Icon name="workspaceAvatarHome" section="boardSidebar" />


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
                                <Icon name="manageWorkspace" section="boardSidebar"/>
                            </div>
                            <div className='board-link-title'>Manage workspace</div>
                        </NavLink>



                    </li>}


            </ul>
            <div className='board-list-header'>
                <span>{view === 'workspace' ? 'Content' : 'Favorites'}</span>
                {view === 'workspace' && <Tooltip title="Add item to workspace">
                    <button className="add-board-btn" onClick={addEmptyBoard}>
                        <Icon name="add" section="boardSidebar" />
                    </button>
                </Tooltip>}
            </div>
            <BoardList
                boards={filteredBoards} />


        </nav>
    </aside >



}