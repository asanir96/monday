import { NavLink } from 'react-router-dom'
// import { Link } from 'react-router-dom'
// import { useNavigate } from 'react-router'
// import { useSelector } from 'react-redux'
// import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
// import { logout } from '../store/actions/user.actions'

// Main header - shown on every app page (board index + board details)
export function AppHeader() {
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
            <NavLink to="/board" className="logo">
                monday
            </NavLink>

            <div className="search">
                <input type="search" placeholder="Search for anything..." />
            </div>

            <nav className="actions">
                {/* notifications, inbox, invite, apps, help... */}

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
                <div className="user-avatar">Placeholder</div>
            </nav>
        </header>
    )
}
