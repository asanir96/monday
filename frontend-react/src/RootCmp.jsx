import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router'

import { HomePage } from './pages/HomePage'
// import { AboutUs, AboutTeam, AboutVision } from './pages/AboutUs'
// import { CarIndex } from './pages/CarIndex.jsx'
// import { ReviewIndex } from './pages/ReviewIndex.jsx'
// import { ChatApp } from './pages/Chat.jsx'
// import { AdminIndex } from './pages/AdminIndex.jsx'
import { BoardIndex } from './pages/BoardIndex'
import { BoardDetails } from './pages/BoardDetails'
import { BoardSidebar } from './cmps/BoardSidebar'
// import { CarDetails } from './pages/CarDetails'
// import { UserDetails } from './pages/UserDetails'
import { MainSidebar } from './cmps/MainSidebar.jsx'
import { AppHeader } from './cmps/AppHeader'
// import { SideBar } from './cmps/SideBar'
// import { AppFooter } from './cmps/AppFooter'
import { UserMsg } from './cmps/UserMsg.jsx'
// import { LoginSignup, Login, Signup } from './pages/LoginSignup.jsx'


export function RootCmp() {
    return (
        <>
            <UserMsg />

            <Routes>
                {/* The home page (landing page) - full screen, outside the app's header and sidebars */}
                <Route path="/" element={<HomePage />} />

                {/* The app pages: they share the header + sidebars (AppLayout), and render in its <Outlet />.
                    A layout route has no path of its own - it only wraps its children */}
                <Route element={<AppLayout />}>
                    <Route path="board" element={<BoardIndex />} />
                    <Route path="board/:boardId" element={<BoardDetails />} />
                    {/* <Route path="about" element={<AboutUs />}>
                        <Route path="team" element={<AboutTeam />} />
                        <Route path="vision" element={<AboutVision />} />
                    </Route> */}
                    {/* <Route path="car/:carId" element={<CarDetails />} /> */}
                    {/* <Route path="user/:id" element={<UserDetails />} /> */}
                    {/* <Route path="review" element={<ReviewIndex />} /> */}
                    {/* <Route path="chat" element={<ChatApp />} /> */}
                    {/* <Route path="admin" element={<AdminIndex />} /> */}
                    {/* <Route path="auth" element={<LoginSignup />}>
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route> */}
                </Route>

                {/* Any other url -> the home page ("/") */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    )
}

// The app's shell: header, sidebars and the main panel. The matched page renders in <Outlet />
function AppLayout() {
    // Small screens only: the left pane is a drawer (on desktop it's always shown and this is ignored)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const location = useLocation()

    // Picking a board (or any navigation) closes the drawer
    useEffect(() => {
        setIsSidebarOpen(false)
    }, [location.pathname])

    return (
        <div className={`app-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <AppHeader onToggleSidebar={() => setIsSidebarOpen(isOpen => !isOpen)} />
            <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
            <aside className='left-pane left-pane-layout'>
                <MainSidebar/>
                <BoardSidebar />
            </aside>
            {/* <SideBar /> */}

            <main className="app-main">
                <Outlet />
            </main>
            {/* <AppFooter /> */}
        </div>
    )
}
