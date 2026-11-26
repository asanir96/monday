import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Icon } from './Icon'
import { Popover } from './Popover'

// One board in the boards table: open (link), and a ⋯ menu to rename (inline) or delete it
export function BoardTableRow({ board, onRename, onDelete }) {
    const [isEditing, setIsEditing] = useState(false)
    const [titleDraft, setTitleDraft] = useState('')
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const groups = board.groups || []
    const taskCount = groups.reduce((sum, group) => sum + (group.tasks?.length || 0), 0)
    const owner = board.createdBy

    function onStartEdit() {
        setIsMenuOpen(false)
        setTitleDraft(board.title)
        setIsEditing(true)
    }

    function onSaveTitle() {
        setIsEditing(false)
        const title = titleDraft.trim()
        if (!title || title === board.title) return
        onRename(title)
    }

    function onTitleKeyDown(ev) {
        if (ev.key === 'Enter') ev.target.blur() // blur saves
        if (ev.key === 'Escape') setIsEditing(false) // unmounts the input without saving
    }

    function onDeleteClick() {
        setIsMenuOpen(false)
        onDelete()
    }

    return (
        <tr className={`board-table-row${isMenuOpen ? ' menu-open' : ''}`}>
            <td className="col-title">
                <div className="board-title">
                    <Icon name="boardTypeMain" section="boardInfo" className="board-icon" />
                    {isEditing
                        ? <input
                            className="board-title-input"
                            value={titleDraft}
                            autoFocus
                            onFocus={ev => ev.target.select()}
                            onChange={ev => setTitleDraft(ev.target.value)}
                            onBlur={onSaveTitle}
                            onKeyDown={onTitleKeyDown}
                        />
                        : <Link to={`/board/${board._id}`} className="board-link">{board.title}</Link>
                    }
                </div>
            </td>

            <td className="col-created-by">
                {owner
                    ? <div className="board-owner">
                        {owner.imgUrl
                            ? <img className="board-owner-img" src={owner.imgUrl} alt="" />
                            : <span className="board-owner-img">{owner.fullname?.charAt(0)}</span>}
                        <span>{owner.fullname}</span>
                    </div>
                    : '-'}
            </td>

            <td className="col-count">{groups.length}</td>
            <td className="col-count">{taskCount}</td>

            <td className="col-actions">
                <Popover
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    className="board-menu"
                    animation="expand"
                    trigger={
                        <button className="btn-board-menu" title="Board actions" onClick={() => setIsMenuOpen(isOpen => !isOpen)}>⋯</button>
                    }
                >
                    <button className="board-menu-item" onClick={onStartEdit}>Rename</button>
                    <button className="board-menu-item danger" onClick={onDeleteClick}>Delete</button>
                </Popover>
            </td>
        </tr>
    )
}
