import { useState, useRef, useEffect } from 'react'

import { Icon } from './Icon'
import { Popover } from './Popover'
import { useSelector } from 'react-redux'

const EMPTY_LABEL = { id: '', title: '', color: '#c4c4c4' }

// A colored label cell (status, priority...): shows the current label, opens the list of labels under it.
// options: [{ id, title, color }], value: the id of the current label.
// Presentational - the parent decides what to do with the pick:
// <LabelPicker options={statusOptions} value={task.status} onChange={statusId => ...} />
export function LabelPicker({ options, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false)
    const currentLabel = options.find(option => option.id === value) || EMPTY_LABEL
    const firstColRect = useSelector(storedState => storedState.boardModule.firstColRect)
    const [isIntersecting, setIsIntersecting] = useState(null)
    const popoverRef = useRef(null)


    useEffect(() => {
        if (!isOpen) return
        
        function closeIfUnderFirstCol() {
            const popoverEl = popoverRef.current
            const firstColEl = popoverEl?.closest('tr')?.querySelector('.cell-title')
            if (!popoverEl || !firstColEl) return
            if (popoverEl.getBoundingClientRect().left < firstColEl.getBoundingClientRect().right) {
                setIsOpen(false)
            }
        }

        closeIfUnderFirstCol()
        window.addEventListener('scroll', closeIfUnderFirstCol, { passive: true, capture: true })
        window.addEventListener('resize', closeIfUnderFirstCol)
        return () => {
            window.removeEventListener('scroll', closeIfUnderFirstCol, { capture: true })
            window.removeEventListener('resize', closeIfUnderFirstCol)
        }
    }, [isOpen]);

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
                animation="expand"
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
                <ul className="label-picker-list" ref={popoverRef}>
                    {options.map(option => (
                        <li key={option.id}>
                            <button
                                type="button"
                                className="label-option"
                                style={{ '--label-color': option.color }}
                                onClick={() => onPickLabel(option.id)}
                            >
                                {option.title}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Not working yet - visual only for now */}
                <footer className="label-picker-footer">
                    <div className="footer-row">
                        <button type="button" className="btn-picker-footer">
                            <Icon name="editLabels" section="labelPicker" />
                            Edit Labels
                        </button>
                    </div>

                    <hr className="footer-divider" />

                    <div className="footer-row footer-ai-row">
                        <button type="button" className="btn-picker-footer">
                            <Icon name="autoAssign" section="labelPicker" />
                            Auto-assign labels
                        </button>
                    </div>
                </footer>
            </Popover>
        </div>
    )
}
