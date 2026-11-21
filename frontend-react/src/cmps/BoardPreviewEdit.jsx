import { useState, useRef,useEffect } from 'react';

export function BoardPreviewEdit({ board, onStartEdit, onStopEdit }) {
    const [boardToEdit, setBoardToEdit] = useState(board)
    const inputRef = useRef(null)
    inputRef.current?.focus()

    useEffect(()=>{
        handleFocus()
    },[])

    function handleFocus() {
        inputRef.current?.focus();
    }

    function handleChange(ev) {
        const { name, value } = ev.target
        setBoardToEdit({ ...boardToEdit, [name]: value })
    }

    return <input
        ref={inputRef}
        name='title'
        type="text"
        value={boardToEdit.title}
        onKeyDown={ev => onStopEdit(boardToEdit, ev)}
        onChange={handleChange}
        onBlur={ev => onStopEdit(boardToEdit, ev)} />
}