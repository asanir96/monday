import { DragDropContext, Droppable } from '@hello-pangea/dnd'

import { addGroup } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { useBoardDnd } from '../customHooks/useBoardDnd'
import { GroupPreview } from './GroupPreview'

export function GroupList({ board }) {
    const groups = board.groups || []
    const { onDragEnd } = useBoardDnd()

    async function onAddGroup() {
        try {
            await addGroup()
        } catch (err) {
            showErrorMsg('Cannot add group')
        }
    }

    return (
        <section className="group-list full">
            {/* One drag context for the whole board: groups move in the list, tasks move inside or between groups */}
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="groups" type="GROUP">
                    {provided => (
                        <div className="group-list-groups full" ref={provided.innerRef} {...provided.droppableProps}>
                            {groups.map((group, idx) => (
                                <GroupPreview key={group.id} group={group} idx={idx}  />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {!groups.length && <p className="no-groups-msg">This board has no groups yet.</p>}

            <button className="btn-add-group" onClick={onAddGroup}>+ Add new group</button>
        </section>
    )
}
