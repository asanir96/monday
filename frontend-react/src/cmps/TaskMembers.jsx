import { getInitials } from '../services/util.service'

const MAX_AVATARS = 2

// The people cell (a 'members' column - monday's Owner): the task's people as avatars, "?" when there are none.
// value: the task's member ids, members: the board's people. Display-only for now (the picker comes later)
// <TaskMembers value={task.values[columnId]} members={board.members} />
export function TaskMembers({ value = [], members = [] }) {
    const owners = members.filter(member => value.includes(member._id))

    return (
        <>
            {!owners.length && <span className="avatar avatar-placeholder" title="No owner">?</span>}
            {owners.slice(0, MAX_AVATARS).map(member => (
                member.imgUrl
                    ? <img key={member._id} className="avatar" src={member.imgUrl} alt={member.fullname} title={member.fullname} />
                    : <span key={member._id} className="avatar avatar-placeholder" title={member.fullname}>{getInitials(member.fullname)}</span>
            ))}
            {owners.length > MAX_AVATARS && <span className="avatar avatar-more">+{owners.length - MAX_AVATARS}</span>}
        </>
    )
}
