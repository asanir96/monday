import { useState } from 'react'

import { getStatusOption } from '../services/board'
import { updateTask, removeTask } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { InlineEdit } from './InlineEdit'
import { Popover } from './Popover'

const MAX_AVATARS = 2

// One task row. Title is editable; owner + status are display-only for now (pickers come later)
export function TaskPreview({ task, groupId, members }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const owners = members.filter(member => task.memberIds?.includes(member._id))
    const status = getStatusOption(task.status)

    async function onRenameTask(title) {
        try {
            await updateTask(groupId, { ...task, title })
        } catch (err) {
            showErrorMsg('Cannot rename item')
        }
    }

    async function onRemoveTask() {
        setIsMenuOpen(false)
        try {
            await removeTask(groupId, task.id)
        } catch (err) {
            showErrorMsg('Cannot delete item')
        }
    }

    return (
        <tr className="task-row task-preview">
            <td className="cell cell-title">
                <InlineEdit className="task-title" value={task.title} placeholder="Item name" onSave={onRenameTask} />
            </td>

            <td className="cell cell-owner">
                {!owners.length && <span className="avatar avatar-placeholder" title="No owner">?</span>}
                {owners.slice(0, MAX_AVATARS).map(member => (
                    <img key={member._id} className="avatar" src={member.imgUrl} alt={member.fullname} title={member.fullname} />
                ))}
                {owners.length > MAX_AVATARS && <span className="avatar avatar-more">+{owners.length - MAX_AVATARS}</span>}
            </td>

            <td className="cell cell-status" style={{ backgroundColor: status.color }}>{status.title}</td>

            <td className="cell cell-actions">
                <Popover
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    className="task-menu"
                    trigger={
                        <button className="btn-icon" title="Item actions" onClick={() => setIsMenuOpen(isOpen => !isOpen)}>⋯</button>
                    }
                >
                    <button className="menu-item danger" onClick={onRemoveTask}>Delete item</button>
                </Popover>
            </td>
        </tr>
    )
}
