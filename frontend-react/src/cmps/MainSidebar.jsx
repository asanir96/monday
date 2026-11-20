
import { useSelector } from 'react-redux';
import { setSidebarFilterBy } from '../store/actions/board.actions';
import GridViewIcon from '@mui/icons-material/GridView';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
export function MainSidebar() {
    const sidebarFilterBy = useSelector(storedState => storedState.boardModule.sidebarFilterBy)
    const isStarred = sidebarFilterBy?.isStarred

    function onSwitchBoardGroup(boardGroup) {
        let filterBy
        if (boardGroup === 'isStarred') filterBy = { isStarred: true }
        else filterBy = {}

        setSidebarFilterBy(filterBy)
    }

    return <nav className="main-sidebar">
        <button
            className={`main-sidebar-btn ${isStarred ? '' : 'selected'}`}
            name='isStarred'
            value={false}
            onClick={onSwitchBoardGroup}

        >
            <div className='sidebar-icon-container'>
                <GridViewIcon sx={{ fontSize: '1rem', lineHeight: '100%', width: 18, height: 18 }} />
            </div>
            <span className='sidebar-btn-title'>
                Worskpace
            </span>
        </button>
        <button
            className={`main-sidebar-btn ${isStarred ? 'selected' : ''}`}
            name='isStarred'
            value={true}
            onClick={() => onSwitchBoardGroup('isStarred')}
        >
            <div className='sidebar-icon-container'>
                <StarBorderOutlinedIcon sx={{ fontSize: '1rem', lineHeight: '100%', width: 18, height: 18 }} />
            </div>
            Favorites
        </button>
    </nav>
}