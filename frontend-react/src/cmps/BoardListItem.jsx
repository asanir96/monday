import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { useState } from 'react'
import { useBoardCrud } from '../customHooks/useBoardCrud';
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { useMatch } from 'react-router-dom'

import { BoardPreview } from './BoardPreview'
import { BoardPreviewEdit } from './BoardPreviewEdit';
import { Popover } from './Popover';
import { BoardActions } from './BoardActions'

import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';


export function BoardListItem({ board }) {
    const isActive = !!useMatch(`board/${board._id}`)
    const [isEdit, setIsEdit] = useState(false)
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const { onRemoveBoard, onUpdateBoard } = useBoardCrud()

    function onMoreOptionsToggle() {
        setIsPopoverOpen(prev=>!prev)
    }

    function handleMoreOptsClose() {
        setIsPopoverOpen(false)
    }

    async function onDelete(boardId) {
        try {
            setIsPopoverOpen(false)
            await onRemoveBoard(boardId)
            showSuccessMsg('Board was deleted')
        } catch (err) {
            console.log(err)
            showErrorMsg('Could not remove board')
        }
    }

    function onStopEdit(updatedBoard, ev) {
        if (ev.key && ev.key !== 'Enter') return

        setIsEdit(false)
        if (updatedBoard.title === board.title) return

        onUpdateBoard(updatedBoard)
    }

    function onStartEdit() {
        setIsEdit(true)
        setIsPopoverOpen(false)
    }

    function onStarToggle() {
        onUpdateBoard({ ...board, isStarred: !board.isStarred })
    }

    return <li
        className={`board-list-item 
            ${isActive ? 'selected' : ''}
            ${isPopoverOpen ? 'focus' : ''}`}
        key={board._id} >

        <NavLink to={`board/${board._id}`} className='board-link aligned-center' >

            <SpaceDashboardOutlinedIcon className='aligned-center' sx={{ fontSize: '1em', lineHeight: '100%' }} />

            {isEdit ?
                <BoardPreviewEdit
                    board={board}
                    onStopEdit={onStopEdit}
                    onStartEdit={onStartEdit} /> :
                <BoardPreview board={board} />
            }


        </NavLink>

        <Popover
            isOpen={isPopoverOpen}
            onClose={handleMoreOptsClose}
            trigger={<button
                onClick={onMoreOptionsToggle}
                id="board-more-options"
                className="board-more-options">
                <FontAwesomeIcon icon={faEllipsis} />
            </button>}
            className={"board-actions"}>

            <BoardActions
                board={board}
                onRemoveBoard={onDelete}
                onStartEdit={onStartEdit}
                onStarToggle={onStarToggle} />
        </Popover>
    </li>
}