import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'

import { updateTask, removeTask, updateBoardOptimistic } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { getInitials } from '../services/util.service'
import { InlineEdit } from './InlineEdit'
import { Popover } from './Popover'
import { StatusPicker } from './StatusPicker'
import { PriorityPicker } from './PriorityPicker'
import { DatePicker } from './DatePicker'
import { TaskText } from './TaskText'
import { TaskFile } from './TaskFile'
import { useSelector } from 'react-redux'
import { LabelPicker } from './LabelPicker'
import { boardService, columnTypeOptions } from '../services/board'
import { NumberPicker } from './NumberPicker'
const MAX_AVATARS = 2

// One task row. Title is editable, status, priority + due date have pickers; owner is display-only for now (picker comes later)
// idx: the task's place in its group - the drag and drop needs it
export function TaskPreview({ task, idx, groupId }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const columns = useSelector(storedState => storedState.boardModule.board.columns)
    const board = useSelector(storedState => storedState.boardModule.board)
    
    const boardMembers = board.members
    const memberColumnId = columns.find(column => column.type === 'members').id
    
    const taskMemberIds = task.values[memberColumnId]

    const owners = boardMembers.filter(member => taskMemberIds.includes(member._id))

    async function onRenameTask(title) {
        try {
            await updateTask(groupId, { ...task, title })
        } catch (err) {
            showErrorMsg('Cannot rename item')
        }
    }

    // Used by the cell pickers: onUpdateTaskField('status', 'done')
    async function onUpdateTaskField(columnId, value) {
        try {
            await updateTask(groupId, { ...task, values: { ...task.values, [columnId]: value } })
        } catch (err) {
            const columnTitle = columns.find(column => column.id === columnId).title
            showErrorMsg(`Cannot update ${columnTitle}`)
        }
    }

    async function onAddColumn(type) {
        try {
            setIsMenuOpen(false)
            const boardToUpdate = boardService.addColumnToBoard(board, { type })
            await updateBoardOptimistic(boardToUpdate)
        } catch (err) {
            console.log(err)
            showErrorMsg(`Cannot add column`)
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
                    {...provided.dragHandleProps}>

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

                    {columns.map(column => {
                        const { type, id: columnId } = column
                        const taskValues = task.values
                        return getDynamicClassName(type) && <td className={`cell cell-${type}`}>
                            <DynamicColumn
                                cmpType={type}
                                options={board.labels}
                                value={taskValues[columnId]}
                                onChange={value => onUpdateTaskField(columnId, value)} />
                        </td>
                    })}

                    <td className="cell cell-actions">
                        <Popover
                            isOpen={isMenuOpen}
                            onClose={() => setIsMenuOpen(false)}
                            className="task-menu"
                            animation="expand"
                            trigger={
                                <button className="btn-icon" title="Item actions" onClick={() => setIsMenuOpen(isOpen => !isOpen)}>⋯</button>
                            }
                        >

                            <button className="menu-item danger" onClick={onRemoveTask}>Delete item</button>
                            {columnTypeOptions.map(option => {
                                return <button className="menu-item danger" onClick={() => onAddColumn(option)}>{`Add ${option} column`}</button>

                            })}
                        </Popover>
                    </td>
                </tr>
            )}
            {/* {(provided, snapshot) => (
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
                            animation="expand"
                            trigger={
                                <button className="btn-icon" title="Item actions" onClick={() => setIsMenuOpen(isOpen => !isOpen)}>⋯</button>
                            }
                        >
                            <button className="menu-item danger" onClick={onRemoveTask}>Delete item</button>
                        </Popover>
                    </td>
                </tr>
            )} */}
        </Draggable>
    )
}

function DynamicColumn(props) {
    const cmpMap = {
        'status': <StatusPicker {...props} />,
        'priority': <PriorityPicker {...props} />,
        'labels': <LabelPicker {...props} />,
        'date': <DatePicker {...props} />,
        'text': <TaskText {...props} />,
        'files': <TaskFile {...props} />,
        'number':<NumberPicker {...props}/>

    }
    return cmpMap[props.cmpType]
}

function getDynamicField(cmp) {
    const cmpFieldMap = {
        'StatusPicker': 'status',
        'PriorityPicker': 'priority',
        'DatePicker': 'dueDate',
        'TaskText': 'description',
        'TaskFile': 'files'
    }

    return cmpFieldMap[cmp]

}

function getDynamicClassName(cmp) {
    const cmpFieldMap = {
        'status': 'status',
        'labels': 'status',
        'priority': 'priority',
        'date': 'date',
        'text': 'status',
        'files': 'status',
        'number':'status'
    }

    return cmpFieldMap[cmp]

}
