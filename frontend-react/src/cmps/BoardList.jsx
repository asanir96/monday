import { useNavigate, useMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BoardListItem } from './BoardListItem';

import Skeleton from '@mui/material/Skeleton';
import GridViewIcon from '@mui/icons-material/GridView';

export function BoardList({ boards }) {
    const sidebarFilterBy = useSelector(storedState => storedState.boardModule.sidebarFilterBy)
    const navigate = useNavigate()
    const isIndex = !!useMatch('/board')   // exact match: true only on /board, not /board/123
    const isAddingBoard = useSelector(storedState => storedState.boardModule.isAddingBoard)

    function navToIndex() {
        navigate(`board`)
    }

    return <ul className="board-list">
        {Object.keys(sidebarFilterBy).length === 0 &&
            <li className={`board-list-item 
            ${isIndex ? 'selected' : ''}`}>
                <div className='board-table-cell preview-title sticky-col aligned-center' onClick={navToIndex}>
                    <GridViewIcon sx={{ fontSize: '1em', lineHeight: '100%' }} />
                    Manage your boards
                </div>
            </li>}
        {boards.map(board => <BoardListItem board={board} />)}
        {isAddingBoard &&
            <li className='add-board-loader'>
                <Skeleton variant="circular" width={14} height={14} />
                <Skeleton variant="text" width={145} sx={{ fontSize: '1rem' }} />
            </li>
        }

    </ul>
}