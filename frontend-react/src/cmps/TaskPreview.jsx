// Read-only row for now
export function TaskPreview({ task }) {
    return (
        <tr className="task-row task-preview">
            <td className="cell cell-title">{task.title}</td>
            <td className="cell cell-owner">
                <span className="avatar-placeholder" title="No owner">?</span>
            </td>
            <td className="cell cell-status">{task.status}</td>
        </tr>
    )
}
