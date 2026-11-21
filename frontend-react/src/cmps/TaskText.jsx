import { useState, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faT, faPlus } from '@fortawesome/free-solid-svg-icons'
import { EmptyCellTrigger } from "./EmptyCellTrigger"

export function TaskText({ value, onChange }) {
    const [txtToEdit, setTxtToEdit] = useState(value || '')
    const [isEditing, setIsEditing] = useState(false)
    const inputRef = useRef(null)

    function handleChange(ev) {
        const { value } = ev.target
        setTxtToEdit(value)
    }

    function onStartEdit() {
        setIsEditing(true)
    }

    function onStopEditing(ev) {
        if (ev.key && ev.key !== 'Enter') return
        inputRef.current.blur()
        setIsEditing(false)
        onChange(txtToEdit)
    }

    if (!txtToEdit && !isEditing) return (
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
        value={txtToEdit}
        onFocus={onStartEdit}
        onChange={handleChange}
        onBlur={onStopEditing}
        onKeyDown={onStopEditing}
    />
}