import { BoardTableRow } from './BoardTableRow'

// The boards table on the BoardIndex page
// emptyMsg: what to show when there are no boards to show (none at all, or none match the search)
export function BoardTable({ boards, emptyMsg, onRenameBoard, onDeleteBoard }) {
    if (!boards.length) return <p className="board-index-msg">{emptyMsg}</p>

    return (
        <table className="board-table">
            <thead>
                <tr>
                    <th className="col-title">Board</th>
                    <th className="col-created-by">Owner</th>
                    <th className="col-count">Groups</th>
                    <th className="col-count">Items</th>
                    <th className="col-actions" />
                </tr>
            </thead>
            <tbody>
                {boards.map(board => (
                    <BoardTableRow
                        key={board._id}
                        board={board}
                        onRename={title => onRenameBoard(board, title)}
                        onDelete={() => onDeleteBoard(board)}
                    />
                ))}
            </tbody>
        </table>
    )
}
