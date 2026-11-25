import { getLabelSummary } from '../services/board'

// monday's progress bar ("battery") under a label column: one colored part per label, as wide as its share of the tasks.
// Hovering a part grows it and shows "Done 4/12   33.3%" above it.
// <LabelSummary tasks={group.tasks} field="status" options={statusOptions} />
export function LabelSummary({ tasks, field, options }) {
    const summary = getLabelSummary(tasks, field, options)
    const total = tasks.length

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
                        >
                            <span className="battery-tooltip" role="tooltip">
                                {`${label.title} ${label.count}/${total}   ${getPercent(label.count, total)}%`}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// 33.3, 8.3 - and 100, not 100.0 (like monday)
function getPercent(count, total) {
    return +(count / total * 100).toFixed(1)
}
