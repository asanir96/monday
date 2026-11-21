import { useState } from 'react'

import { Popover } from './Popover'
import { statusOptions, getStatusOption } from '../services/board'

// Status cell: shows the current status, opens a list of statuses under it.
// Presentational - the parent decides what to do with the pick:
// <StatusPicker value={task.status} onChange={status => ...} />
export function StatusPicker({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false)
    const currentStatus = getStatusOption(value)

    function onPickStatus(statusId) {
        setIsOpen(false)
        if (statusId !== value) onChange(statusId)
    }

    return (
        <div className="status-picker">
            <Popover
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                className="status-picker-popover"
                trigger={
                    <button
                        type="button"
                        className="status-picker-btn"
                        style={{ '--status-color': currentStatus.color }}
                        onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)}
                        aria-haspopup="dialog"
                        aria-expanded={isOpen}
                    >
                        {currentStatus.title}
                    </button>
                }
            >
                <ul className="status-picker-list">
                    {statusOptions.map(option => (
                        <li key={option.id}>
                            <button
                                type="button"
                                className={`status-option${option.id === value ? ' selected' : ''}`}
                                style={{ '--status-color': option.color }}
                                onClick={() => onPickStatus(option.id)}
                            >
                                {option.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </Popover>
        </div>
    )
}
