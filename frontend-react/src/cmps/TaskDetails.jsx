import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useSelector } from 'react-redux'

import { updateTask } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { InlineEdit } from './InlineEdit'

const TABS = [
    { id: 'updates', title: 'Updates' },
    { id: 'files', title: 'Files' },
    { id: 'activity', title: 'Activity Log' },
]

// The task's side panel (monday's "item card"). A nested route of BoardDetails: /board/:boardId/task/:taskId
// BoardDetails renders it in its <Outlet />, so the board stays on screen behind it.
// For now the tabs are empty containers - their content (updates etc.) comes later, with sockets.
export function TaskDetails() {
    const { boardId, taskId } = useParams()
    const navigate = useNavigate()
    const board = useSelector(storeState => storeState.boardModule.board)
    const [activeTab, setActiveTab] = useState('updates')

    // BoardDetails only renders us once this board is loaded, so the task is either here or doesn't exist
    const { task, group } = _findTask(board, taskId)

    function onClose() {
        navigate(`/board/${boardId}`)
    }

    // Esc closes the panel
    useEffect(() => {
        function onKeyDown(ev) {
            if (ev.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [boardId])

    // No such task (deleted, or a bad link) - close the panel
    useEffect(() => {
        if (!task) navigate(`/board/${boardId}`, { replace: true })
    }, [task])

    if (!task) return null

    async function onRenameTask(title) {
        try {
            await updateTask(group.id, { ...task, title })
        } catch (err) {
            showErrorMsg('Cannot rename item')
        }
    }

    return (
        <aside className="task-details">
            <header className="task-details-header">
                <button className="btn-close" title="Close" aria-label="Close" onClick={onClose}>✕</button>

                <InlineEdit className="task-details-title" value={task.title} placeholder="Item name" onSave={onRenameTask} />

                <span className="task-details-group" style={{ '--group-color': group.style?.color || '#c4c4c4' }}>
                    {group.title}
                </span>
            </header>

            <nav className="task-details-tabs">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`task-details-tab${activeTab === tab.id ? ' active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.title}
                    </button>
                ))}
            </nav>

            {/* Empty container for now - filled in later (sockets) */}
            <section className={`task-details-content ${activeTab}`}>
                <p className="task-details-empty">
                    No {TABS.find(tab => tab.id === activeTab).title.toLowerCase()} yet for this item
                </p>
            </section>
        </aside>
    )
}

// Finds the task and the group it's in
function _findTask(board, taskId) {
    for (const group of board.groups) {
        const task = group.tasks.find(task => task.id === taskId)
        if (task) return { task, group }
    }
    return {}
}
