import { getNumbersSum } from '../services/board'


export function NumbersSummary({ tasks, columnId }) {
    const summary = getNumbersSum(tasks, columnId)

    return (
        <div className="number-summary">
            <div>{summary}</div>
            sum
        </div>
    )
}