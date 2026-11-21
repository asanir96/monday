import { statusOptions } from '../services/board'
import { LabelPicker } from './LabelPicker'

// The task status cell. <StatusPicker value={task.status} onChange={statusId => ...} />
export function StatusPicker({ value, onChange }) {
    return <LabelPicker options={statusOptions} value={value} onChange={onChange} />
}
