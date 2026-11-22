import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'

import { updateGroup, removeGroup } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { InlineEdit } from './InlineEdit'
import { Popover } from './Popover'
import { TaskList } from './TaskList'

// idx: the group's place in the board - the drag and drop needs it
export function GroupPreview({ group, idx, members }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const taskCount = group.tasks.length

    async function onRenameGroup(title) {
        try {
            await updateGroup({ ...group, title })
        } catch (err) {
            showErrorMsg('Cannot rename group')
        }
    }

    async function onRemoveGroup() {
        setIsMenuOpen(false)
        if (!confirm(`Delete group "${group.title}" and its ${taskCount} item(s)?`)) return
        try {
            await removeGroup(group.id)
        } catch (err) {
            showErrorMsg('Cannot delete group')
        }
    }

    return (
        <Draggable draggableId={group.id} index={idx}>
            {(provided, snapshot) => (
                <section
                    className={`group-preview${snapshot.isDragging ? ' is-dragging' : ''}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{ ...provided.draggableProps.style, '--group-color': group.style?.color || '#c4c4c4' }}
                >
                    {/* The header is the drag handle */}
                    <header className="group-header" {...provided.dragHandleProps}>
                        <Popover
                            isOpen={isMenuOpen}
                            onClose={() => setIsMenuOpen(false)}
                            className="group-menu"
                            animation="fade"
                            trigger={
                                <button className="btn-icon btn-group-menu" title="Group actions" onClick={() => setIsMenuOpen(isOpen => !isOpen)}>
                                    ⋯
                                </button>
                            }
                        >
                            <button className="menu-item danger" onClick={onRemoveGroup}>Delete group</button>
                        </Popover>

                        <InlineEdit className="group-title" value={group.title} placeholder="Group name" onSave={onRenameGroup} />

                        <span className="task-count">{taskCount} {taskCount === 1 ? 'item' : 'items'}</span>
                    </header>

                    <TaskList group={group} members={members} />
                </section>
            )}
        </Draggable>
    )
}
