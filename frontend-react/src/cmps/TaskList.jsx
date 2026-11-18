import { TaskPreview } from './TaskPreview'

export function TaskList({ group }) {
    return (
        <table className="task-list">
            <thead>
                <tr className="task-row task-list-header">
                    <th className="cell cell-title">Task</th>
                    <th className="cell cell-owner">Owner</th>
                    <th className="cell cell-status">Status</th>
                </tr>
            </thead>

            <tbody>
                {group.tasks.map(task => (
                    <TaskPreview key={task.id} task={task} />
                ))}
            </tbody>
        </table>
    )
}
