import { Link } from 'react-router-dom'

// Placeholder - owned by Arad (board list + board CRUDL)
export function BoardIndex() {
    return (
        <section className="board-index">
            <h1>Boards</h1>
            <Link to="/board/b101">Product Development (b101)</Link>
        </section>
    )
}
