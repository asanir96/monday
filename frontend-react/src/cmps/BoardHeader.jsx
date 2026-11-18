import { useState } from 'react'

import { updateBoardOptimistic } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'

// Board header - title row, view tabs, toolbar
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
            <div className="title-row">
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
                    <h1 className="board-title" onClick={onStartEditTitle} title="Click to edit">
                        {board.title}
                    </h1>
                )}

                {/* Temporary text icons - will be replaced with svgs from Svg.jsx */}
                <button
                    className={`btn-star ${board.isStarred ? 'starred' : ''}`}
                    onClick={onToggleStar}
                    aria-label={board.isStarred ? 'Remove from favorites' : 'Add to favorites'}
                    aria-pressed={!!board.isStarred}
                >
                    {board.isStarred ? '★' : '☆'}
                </button>
                {/* members, invite, ... */}
            </div>

            <nav className="view-tabs">
                <button className="active">Main table</button>
            </nav>

            <div className="toolbar">
                {/* New task, Search, Person, Filter, Sort, Hide, Group by */}
            </div>
        </header>
    )
}
