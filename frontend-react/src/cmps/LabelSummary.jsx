import { useState } from 'react'
import { createPortal } from 'react-dom'

import { getLabelSummary } from '../services/board'

// The hovered part grows to this height (LabelSummary.css), and the tooltip sits this far above it
const HOVERED_PART_HEIGHT = 30
const TOOLTIP_GAP = 6

// monday's progress bar ("battery") under a label column: one colored part per label, as wide as its share of the tasks.
// Hovering a part grows it and shows "Done 4/12   33.3%" above it.
// <LabelSummary tasks={group.tasks} field="status" options={statusOptions} />
export function LabelSummary({ tasks, field, options }) {
    // { txt, x, y }: the tooltip of the hovered part, and where its bottom-center goes on the screen
    const [tooltip, setTooltip] = useState(null)
    const summary = getLabelSummary(tasks, field, options)
    const total = tasks.length

    function onShowTooltip(ev, label) {
        const rect = ev.currentTarget.getBoundingClientRect()
        setTooltip({
            txt: `${label.title} ${label.count}/${total}   ${getPercent(label.count, total)}%`,
            x: rect.left + rect.width / 2,
            // From the part's middle, so it doesn't matter if the hover grow already happened
            y: rect.top + rect.height / 2 - HOVERED_PART_HEIGHT / 2 - TOOLTIP_GAP,
        })
    }

    return (
        <div className="label-summary">
            <div className="battery">
                <div className="battery-background" />
                <div className="battery-parts">
                    {summary.map(label => (
                        <div
                            key={label.id}
                            className="battery-part"
                            style={{ width: `${label.count / total * 100}%`, '--label-color': label.color }}
                            onMouseEnter={ev => onShowTooltip(ev, label)}
                            onMouseLeave={() => setTooltip(null)}
                        />
                    ))}
                </div>
            </div>

            {/* In <body>, so the scrolling groups area can't cut it (a collapsed first group's tooltip goes above it) */}
            {tooltip && createPortal(
                <span className="battery-tooltip" role="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
                    {tooltip.txt}
                </span>,
                document.body
            )}
        </div>
    )
}

// 33.3, 8.3 - and 100, not 100.0 (like monday)
function getPercent(count, total) {
    return +(count / total * 100).toFixed(1)
}
