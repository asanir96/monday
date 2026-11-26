import { useState, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faT, faPlus } from '@fortawesome/free-solid-svg-icons'
import { EmptyCellTrigger } from "./EmptyCellTrigger"
import NumbersIcon from '@mui/icons-material/Numbers';

export function NumberPicker({ value, onChange }) {
    const [numToEdit, setNumToEdit] = useState(value || '')
    const [isEditing, setIsEditing] = useState(false)
    const inputRef = useRef(null)

    function handleChange(ev) {
        const { value } = ev.target
        setNumToEdit(value)
    }

    function onStartEdit() {
        setIsEditing(true)
    }

    function onStopEditing(ev) {
        if (ev.key && ev.key !== 'Enter') return
        inputRef.current.blur()
        setIsEditing(false)
        onChange(numToEdit)
    }

    if (!numToEdit && !isEditing) return (
        <EmptyCellTrigger
            onStartEdit={onStartEdit}>
            <NumbersIcon />
            <FontAwesomeIcon icon={faPlus} />
        </EmptyCellTrigger>)

    return <input
        autoFocus={isEditing}
        ref={inputRef}
        className="task-text"
        name='description'
        type="number"
        value={numToEdit}
        onFocus={onStartEdit}
        onChange={handleChange}
        onBlur={onStopEditing}
        onKeyDown={onStopEditing}
    />
}