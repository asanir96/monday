import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-regular-svg-icons'

import { faCircleUser, faPen } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux';

export function BoardActions({ board, onRemoveBoard, onStartEdit }) {

    return <div className='board-actions'>
        <div className="actions-update">
            <button className="board-action" onClick={onStartEdit} >
                <FontAwesomeIcon icon={faPen} />
                Rename
            </button>
            <button className="board-action">
                <FontAwesomeIcon icon={faCopy} />
                Duplicate
            </button>
        </div>

        <Divider />
        <div className="actions-remove">
            <button className="board-action" onClick={() => onRemoveBoard(board._id)}>
                <DeleteOutlinedIcon />
                Delete
            </button>
            <button className="board-action">
                <DeleteOutlinedIcon />
                Archive
            </button>
        </div>
    </div>
}