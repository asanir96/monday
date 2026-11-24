import { NavLink } from 'react-router-dom'
import { Icon } from './Icon'
// import { Link } from 'react-router-dom'
// import { useNavigate } from 'react-router'
// import { useSelector } from 'react-redux'
// import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
// import { logout } from '../store/actions/user.actions'

// Main header - shown on every app page (board index + board details)
export function AppHeader({ onToggleSidebar }) {
    // Re-enable once userModule is back in the store (store.js)
    // const user = useSelector(storeState => storeState.userModule.user)
    // const navigate = useNavigate()

    // async function onLogout() {
    //     try {
    //         await logout()
    //         navigate('/')
    //         showSuccessMsg(`Bye now`)
    //     } catch (err) {
    //         showErrorMsg('Cannot logout')
    //     }
    // }

    return (
        <header className="app-header">
            <section className="header-start">
                {/* Small screens only (hidden on desktop): opens the left pane as a drawer.
                    Our own icon - monday's desktop site has no menu button */}
                <button className="btn-sidebar-toggle" title="Menu" aria-label="Open menu" onClick={onToggleSidebar}>
                    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <rect x="3" y="5" width="14" height="1.5" rx=".75" />
                        <rect x="3" y="9.25" width="14" height="1.5" rx=".75" />
                        <rect x="3" y="13.5" width="14" height="1.5" rx=".75" />
                    </svg>
                </button>

                {/* The logo takes you back to the home page (like monday's) */}
                <NavLink to="/" end className="logo" title="Home">
                    <Icon name="logo_multicolor" className="logo-icon" />
                </NavLink>

                <button className="btn-see-plans optional">
                    <Icon name="seePlansDiamond" />
                    See plans
                </button>
            </section>

            <label className="header-search">
                <Icon name="search" className="search-icon" />
                <input type="search" placeholder="Search for anything..." />
                <span className="search-shortcut">Ctrl K</span>
            </label>

            <nav className="actions">
                {/* Not working yet - visual only for now. "optional" ones are hidden on phones */}
                <button className="btn-header-icon" title="Notifications"><Icon name="bell" /></button>
                <button className="btn-header-icon optional" title="Inbox"><Icon name="inbox" /></button>
                <button className="btn-header-icon optional" title="Invite members"><Icon name="invite" /></button>
                <button className="btn-header-icon optional" title="Apps"><Icon name="apps" /></button>
                <button className="btn-header-icon optional" title="Help"><Icon name="help" /></button>
                <span className="divider optional" />
                <button className="btn-header-icon optional" title="Products"><Icon name="productSwitcherGrid" /></button>

                {/* {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>} */}

                {/* {!user && <NavLink to="auth/login" className="login-link">Login</NavLink>}
                {user && (
                    <div className="user-info">
                        <Link to={`user/${user._id}`}>
                            {user.imgUrl && <img src={user.imgUrl} />}
                            {user.fullname}
                        </Link>
                        <button onClick={onLogout}>logout</button>
                    </div>
                )} */}
                {/* No logged-in user yet (userModule is commented out) */}
                <div className="user-avatar" title="Guest">G</div>
            </nav>
        </header>
    )
}
