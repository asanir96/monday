
import { useSelector } from 'react-redux';
import { setSidebarView } from '../store/actions/board.actions';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Tooltip } from '@mui/material';
import { Icon } from './Icon';

export function MainSidebar({ isSidebarOpen, setIsSidebarOpen }) {
    const sidebarView = useSelector(storedState => storedState.boardModule.sidebarView)
    console.log('isSidebarOpen', isSidebarOpen)
    function onSwitchBoardGroup(view) {
        setSidebarView(view)
    }

    return <nav className="main-sidebar">
        <Tooltip title='Open workspace menu'>
            <button className={`btn-icon expand-siderbar-btn ${isSidebarOpen ? 'collapsed' : 'expanded'}`} onClick={() => setIsSidebarOpen(true)}>
                <KeyboardDoubleArrowRightIcon className='icon' />
            </button>
        </Tooltip>


        <button
            className={`main-sidebar-btn ${sidebarView === 'workspace' ? 'selected' : ''}`}
            onClick={() => onSwitchBoardGroup('workspace')}
        >
            <div className='sidebar-icon-container'>
                <Icon name="workspace" section="mainSidebar" />
            </div>
            <span className='sidebar-btn-title'>
                Workspace
            </span>
        </button>
        <button
            className={`main-sidebar-btn ${sidebarView === 'favorites' ? 'selected' : ''}`}
            onClick={() => onSwitchBoardGroup('favorites')}
        >
            <div className='sidebar-icon-container'>
                <Icon name="favorites" section="mainSidebar" />

            </div>
            <span className='sidebar-btn-title'>
                Favorites
            </span>
        </button>
    </nav>
}