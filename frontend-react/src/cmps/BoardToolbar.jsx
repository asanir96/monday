import { useState } from 'react'

import { Icon } from './Icon'

// The row under the view tabs: New task, Search, Person, Filter, Sort, Hide, Group by.
// Visual only for now - the functionality comes near the end of the project.
const FILTER_ITEMS = [
    { icon: 'person', title: 'Person' },
    { icon: 'filter', title: 'Filter' },
    { icon: 'sort', title: 'Sort' },
    { icon: 'hide', title: 'Hide' },
    { icon: 'groupBy', title: 'Group by' },
]

export function BoardToolbar() {
    // Focused search grows wider and shows its settings button (monday-design-values-4.json -> boardToolbarSearch)
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    // Focus moving to the settings button stays "inside" the search, so it doesn't collapse
    function onSearchBlur(ev) {
        if (ev.currentTarget.contains(ev.relatedTarget)) return
        setIsSearchFocused(false)
    }

    return (
        <section className="board-toolbar">
            <div className="new-task-group">
                <button className="btn-new-task">New task</button>
                <button className="btn-new-task-menu" title="More options">
                    <span className="glyph glyph-angle-down" aria-hidden="true" />
                </button>
            </div>

            <label
                className={`toolbar-search${isSearchFocused ? ' is-focused' : ''}`}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={onSearchBlur}
            >
                <span className="glyph glyph-search" aria-hidden="true" />
                <input type="search" placeholder={isSearchFocused ? 'Search this board' : 'Search'} aria-label="Search this board" />
                {isSearchFocused && (
                    <span className="search-settings">
                        <button type="button" className="btn-search-settings" title="Search options">
                            <Icon name="searchSettings" section="boardToolbar" />
                        </button>
                    </span>
                )}
            </label>

            {FILTER_ITEMS.map(item => (
                <button key={item.icon} className="btn-toolbar-item">
                    <span className="item-icon">
                        <Icon name={item.icon} section="boardToolbar" />
                    </span>
                    <span className="item-title">{item.title}</span>
                </button>
            ))}

            <button className="btn-toolbar-more" title="More">
                <Icon name="moreHorizontal" section="boardToolbar" />
            </button>

            <button className="btn-collapse-header" title="Collapse header">
                <Icon name="collapseChevronUp" section="boardToolbar" />
            </button>
        </section>
    )
}
