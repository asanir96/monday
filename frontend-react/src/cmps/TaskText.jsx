import { useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faT, faPlus } from '@fortawesome/free-solid-svg-icons'
import { EmptyCellTrigger } from "./EmptyCellTrigger"

export function TaskText({ task, onUpdateTask }) {
    const [taskToEdit, setTaskToEdit] = useState(task)
    const [isEditing, setIsEditing] = useState(false)
    const inputRef = useRef(null)

    function handleChange(ev) {
        const { name, value } = ev.target
        setTaskToEdit({ ...taskToEdit, [name]: value })
    }

    function onStartEdit() {
        setIsEditing(true)
        if (!taskToEdit.description) {
            setTaskToEdit({ ...taskToEdit, description: '' })
        }
    }

    function onStopEditing(ev) {
        if (ev.key && ev.key !== 'Enter') return
        inputRef.current.blur()
        setIsEditing(false)
        onUpdateTask(taskToEdit, ev)
    }

    if (!taskToEdit.description && !isEditing) return (
        <EmptyCellTrigger
            onStartEdit={onStartEdit}>
            <FontAwesomeIcon icon={faT} />
            <FontAwesomeIcon icon={faPlus} />
        </EmptyCellTrigger>)

    return <input
        autoFocus={isEditing}
        ref={inputRef}
        className="task-text"
        name='description'
        type="text"
        value={taskToEdit.description || ''}
        onFocus={onStartEdit}
        onChange={handleChange}
        onBlur={onStopEditing}
        onKeyDown={onStopEditing}
    />
}