import { useState } from 'react'
import { Droppable } from '@hello-pangea/dnd'

import { boardService, statusOptions, priorityOptions } from '../services/board'
import { addTask } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { TaskPreview } from './TaskPreview'
import { LabelSummary } from './LabelSummary'

export function TaskList({ group, members }) {
    const [newTaskTitle, setNewTaskTitle] = useState('')

    // Runs on Enter (form submit) and when the input loses focus
    async function onAddTask(ev) {
        ev.preventDefault()
        const title = newTaskTitle.trim()
        if (!title) return
        setNewTaskTitle('')
        try {
            await addTask(group.id, boardService.getEmptyTask(title))
        } catch (err) {
            showErrorMsg('Cannot add item')
        }
    }

    return (
        <table className="task-list">
            <thead>
                <tr className="task-row task-list-header">
                    <th className="cell cell-title">Task</th>
                    <th className="cell cell-owner">Owner</th>
                    <th className="cell cell-status">Status</th>
                    <th className="cell cell-priority">Priority</th>
                    <th className="cell cell-date">Due date</th>
                    <th className="cell cell-actions" />
                </tr>
            </thead>

            {/* Tasks can be dropped here from this group or any other (the list id is the group id) */}
            <Droppable droppableId={group.id} type="TASK">
                {provided => (
                    <tbody ref={provided.innerRef} {...provided.droppableProps}>
                        {group.tasks.map((task, idx) => (
                            <TaskPreview key={task.id} task={task} idx={idx} groupId={group.id} members={members} />
                        ))}
                        {provided.placeholder}

                        <tr className="task-row add-task-row">
                            {/* The input sits in the sticky Task column; the other columns are one empty cell */}
                            <td className="cell cell-title">
                                <form onSubmit={onAddTask}>
                                    <input
                                        className="add-task-input"
                                        value={newTaskTitle}
                                        placeholder="+ Add item"
                                        onChange={ev => setNewTaskTitle(ev.target.value)}
                                        onBlur={onAddTask}
                                    />
                                </form>
                            </td>
                            <td className="cell cell-filler" colSpan={5} />
                        </tr>
                    </tbody>
                )}
            </Droppable>

            {/* monday's summary row under the group: progress bars under Status and Priority */}
            <tfoot>
                <tr className="task-row summary-row">
                    <td className="cell cell-title" />
                    <td className="cell cell-owner" />
                    <td className="cell cell-status">
                        <LabelSummary tasks={group.tasks} field="status" options={statusOptions} />
                    </td>
                    <td className="cell cell-priority">
                        <LabelSummary tasks={group.tasks} field="priority" options={priorityOptions} />
                    </td>
                    <td className="cell cell-date" />
                    <td className="cell cell-actions" />
                </tr>
            </tfoot>
        </table>
    )
}
