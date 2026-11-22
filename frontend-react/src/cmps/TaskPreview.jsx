import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'

import { updateTask, removeTask } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { getInitials } from '../services/util.service'
import { InlineEdit } from './InlineEdit'
import { Popover } from './Popover'
import { StatusPicker } from './StatusPicker'
import { PriorityPicker } from './PriorityPicker'
import { DatePicker } from './DatePicker'

const MAX_AVATARS = 2

// One task row. Title is editable, status, priority + due date have pickers; owner is display-only for now (picker comes later)
// idx: the task's place in its group - the drag and drop needs it
export function TaskPreview({ task, idx, groupId, members }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const owners = members.filter(member => task.memberIds?.includes(member._id))

    async function onRenameTask(title) {
        try {
            await updateTask(groupId, { ...task, title })
        } catch (err) {
            showErrorMsg('Cannot rename item')
        }
    }

    // Used by the cell pickers: onUpdateTaskField('status', 'done')
    async function onUpdateTaskField(field, value) {
        try {
            await updateTask(groupId, { ...task, [field]: value })
        } catch (err) {
            showErrorMsg(`Cannot update ${field}`)
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
        <Draggable draggableId={task.id} index={idx}>
            {(provided, snapshot) => (
                <tr
                    className={`task-row task-preview${snapshot.isDragging ? ' is-dragging' : ''}${snapshot.isDropAnimating ? ' is-dropping' : ''}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <td className="cell cell-title">
                        <InlineEdit className="task-title" value={task.title} placeholder="Item name" onSave={onRenameTask} />
                    </td>

                    <td className="cell cell-owner">
                        {!owners.length && <span className="avatar avatar-placeholder" title="No owner">?</span>}
                        {owners.slice(0, MAX_AVATARS).map(member => (
                            member.imgUrl ? <img key={member._id} className="avatar" src={member.imgUrl} alt={member.fullname} title={member.fullname} /> : <span key={member._id} className="avatar avatar-placeholder" title={member.fullname}>{getInitials(member.fullname)}</span>
                        ))}
                        {owners.length > MAX_AVATARS && <span className="avatar avatar-more">+{owners.length - MAX_AVATARS}</span>}
                    </td>

                    <td className="cell cell-status">
                        <StatusPicker value={task.status} onChange={statusId => onUpdateTaskField('status', statusId)} />
                    </td>

                    <td className="cell cell-priority">
                        <PriorityPicker value={task.priority} onChange={priorityId => onUpdateTaskField('priority', priorityId)} />
                    </td>

                    <td className="cell cell-date">
                        <DatePicker value={task.dueDate} onChange={dueDate => onUpdateTaskField('dueDate', dueDate)} />
                    </td>

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
            )}
        </Draggable>
    )
}
