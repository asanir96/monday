import { useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faFileCsv, faFileWord, faX, faFilePdf, faFileImage } from '@fortawesome/free-solid-svg-icons'
import { faFile } from '@fortawesome/free-regular-svg-icons'
import { EmptyCellTrigger } from "./EmptyCellTrigger"
import { Tooltip } from "@mui/material"

export function TaskFile({ value, onChange }) {
    const [filesToEdit, setFilesToEdit] = useState(value || [])
    const inputRef = useRef(null)

    useEffect(() => {
        onChange(filesToEdit)
    }, [filesToEdit])

    function handleChange(ev) {
        const { files } = ev.target
        const selectedFile = { name: files[0].name, type: files[0].type }
        setFilesToEdit(prev => [...prev, selectedFile])
    }

    function onStartEdit() {
            inputRef.current?.click()
    }

    function onStopEditing(ev) {
        if (ev.key && ev.key !== 'Enter') return
        inputRef.current.blur()
        setIsEditing(false)
    }

    function getFileIcons(fileType) {
        switch (fileType) {
            case 'application/pdf':
                return <FontAwesomeIcon style={{ color: 'red' }} className="file-input-icon" icon={faFilePdf} />
            case 'image/png':
                return <FontAwesomeIcon style={{ color: '#8E44AD' }} className="file-input-icon" icon={faFileImage} />
            case 'text/csv':
                return <FontAwesomeIcon style={{ color: '#217346' }} className="file-input-icon" icon={faFileCsv} />
            case 'application/msword':
                return <FontAwesomeIcon style={{ color: '#2B579A' }} className="file-input-icon" icon={faFileWord} />
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return <FontAwesomeIcon style={{ color: '#2B579A' }} className="file-input-icon" icon={faFileWord} />
            default:
                return <FontAwesomeIcon className="file-input-icon" icon={faFile} />
        }
    }

    function onRemoveFile() {
        setFilesToEdit(prev => prev.slice(0, -1))
    }

    return <div className="task-file-input" >
        <input
            autoFocus
            id="task-file"
            ref={inputRef}
            className=" hidden"
            name='description'
            type="file"
            onChange={handleChange}
            onCancel={() => setIsEditing(false)}
            onKeyDown={onStopEditing}
        />
        {filesToEdit && filesToEdit.length > 0 ?
            <div className="task-file-preview position-relative">
                <label htmlFor="task-file" onClick={ev => { if (filesToEdit.length) ev.preventDefault() }}>
                    {filesToEdit[0] &&
                        <Tooltip title={filesToEdit[0].name}>
                            {getFileIcons(filesToEdit[0].type)}
                        </Tooltip>}
                </label>
                <button
                    className="file-remove-btn position-absolute"
                    onClick={onRemoveFile}>
                    <FontAwesomeIcon className="file-remove-icon" icon={faX} />
                </button>
            </div>
            :
            <EmptyCellTrigger
                onStartEdit={onStartEdit}>
                <FontAwesomeIcon icon={faFile} />
                <FontAwesomeIcon icon={faPlus} />
            </EmptyCellTrigger>}
    </div >

}