import { TaskList } from './TaskList'

export function GroupPreview({ group }) {
    return (
        <section className="group-preview">
            <header className="group-header">
                <h3 className="group-title">{group.title}</h3>
            </header>

            <TaskList group={group} />
        </section>
    )
}
