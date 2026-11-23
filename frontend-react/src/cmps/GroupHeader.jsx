import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'

import { InlineEdit } from './InlineEdit'

export function GroupHeader({ group, provided, isMenuOpen, setIsMenuOpen, onRemoveGroup, onRenameGroup, taskCount, isGroupExpanded, setIsGroupExpanded }) {
    return <header className="group-header" {...provided.dragHandleProps}>

        <button className='btn-icon' style={{ color: 'inherit' }} onClick={() => setIsGroupExpanded(prev => !prev)}>
            {isGroupExpanded ?
                <FontAwesomeIcon icon={faChevronDown} /> :
                <FontAwesomeIcon icon={faChevronRight} />
            }
        </button>

        <InlineEdit className="group-title" value={group.title} placeholder="Group name" onSave={onRenameGroup} />
        {taskCount && <span className="task-count">{taskCount} {taskCount === 1 ? 'item' : 'items'}</span>}
    </header>
}