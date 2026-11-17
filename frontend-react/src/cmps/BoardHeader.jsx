// Board header - title row, view tabs, toolbar
export function BoardHeader({ board }) {
    return (
        <header className="board-header">
            <div className="title-row">
                <h1 className="board-title">{board.title}</h1>
                {/* star, members, invite, ... */}
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
