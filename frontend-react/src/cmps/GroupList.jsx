import { GroupPreview } from './GroupPreview'

// TODO: render board.groups (static group for now)
const groups = [
    {
        id: 'g101',
        title: 'New Group',
        style: {},
        tasks: [
            { id: 'c101', title: 'Item 1', memberIds: [], status: '' },
            { id: 'c102', title: 'Item 2', memberIds: [], status: '' },
            { id: 'c103', title: 'Item 3', memberIds: [], status: '' },
        ],
    },
]

export function GroupList({ board }) {
    return (
        <section className="group-list">
            {groups.map(group => (
                <GroupPreview key={group.id} group={group} />
            ))}
        </section>
    )
}
