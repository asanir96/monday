import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from '@mui/material'
import { InlineEdit } from './InlineEdit'

export function GroupHeader({ group, provided, isMenuOpen, setIsMenuOpen, onRemoveGroup, onRenameGroup, taskCount, isGroupExpanded, setIsGroupExpanded }) {
    console.log('taskCount', taskCount)
    return <header className="group-header" {...provided.dragHandleProps}>
        < Tooltip title={`${isGroupExpanded?'Collapse Group':'Expand Group'}`}>
            <button className='btn-icon' style={{ color: 'inherit' }} onClick={() => setIsGroupExpanded(prev => !prev)}>
                {isGroupExpanded ?
                    <FontAwesomeIcon icon={faChevronDown} /> :
                    <FontAwesomeIcon icon={faChevronRight} />
                }
            </button>
        </Tooltip>

        <InlineEdit className="group-title" value={group.title} placeholder="Group name" onSave={onRenameGroup} />
        <span className="task-count">{taskCount} {taskCount === 1 ? 'item' : 'items'}</span>
    </header>
}