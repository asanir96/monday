import { useState } from 'react'

import { Popover } from './Popover'

// The task due date cell: shows the date ("Nov 10"), opens a date input under it.
// value is 'YYYY-MM-DD' or ''. Presentational - the parent decides what to do with the pick:
// <DatePicker value={task.dueDate} onChange={dueDate => ...} />
//
// Editing works on a draft: typing doesn't save. Enter / clicking outside saves, Escape cancels.
export function DatePicker({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false)
    const [draftDate, setDraftDate] = useState(value || '')

    function onTogglePicker() {
        if (isOpen) return onClosePicker('outside')
        setDraftDate(value || '')
        setIsOpen(true)
    }

    function onClosePicker(reason) {
        setIsOpen(false)
        if (reason === 'escape') return
        // A half-typed year ('0202') or an emptied input isn't saved - Clear is the way to remove a date
        if (isFullDate(draftDate) && draftDate !== (value || '')) onChange(draftDate)
    }

    // The native date input doesn't submit a form on Enter, so Enter is handled here
    function onDateKeyDown(ev) {
        if (ev.key === 'Enter') onClosePicker('enter')
    }

    function onClearDate() {
        setIsOpen(false)
        if (value) onChange('')
    }

    return (
        <div className="date-picker">
            <Popover
                isOpen={isOpen}
                onClose={onClosePicker}
                className="date-picker-popover"
                trigger={
                    <button
                        type="button"
                        className="date-picker-btn"
                        onClick={onTogglePicker}
                        aria-haspopup="dialog"
                        aria-expanded={isOpen}
                    >
                        {formatDate(value)}
                    </button>
                }
            >
                <input
                    type="date"
                    value={draftDate}
                    aria-label="Due date"
                    autoFocus
                    // Keep everything that's typed (also a half-typed year) - it's checked only when saving
                    onChange={ev => setDraftDate(ev.target.value)}
                    onKeyDown={onDateKeyDown}
                />
                {value && <button type="button" className="btn-clear" onClick={onClearDate}>Clear</button>}
            </Popover>
        </div>
    )
}

// Typing the year digit by digit gives '0002', '0020'... - only a 4-digit year is a real date
function isFullDate(dateStr) {
    return !!dateStr && +dateStr.split('-')[0] >= 1000
}

// 'YYYY-MM-DD' -> 'Nov 10' (adds the year when it isn't this year)
function formatDate(dateStr) {
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-').map(Number)
    // Built from parts, so the date isn't shifted by the time zone
    const date = new Date(year, month - 1, day)
    const options = { month: 'short', day: 'numeric' }
    if (year !== new Date().getFullYear()) options.year = 'numeric'
    return date.toLocaleDateString('en-US', options)
}
