import { useState } from 'react'
import { Link } from 'react-router-dom'

// One board in the boards table: open (link), rename (inline), delete
export function BoardTableRow({ board, onRename, onDelete }) {
    const [isEditing, setIsEditing] = useState(false)
    const [titleDraft, setTitleDraft] = useState('')

    const groups = board.groups || []
    const taskCount = groups.reduce((sum, group) => sum + (group.tasks?.length || 0), 0)

    function onStartEdit() {
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

    return (
        <tr className="board-table-row">
            <td className="col-title">
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
            </td>
            <td className="col-created-by">{board.createdBy?.fullname || '-'}</td>
            <td className="col-count">{groups.length}</td>
            <td className="col-count">{taskCount}</td>
            <td className="col-actions">
                <button className="btn-board-action" onClick={onStartEdit}>Rename</button>
                <button className="btn-board-action danger" onClick={onDelete}>Delete</button>
            </td>
        </tr>
    )
}
