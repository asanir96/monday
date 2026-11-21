import { useState } from 'react'

import { Popover } from './Popover'
import { Icon } from './Icon'
import { updateBoardOptimistic } from '../store/actions/board.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { makeId, getInitials } from '../services/util.service'

const MAX_SHOWN = 3

// Members avatars + Invite / copy link buttons of the board header
export function BoardMembers({ board }) {
    const [openPopover, setOpenPopover] = useState(null) // null | 'members' | 'invite'
    const [name, setName] = useState('')

    const members = board.members || []
    const shownMembers = members.slice(0, MAX_SHOWN)
    const hiddenCount = members.length - shownMembers.length

    function togglePopover(popoverName) {
        setOpenPopover(prev => (prev === popoverName ? null : popoverName))
    }

    function closePopover() {
        setOpenPopover(null)
    }

    async function onInvite(ev) {
        ev.preventDefault()
        const fullname = name.trim()
        if (!fullname) return
        if (members.some(member => member.fullname.toLowerCase() === fullname.toLowerCase())) {
            showErrorMsg(`${fullname} is already a member`)
            return
        }

        // No users service yet - a new member is just a mini-user {_id, fullname, imgUrl}
        const member = { _id: makeId(), fullname, imgUrl: '' }
        setName('')
        try {
            await updateBoardOptimistic({ ...board, members: [...members, member] })
        } catch (err) {
            showErrorMsg('Cannot invite member')
        }
    }

    async function onCopyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href)
            showSuccessMsg('Board link copied')
        } catch (err) {
            showErrorMsg('Cannot copy the link')
        }
    }

    return (
        <div className="board-members">
            <Popover
                isOpen={openPopover === 'members'}
                onClose={closePopover}
                className="members-popover"
                trigger={
                    <button
                        className="btn-members"
                        onClick={() => togglePopover('members')}
                        aria-label="Board members"
                        aria-expanded={openPopover === 'members'}
                    >
                        {shownMembers.map(member => (
                            <MemberAvatar key={member._id} member={member} />
                        ))}
                        {hiddenCount > 0 && <span className="members-more">+{hiddenCount}</span>}
                    </button>
                }
            >
                <MemberList members={members} />
            </Popover>

            <div className="invite-group">
                <Popover
                    isOpen={openPopover === 'invite'}
                    onClose={closePopover}
                    className="invite-popover"
                    trigger={
                        <button
                            className="btn-invite"
                            onClick={() => togglePopover('invite')}
                            aria-expanded={openPopover === 'invite'}
                        >
                            Invite / {members.length}
                        </button>
                    }
                >
                    <form className="invite-form" onSubmit={onInvite}>
                        <input
                            type="text"
                            value={name}
                            placeholder="Enter a name"
                            aria-label="Name of the member to invite"
                            autoFocus
                            onChange={ev => setName(ev.target.value)}
                        />
                        <button type="submit" disabled={!name.trim()}>Invite</button>
                    </form>
                    <MemberList members={members} />
                </Popover>

                <button className="btn-copy-link" title="Copy board link" onClick={onCopyLink}>
                    <Icon name="copyLink" section="boardHeader" />
                </button>
            </div>
        </div>
    )
}

function MemberList({ members }) {
    return (
        <ul className="member-list">
            {members.map(member => (
                <li key={member._id}>
                    <MemberAvatar member={member} />
                    <span>{member.fullname}</span>
                </li>
            ))}
        </ul>
    )
}

function MemberAvatar({ member }) {
    if (member.imgUrl) {
        return <img className="member-avatar" src={member.imgUrl} alt={member.fullname} title={member.fullname} />
    }
    return <span className="member-avatar initials" title={member.fullname}>{getInitials(member.fullname)}</span>
}
