import { useEffect, useRef, useState } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import { createPortal } from 'react-dom'

import { boardService, statusOptions, priorityOptions, getShownColumns } from '../services/board'
import { addTask } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { TaskPreview } from './TaskPreview'
import { useDispatch, useSelector } from 'react-redux'
import { Popover } from './Popover'
import { updateBoardOptimistic, moveColumn } from '../store/actions/board.actions'
import { useColumnDrag } from '../customHooks/useColumnDrag'
import { SET_FIRST_COL_RECT } from '../store/reducers/board.reducer'
import { LabelSummary } from './LabelSummary'
import { NumbersSummary } from './NumbersSummary'

export function TaskList({ group }) {
    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [cmpIdxMenuOpen, setCmpIdxMenuOpen] = useState(null)
    const columns = useSelector(storedState => storedState.boardModule.board.columns)
    const board = useSelector(storedState => storedState.boardModule.board)
    const firstColRef = useRef(null)
    const dispatch = useDispatch()
    const shownColumns = getShownColumns(columns)
    const { drag: columnDrag, onColumnPointerDown } = useColumnDrag(shownColumns, onMoveColumn)

    function setFirstColRect() {
        if (!firstColRef.current) return

        dispatch({
            type: SET_FIRST_COL_RECT,
            firstColRect: firstColRef.current.getBoundingClientRect()
        })
    }

    useEffect(() => {
        setFirstColRect()


        window.addEventListener('scroll', setFirstColRect, { passive: true, capture: true });
        window.addEventListener('resize', setFirstColRect);

        return () => {
            window.removeEventListener('scroll', setFirstColRect, { passive: true, capture: true });
            window.removeEventListener('resize', setFirstColRect);
        };
    }, [cmpIdxMenuOpen]);


    const callback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Element entered the viewport
                entry.target.classList.add('visible');

                // Optional: Stop observing once triggered (great for lazy loading)
                observer.unobserve(entry.target);
            }
        });
    };

    // Runs on Enter (form submit) and when the input loses focus
    async function onAddTask(ev) {
        ev.preventDefault()
        const title = newTaskTitle.trim()
        if (!title) return
        setNewTaskTitle('')
        try {
            await addTask(group.id, boardService.getEmptyTask(title, board))
        } catch (err) {
            console.log(err)
            showErrorMsg('Cannot add item')
        }
    }

    async function onMoveColumn(columnId, toColumnId) {
        try {
            await moveColumn(columnId, toColumnId)
        } catch (err) {
            showErrorMsg('Cannot move the column')
        }
    }

    async function onRemoveColumn(colId) {
        try {
            setCmpIdxMenuOpen(null)
            const boardToUpdate = boardService.removeColumnFromBoard(board, colId)
            await updateBoardOptimistic(boardToUpdate)
        } catch (err) {
            console.log(err)
            showErrorMsg(`Cannot add column`)
        }
    }


    return (
        <>
        {columnDrag && <ColumnDragCard drag={columnDrag} />}
        <table className="task-list">
            {/* The columns' widths (from the same classes as the cells) */}
            <colgroup>
                <col className="cell-title" />
                <col className="cell-owner" />
                {shownColumns.map(column => (
                    <col key={column.id} className={`cell-${getDynamicClassName(column.type)}`} />
                ))}
                <col className="cell-actions" />
            </colgroup>

            <thead>
                {/* A column header can be dragged to move the whole column (useColumnDrag) - for every group.
                    Task and Owner stay in place: they aren't in the board's columns */}
                <tr className="task-row task-list-header">

                    <th className="cell cell-title" ref={firstColRef}>Task</th>
                    <th className="cell cell-owner">Owner</th>

                    {shownColumns.map((column, idx) => {
                        const { type, id: columnId, title } = column
                        return (
                            <th
                                key={columnId}
                                className={`cell cell-${getDynamicClassName(type)} position-relative column-header${columnId === columnDrag?.columnId ? ' is-drag-source' : ''}`}
                                data-title={title}
                                onPointerDown={ev => onColumnPointerDown(ev, columnId)}
                            >
                                {title}
                                <Popover
                                    isOpen={cmpIdxMenuOpen === idx}
                                    onClose={() => setCmpIdxMenuOpen(null)}
                                    className="task-menu"
                                    animation="expand"
                                    trigger={
                                        <button className="btn-icon" title="Item actions" onClick={() => setCmpIdxMenuOpen(idx)}>⋯</button>
                                    }
                                >
                                    <button className="menu-item danger" onClick={() => onRemoveColumn(columnId)}>Delete column</button>
                                </Popover>
                            </th>
                        )
                    })}

                    <th className="cell cell-actions" />

                </tr>
            </thead>

            {/* Tasks can be dropped here from this group or any other (the list id is the group id) */}
            <Droppable droppableId={group.id} type="TASK">
                {provided => (
                    <tbody ref={provided.innerRef} {...provided.droppableProps}>
                        {group.tasks.map((task, idx) => (
                            <TaskPreview
                                key={task.id}
                                task={task}
                                idx={idx}
                                groupId={group.id} />
                        ))}
                        {provided.placeholder}

                        <tr className="task-row add-task-row">
                            {/* The input sits in the sticky Task column; the other columns are one empty cell */}
                            <td className="cell cell-title">
                                <form onSubmit={onAddTask}>
                                    <input
                                        className="add-task-input"
                                        value={newTaskTitle}
                                        placeholder="+ Add item"
                                        onChange={ev => setNewTaskTitle(ev.target.value)}
                                        onBlur={onAddTask}
                                    />
                                </form>
                            </td>
                            <td className="cell cell-filler" colSpan={5} />
                        </tr>
                    </tbody>
                )}
            </Droppable>

            {/* monday's summary row under the group: progress bars under Status and Priority */}
            <tfoot>
                <tr className="task-row summary-row">
                    <td className="cell cell-title" />
                    <td className="cell cell-owner" />

                    {columns.map(column => {
                        const type = column.type
                        return getDynamicClassName(type) && <td className={`cell cell-${getDynamicClassName(type)}`}>
                            <DynamicColumnSummary
                                type={type}
                                tasks={group.tasks}
                                columnId={column.id}
                                priorityOptions={priorityOptions}
                                statusOptions={statusOptions}

                            />
                        </td>
                    })}
                </tr>
            </tfoot>
        </table>
        </>
    )
}

// The dragged column: its header and an empty box per task row, following the mouse (in <body>, above everything)
function ColumnDragCard({ drag }) {
    return createPortal(
        <div className="column-drag-card" style={{ left: drag.left, top: drag.top, width: drag.width }}>
            <div className="column-drag-card-header" style={{ height: drag.headerHeight, lineHeight: `${drag.headerHeight}px` }}>{drag.title}</div>
            {drag.rowHeights.map((height, idx) => <div key={idx} className="column-drag-card-row" style={{ height }} />)}
        </div>,
        document.body
    )
}

function DynamicColumnSummary(props) {
    const cmpMap = {
        'status': <LabelSummary {...props} options={props.statusOptions} />,
        'priority': <LabelSummary {...props} options={props.priorityOptions} />,
        'number': <NumbersSummary {...props} />
    }
    return cmpMap[props.type]
}

function getDynamicClassName(cmp) {
    const cmpFieldMap = {
        'status': 'status',
        'labels': 'status',
        'priority': 'priority',
        'date': 'date',
        'text': 'status',
        'files': 'status',
        'number': 'status'
    }

    return cmpFieldMap[cmp]

}