import { useNavigate, useMatch,NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BoardListItem } from './BoardListItem';

import Skeleton from '@mui/material/Skeleton';
import GridViewIcon from '@mui/icons-material/GridView';

export function BoardList({ boards }) {
    const isAddingBoard = useSelector(storedState => storedState.boardModule.isAddingBoard)


    return <ul className="board-list">
        {boards && boards.map(board => <BoardListItem board={board} />)}
        {isAddingBoard &&
            <li className='add-board-loader'>
                <Skeleton variant="circular" width={14} height={14} />
                <Skeleton variant="text" width={145} sx={{ fontSize: '1rem' }} />
            </li>
        }

    </ul>
}