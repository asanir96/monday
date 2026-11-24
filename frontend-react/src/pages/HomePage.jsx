import { Link } from 'react-router-dom'
import { Icon } from '../cmps/Icon'
import { getStatusOption } from '../services/board'

// The landing page ("/") - what people see before entering the app. Full screen: no app header / sidebars.
// Every "Get started" button leads into the app (/board). "Log in" does nothing yet - there's no real login.

// The small fake board in the hero. Only for show - it uses the real status colors, so it looks like our boards
const PREVIEW_GROUP = { title: 'This week', color: '#579bfc' }
const PREVIEW_TASKS = [
    { title: 'Plan the launch event', owner: 'AH', ownerColor: '#a25ddc', status: 'done', date: 'Nov 24' },
    { title: 'Design the new homepage', owner: 'AN', ownerColor: '#ff642e', status: 'workingOnIt', date: 'Nov 26' },
    { title: 'Write the release notes', owner: 'RS', ownerColor: '#00c875', status: 'stuck', date: 'Nov 28' },
    { title: 'Send the newsletter', owner: 'SA', ownerColor: '#579bfc', status: 'notStarted', date: 'Dec 1' },
]

// The "what you can do" cards - each with its own accent color
const FEATURES = [
    { title: 'Boards for every project', txt: 'Give every project its own board, from a sprint to a marketing campaign.', color: '#579bfc' },
    { title: 'Groups & tasks', txt: 'Split the work into groups, and add, rename or remove tasks in a click.', color: '#00c875' },
    { title: 'Status at a glance', txt: 'Owners, statuses, priorities and due dates show who does what, and what is next.', color: '#fdab3d' },
    { title: 'Built for teams', txt: 'Everyone works on the same board, so the whole team stays in sync.', color: '#a25ddc' },
]

export function HomePage() {
    return (
        <section className="home-page">
            <header className="home-header">
                <Link to="/" className="home-logo">
                    <Icon name="logo_multicolor" className="home-logo-icon" />
                    <span>monday</span>
                    <span className="home-logo-sub">work management</span>
                </Link>

                <nav className="home-nav">
                    {/* No login yet - does nothing for now */}
                    <button type="button" className="home-login">Log in</button>
                    <Link to="/board" className="btn-home btn-home-primary">Get started →</Link>
                </nav>
            </header>

            <section className="home-hero">
                <h1>One place for all<br />your team&apos;s work</h1>
                <p>Plan projects, split them into tasks and follow every status - all on simple, colorful boards.</p>
                <Link to="/board" className="btn-home btn-home-primary btn-home-big">Get started →</Link>
                <span className="home-hero-note">No sign up needed · Demo boards included</span>

                <BoardPreview />
            </section>

            <section className="home-features">
                <h2>Everything your team needs to get work done</h2>
                <div className="home-features-grid">
                    {FEATURES.map(feature => (
                        <article key={feature.title} className="home-feature" style={{ '--feature-color': feature.color }}>
                            <span className="home-feature-dot" />
                            <h3>{feature.title}</h3>
                            <p>{feature.txt}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="home-cta">
                <h2>Ready to get started?</h2>
                <Link to="/board" className="btn-home btn-home-primary btn-home-big">Go to my boards →</Link>
            </section>
        </section>
    )
}

// A static, monday-looking board: a group title and a few rows (task, owner, status, date)
function BoardPreview() {
    return (
        <div className="home-preview" aria-hidden="true">
            <div className="home-preview-top">
                <span /><span /><span />
                <strong>Marketing plan</strong>
            </div>

            <div className="home-preview-board" style={{ '--group-color': PREVIEW_GROUP.color }}>
                <h4>{PREVIEW_GROUP.title}</h4>

                <div className="home-preview-row home-preview-head">
                    <span>Task</span>
                    <span>Owner</span>
                    <span>Status</span>
                    <span>Due date</span>
                </div>

                {PREVIEW_TASKS.map(task => {
                    const status = getStatusOption(task.status)
                    return (
                        <div key={task.title} className="home-preview-row">
                            <span className="home-preview-title">{task.title}</span>
                            <span><span className="home-preview-owner" style={{ backgroundColor: task.ownerColor }}>{task.owner}</span></span>
                            <span className="home-preview-status" style={{ backgroundColor: status.color }}>{status.title}</span>
                            <span>{task.date}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
