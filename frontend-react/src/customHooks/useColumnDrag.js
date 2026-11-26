import { useState } from 'react'

// Pixels the mouse must move before a press on a header becomes a drag (less = a click, so the ⋯ menu still works)
const DRAG_THRESHOLD = 5

// Dragging a whole table column, like monday: a card with the column (its header and rows) follows the mouse
// along the row, and on release the column moves there. Escape cancels.
// The drag and drop library moves list items only - a table column isn't one element, so this is our own.
//
// const { drag, onColumnPointerDown } = useColumnDrag(shownColumns, (columnId, toColumnId) => moveColumn(...))
// <th onPointerDown={ev => onColumnPointerDown(ev, column.id)}>  - and render the card from `drag` (ColumnDragCard)
//
// drag: null, or { columnId, title, left, top, width, headerHeight, rowHeights, targetIdx } while dragging
export function useColumnDrag(shownColumns, onMoveColumn) {
    const [drag, setDrag] = useState(null)

    function onColumnPointerDown(ev, columnId) {
        if (ev.button !== 0 || ev.target.closest('button, .popover')) return
        const headerEl = ev.currentTarget
        const startX = ev.clientX
        const startY = ev.clientY
        let dragStart = null // set once the mouse moved far enough: the column's geometry when the drag began
        let lastX = startX

        function onPointerMove(moveEv) {
            lastX = moveEv.clientX
            if (!dragStart) {
                if (Math.hypot(moveEv.clientX - startX, moveEv.clientY - startY) < DRAG_THRESHOLD) return
                dragStart = _getColumnGeometry(headerEl, startX)
                document.body.classList.add('is-dragging-column')
            }
            const targetIdx = _getTargetIdx(headerEl, moveEv.clientX)
            setDrag({ columnId, ...dragStart, left: moveEv.clientX - dragStart.grabOffsetX, targetIdx })
        }

        function onPointerUp() {
            stop()
            if (!dragStart) return // it was a click
            const fromIdx = shownColumns.findIndex(column => column.id === columnId)
            const targetIdx = _getTargetIdx(headerEl, lastX)
            if (targetIdx !== fromIdx) onMoveColumn(columnId, shownColumns[targetIdx].id)
        }

        function onKeyDown(keyEv) {
            if (keyEv.key === 'Escape') stop()
        }

        function stop() {
            document.removeEventListener('pointermove', onPointerMove)
            document.removeEventListener('pointerup', onPointerUp)
            document.removeEventListener('keydown', onKeyDown)
            document.body.classList.remove('is-dragging-column')
            setDrag(null)
        }

        document.addEventListener('pointermove', onPointerMove)
        document.addEventListener('pointerup', onPointerUp)
        document.addEventListener('keydown', onKeyDown)
    }

    return { drag, onColumnPointerDown }
}

// Where the column is, and the sizes the card copies: the header and each task row's height
function _getColumnGeometry(headerEl, grabX) {
    const rect = headerEl.getBoundingClientRect()
    const tableEl = headerEl.closest('table')
    const rowHeights = [...tableEl.querySelectorAll('tbody .task-preview')].map(rowEl => rowEl.getBoundingClientRect().height)
    return {
        title: headerEl.dataset.title,
        top: rect.top,
        width: rect.width,
        headerHeight: rect.height,
        rowHeights,
        grabOffsetX: grabX - rect.left,
    }
}

// The column's new place (in the shown columns' order): how many of the other headers' middles are left of the mouse
function _getTargetIdx(headerEl, x) {
    const otherHeaders = [...headerEl.parentElement.querySelectorAll('.column-header')].filter(el => el !== headerEl)
    return otherHeaders.filter(el => {
        const rect = el.getBoundingClientRect()
        return rect.left + rect.width / 2 < x
    }).length
}
