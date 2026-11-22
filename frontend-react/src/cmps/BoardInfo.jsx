import { useState } from 'react'

import { updateBoardOptimistic } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { getInitials } from '../services/util.service'
import { Icon } from './Icon'
import { InlineEdit } from './InlineEdit'

// The board-info popup that opens from the board title (monday-design-values-3.json -> boardInfoPopup):
// editable name + favorite star, description, then the board's info rows.
export function BoardInfo({ board }) {
    const creator = board.createdBy
    // 'star' / 'unstar' while the star's click animation runs (BoardInfo.css), '' otherwise
    const [starAnimation, setStarAnimation] = useState('')

    async function onUpdateBoardField(field, value) {
        try {
            await updateBoardOptimistic({ ...board, [field]: value })
        } catch (err) {
            showErrorMsg('Cannot update board')
        }
    }

    function onToggleStar() {
        setStarAnimation(board.isStarred ? 'unstar' : 'star')
        onUpdateBoardField('isStarred', !board.isStarred)
    }

    return (
        <section className="board-info-dialog">
            <header className="info-header">
                <InlineEdit
                    className="info-title"
                    value={board.title}
                    placeholder="Board name"
                    onSave={title => onUpdateBoardField('title', title)}
                />

                <button
                    className={`btn-star${board.isStarred ? ' starred' : ''}${starAnimation ? ` animate-${starAnimation}` : ''}`}
                    onClick={onToggleStar}
                    onAnimationEnd={() => setStarAnimation('')}
                    aria-label={board.isStarred ? 'Remove from favorites' : 'Add to favorites'}
                    aria-pressed={!!board.isStarred}
                >
                    <Icon name={board.isStarred ? 'starFull' : 'starOutline'} section="boardInfo" />
                </button>
            </header>

            {board.description && <p className="info-description">{board.description}</p>}

            <hr className="info-divider" />

            <h4 className="info-heading">Board info</h4>

            {/* Not working yet - visual only for now */}
            <ul className="info-rows">
                <li className="info-item">
                    <span className="row-label">Board type</span>
                    <span className="row-value board-type">
                        <Icon name="boardTypeMain" section="boardInfo" className="row-icon" />
                        Main
                        <Icon name="chevronDown" section="boardInfo" className="row-icon row-chevron" />
                    </span>
                </li>

                {creator && (
                    <li className="info-item">
                        <span className="row-label">Owner</span>
                        <button className="row-value">
                            <MemberAvatar member={creator} className="owner-avatar" />
                            {creator.fullname}
                        </button>
                    </li>
                )}

                {creator && (
                    <li className="info-item">
                        <span className="row-label">Created by</span>
                        <button className="row-value">
                            <MemberAvatar member={creator} className="creator-avatar" />
                            {creator.fullname}
                        </button>
                    </li>
                )}

                <li className="info-item">
                    <span className="row-label">Notifications</span>
                    <button className="row-value">
                        <Icon name="notificationsBell" section="boardInfo" className="row-icon" />
                        Everything
                    </button>
                </li>
            </ul>
        </section>
    )
}

function MemberAvatar({ member, className }) {
    if (member.imgUrl) return <img className={`info-avatar ${className}`} src={member.imgUrl} alt={member.fullname} />
    return <span className={`info-avatar ${className}`}>{getInitials(member.fullname)}</span>
}
