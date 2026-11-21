import { priorityOptions } from '../services/board'
import { LabelPicker } from './LabelPicker'

// The task priority cell. <PriorityPicker value={task.priority} onChange={priorityId => ...} />
export function PriorityPicker({ value, onChange }) {
    return <LabelPicker options={priorityOptions} value={value} onChange={onChange} />
}
