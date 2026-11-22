import { useState } from 'react'

import { BoardInfo } from './BoardInfo'
import { BoardMembers } from './BoardMembers'
import { BoardToolbar } from './BoardToolbar'
import { Icon } from './Icon'
import { Popover } from './Popover'

// Board header - title + actions row, view tabs, toolbar
export function BoardHeader({ board }) {
    // The title opens the board-info popup (name editing and the favorite star live there, as in monday)
    const [isInfoOpen, setIsInfoOpen] = useState(false)

    return (
        <header className="board-header">
            <div className="info-row">
                <div className="board-info">
                    <Popover
                        isOpen={isInfoOpen}
                        onClose={() => setIsInfoOpen(false)}
                        className="board-info-popover"
                        animation="expand"
                        trigger={
                            <h1 className="board-title-heading">
                                <button
                                    className={`board-title-container${isInfoOpen ? ' is-open' : ''}`}
                                    onClick={() => setIsInfoOpen(isOpen => !isOpen)}
                                    aria-haspopup="dialog"
                                    aria-expanded={isInfoOpen}
                                >
                                    <span className="board-title">{board.title}</span>
                                    <Icon name="chevronDown" section="boardHeader" className="title-arrow" />
                                </button>
                            </h1>
                        }
                    >
                        <BoardInfo board={board} />
                    </Popover>
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
