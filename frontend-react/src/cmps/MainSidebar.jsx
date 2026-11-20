
import { useSelector } from 'react-redux';
import { setSidebarView } from '../store/actions/board.actions';
import GridViewIcon from '@mui/icons-material/GridView';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';

export function MainSidebar() {
    const sidebarView = useSelector(storedState => storedState.boardModule.sidebarView)

    function onSwitchBoardGroup(view) {
        setSidebarView(view)
    }

    return <nav className="main-sidebar">
        <button
            className={`main-sidebar-btn ${sidebarView==='workspace' ? 'selected' : ''}`}
            onClick={()=>onSwitchBoardGroup('workspace')}
        >
            <div className='sidebar-icon-container'>
                <GridViewIcon sx={{ fontSize: '1rem', lineHeight: '100%', width: 18, height: 18 }} />
            </div>
            <span className='sidebar-btn-title'>
                Workspace
            </span>
        </button>
        <button
            className={`main-sidebar-btn ${sidebarView==='favorites'  ? 'selected' : ''}`}
            onClick={()=>onSwitchBoardGroup('favorites')}
        >
            <div className='sidebar-icon-container'>
                <StarBorderOutlinedIcon sx={{ fontSize: '1rem', lineHeight: '100%', width: 18, height: 18 }} />
            </div>
            Favorites
        </button>
    </nav>
}