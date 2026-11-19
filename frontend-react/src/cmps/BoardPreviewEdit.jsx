import { useState } from 'react';

export function BoardPreviewEdit({ board, onStartEdit, onStopEdit }) {
    const [boardToEdit, setBoardToEdit] = useState(board)

    function handleChange(ev) {
        const { name, value } = ev.target
        setBoardToEdit({ ...boardToEdit, [name]: value })
    }

    return <input
        name='title'
        type="text"
        value={boardToEdit.title}
        onChange={handleChange}
        onBlur={() => onStopEdit(boardToEdit)} />
}