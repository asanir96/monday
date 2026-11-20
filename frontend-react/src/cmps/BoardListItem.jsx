import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { useState } from 'react'
import { useBoardCrud } from '../customHooks/useBoardCrud';
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { useMatch } from 'react-router-dom'

import { BoardPreview } from './BoardPreview'
import { BoardPreviewEdit } from './BoardPreviewEdit';
import { DropdownMenu } from './DropdownMenu'
import { BoardActions } from './BoardActions'

import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';


export function BoardListItem({ board }) {
    const isActive = !!useMatch(`board/${board._id}`)
    const [isEdit, setIsEdit] = useState(false)
    const [dropwdownAnchorEl, setDropwdownAnchorEl] = useState(null)
    const { onRemoveBoard, onUpdateBoard } = useBoardCrud()

    const actionsMap = {
        
    }
    const handleMoreOptsClick = (event) => {
        event.preventDefault()
        console.log('event.currentTarget', event.currentTarget)
        setDropwdownAnchorEl(event.currentTarget)
    }

    const handleMoreOptsClose = () => setDropwdownAnchorEl(null)

    async function onDelete(boardId) {
        try {
            setDropwdownAnchorEl(null)
            await onRemoveBoard(boardId)
            showSuccessMsg('Board was deleted')
        } catch (err) {
            console.log(err)
            showErrorMsg('Could not remove board')
        }
    }

    function onStopEdit(board) {
        setIsEdit(false)
        onUpdateBoard(board)
    }

    function onStartEdit() {
        setIsEdit(true)
        setDropwdownAnchorEl(null)
    }

    function onStarToggle() {
        onUpdateBoard({ ...board, isStarred: !board.isStarred })
    }

    return <li
        className={`board-list-item 
            ${isActive ? 'selected' : ''}
            ${dropwdownAnchorEl ? 'focus' : ''}`}
        key={board._id} >

        <DropdownMenu
            handleClick={handleMoreOptsClick}
            handleClose={handleMoreOptsClose}
            anchorEl={dropwdownAnchorEl}>

            <BoardActions
                board={board}
                onRemoveBoard={onDelete}
                onStartEdit={onStartEdit}
                onStarToggle={onStarToggle} />

        </DropdownMenu>

        <NavLink to={`board/${board._id}`} className='board-link aligned-center' >

            <SpaceDashboardOutlinedIcon className='aligned-center' sx={{ fontSize: '1em', lineHeight: '100%' }} />

            {isEdit ?
                <BoardPreviewEdit
                    board={board}
                    onStopEdit={onStopEdit}
                    onStartEdit={onStartEdit} /> :
                <BoardPreview board={board} />
            }

            <button id="board-more-options" className="board-more-options" onClick={handleMoreOptsClick} >
                <FontAwesomeIcon icon={faEllipsis} />
            </button>
        </NavLink>
    </li>
}