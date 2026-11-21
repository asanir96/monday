import { useState } from 'react'

import { boardService } from '../services/board'
import { addTask } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { TaskPreview } from './TaskPreview'

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
                    <th className="cell cell-actions" />
                </tr>
            </thead>

            <tbody>
                {group.tasks.map(task => (
                    <TaskPreview key={task.id} task={task} groupId={group.id} members={members} />
                ))}

                <tr className="task-row add-task-row">
                    <td className="cell cell-title" colSpan={5}>
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
                </tr>
            </tbody>
        </table>
    )
}
