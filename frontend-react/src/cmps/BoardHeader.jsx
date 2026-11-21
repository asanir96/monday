import { useState } from 'react'

import { BoardMembers } from './BoardMembers'
import { BoardToolbar } from './BoardToolbar'
import { Icon } from './Icon'
import { updateBoardOptimistic } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'

// Board header - title + actions row, view tabs, toolbar
export function BoardHeader({ board }) {
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [titleDraft, setTitleDraft] = useState('')

    function onStartEditTitle() {
        setTitleDraft(board.title)
        setIsEditingTitle(true)
    }

    async function onSaveTitle() {
        setIsEditingTitle(false)
        const title = titleDraft.trim()
        if (!title || title === board.title) return
        try {
            await updateBoardOptimistic({ ...board, title })
        } catch (err) {
            showErrorMsg('Cannot update board title')
        }
    }

    function onTitleKeyDown(ev) {
        if (ev.key === 'Enter') ev.target.blur() // blur saves
        if (ev.key === 'Escape') setIsEditingTitle(false)
    }

    async function onToggleStar() {
        try {
            await updateBoardOptimistic({ ...board, isStarred: !board.isStarred })
        } catch (err) {
            showErrorMsg('Cannot update board')
        }
    }

    return (
        <header className="board-header">
            <div className="info-row">
                <div className="board-info">
                    {isEditingTitle ? (
                        <input
                            className="board-title-input"
                            type="text"
                            value={titleDraft}
                            autoFocus
                            onChange={ev => setTitleDraft(ev.target.value)}
                            onBlur={onSaveTitle}
                            onKeyDown={onTitleKeyDown}
                        />
                    ) : (
                        <div className="board-title-container" onClick={onStartEditTitle} title="Click to edit">
                            <h1 className="board-title">{board.title}</h1>
                            <Icon name="chevronDown" section="boardHeader" className="title-arrow" />
                        </div>
                    )}

                    {/* monday's board didn't show a star, so there are no extracted values/icon for it yet */}
                    <button
                        className={`btn-board-icon btn-star ${board.isStarred ? 'starred' : ''}`}
                        onClick={onToggleStar}
                        aria-label={board.isStarred ? 'Remove from favorites' : 'Add to favorites'}
                        aria-pressed={!!board.isStarred}
                    >
                        {board.isStarred ? '★' : '☆'}
                    </button>
                </div>

                <div className="header-actions">
                    {/* Not working yet - visual only for now */}
                    <button className="btn-board-text" title="Integrate">
                        <Icon name="integrate" section="boardHeader" />
                        <span className="btn-label">Integrate</span>
                    </button>
                    <button className="btn-board-text" title="Automate">
                        <Icon name="automate" section="boardHeader" />
                        <span className="btn-label">Automate</span>
                    </button>
                    <button className="btn-board-icon btn-discussion" title="Updates">
                        <Icon name="discussionBubble" section="boardHeader" />
                    </button>

                    <BoardMembers board={board} />

                    <button className="btn-board-icon btn-more" title="Options">
                        <Icon name="more" section="boardHeader" />
                    </button>
                </div>
            </div>

            <nav className="view-tabs">
                <ul className="tab-list">
                    <li className="view-tab selected">
                        <span className="tab-name">Main table</span>
                        <span className="glyph glyph-ellipsis tab-menu" aria-hidden="true" />
                    </li>
                    <li>
                        <button className="btn-add-view" title="Add view">
                            <span className="glyph glyph-plus" aria-hidden="true" />
                        </button>
                    </li>
                </ul>
            </nav>

            <BoardToolbar />
        </header>
    )
}
