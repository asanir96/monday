import { addGroup } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { GroupPreview } from './GroupPreview'

export function GroupList({ board }) {
    const groups = board.groups || []

    async function onAddGroup() {
        try {
            await addGroup()
        } catch (err) {
            showErrorMsg('Cannot add group')
        }
    }

    return (
        <section className="group-list">
            {groups.map(group => (
                <GroupPreview key={group.id} group={group} members={board.members || []} />
            ))}

            {!groups.length && <p className="no-groups-msg">This board has no groups yet.</p>}

            <button className="btn-add-group" onClick={onAddGroup}>+ Add new group</button>
        </section>
    )
}
