import { moveGroup, moveTask } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'

// The board's drag and drop: returns the onDragEnd for the board's <DragDropContext>.
// Each <Droppable> has a type, and a drop is sent to the action for that type.
// Something new to drag (columns...): give its Droppable a new type and add a case here.
//
// const { onDragEnd } = useBoardDnd()
// <DragDropContext onDragEnd={onDragEnd}> ... </DragDropContext>
export function useBoardDnd() {
    async function onDragEnd({ type, source, destination }) {
        if (!destination) return // dropped outside a list
        if (source.droppableId === destination.droppableId && source.index === destination.index) return

        try {
            switch (type) {
                case 'GROUP':
                    await moveGroup(source.index, destination.index)
                    break
                case 'TASK': // a task list's droppableId is its group's id
                    await moveTask(
                        { groupId: source.droppableId, idx: source.index },
                        { groupId: destination.droppableId, idx: destination.index }
                    )
                    break
            }
        } catch (err) {
            showErrorMsg('Cannot move it there')
        }
    }

    return { onDragEnd }
}
