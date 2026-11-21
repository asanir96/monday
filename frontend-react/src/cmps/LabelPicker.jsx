import { useState } from 'react'

import { Popover } from './Popover'

const EMPTY_LABEL = { id: '', title: '', color: '#c4c4c4' }

// A colored label cell (status, priority...): shows the current label, opens the list of labels under it.
// options: [{ id, title, color }], value: the id of the current label.
// Presentational - the parent decides what to do with the pick:
// <LabelPicker options={statusOptions} value={task.status} onChange={statusId => ...} />
export function LabelPicker({ options, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false)
    const currentLabel = options.find(option => option.id === value) || EMPTY_LABEL

    function onPickLabel(labelId) {
        setIsOpen(false)
        if (labelId !== value) onChange(labelId)
    }

    return (
        <div className="label-picker">
            <Popover
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                className="label-picker-popover"
                trigger={
                    <button
                        type="button"
                        className="label-picker-btn"
                        style={{ '--label-color': currentLabel.color }}
                        onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)}
                        aria-haspopup="dialog"
                        aria-expanded={isOpen}
                    >
                        {currentLabel.title}
                    </button>
                }
            >
                <ul className="label-picker-list">
                    {options.map(option => (
                        <li key={option.id}>
                            <button
                                type="button"
                                className={`label-option${option.id === value ? ' selected' : ''}`}
                                style={{ '--label-color': option.color }}
                                onClick={() => onPickLabel(option.id)}
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
