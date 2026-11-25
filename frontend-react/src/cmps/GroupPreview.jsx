import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { useSelector } from 'react-redux'
import { updateGroup, removeGroup } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { InlineEdit } from './InlineEdit'
import { Popover } from './Popover'
import { TaskList } from './TaskList'

import { GroupHeader } from './GroupHeader'

// idx: the group's place in the board - the drag and drop needs it
export function GroupPreview({ group, idx, members }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isGroupExpanded, setIsGroupExpanded] = useState(true)
    const taskCount = group.tasks.length
    const columns = useSelector(storedState => storedState.boardModule.board.columns)

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
                    {/* The header is the drag handle */}
                    {isGroupExpanded && <GroupHeader
                        group={group}
                        isMenuOpen={isMenuOpen}
                        setIsMenuOpen={setIsMenuOpen}
                        onRemoveGroup={onRemoveGroup}
                        provided={provided}
                        onRenameGroup={onRenameGroup}
                        taskCount={taskCount}
                        isGroupExpanded={isGroupExpanded}
                        setIsGroupExpanded={setIsGroupExpanded} />}

                    {isGroupExpanded ?
                        <TaskList group={group} members={members} /> :

                        <table className="task-list collapsed" {...provided.dragHandleProps}>
                            <thead>
                                <tr className="task-row task-list-header">
                                    <th className="cell cell-title">
                                        <GroupHeader
                                            group={group}
                                            isMenuOpen={isMenuOpen}
                                            setIsMenuOpen={setIsMenuOpen}
                                            onRemoveGroup={onRemoveGroup}
                                            provided={provided}
                                            onRenameGroup={onRenameGroup}
                                            isGroupExpanded={isGroupExpanded}
                                            taskCount={taskCount}
                                            setIsGroupExpanded={setIsGroupExpanded} />

                                    </th>
                                    <th className="cell cell-owner">Owner</th>

                                    { columns.map(column => {
                                        return getDynamicClassName(column.type) &&  <th className={`cell cell-${column.type}`}>
                                            {column.title}
                                        </th>
                                    })}

                                    <th className="cell cell-actions" />
                                </tr>
                            </thead>
                        </table>
                    }
                </section>
            )}
        </Draggable>
    )
}


function getDynamicClassName(cmp) {
    const cmpFieldMap = {
        'status': 'status',
        'labels': 'status',
        'priority': 'priority',
        'date': 'date',
        'text': 'status',
        'files': 'status'
    }

    return cmpFieldMap[cmp]

}

