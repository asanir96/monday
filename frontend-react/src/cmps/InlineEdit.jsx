import { useEffect, useRef, useState } from 'react'

// Text that turns into an input on click.
// Enter / blur saves, Escape cancels. Empty text is not saved (reverts).
export function InlineEdit({ value, onSave, className = '', placeholder = '', style }) {
    const [isEditing, setIsEditing] = useState(false)
    const [txt, setTxt] = useState(value)
    const isCanceledRef = useRef(false)

    useEffect(() => {
        if (!isEditing) setTxt(value)
    }, [value, isEditing])

    function onStartEdit() {
        isCanceledRef.current = false
        setIsEditing(true)
    }

    function onBlur() {
        setIsEditing(false)
        const newTxt = txt.trim()
        if (isCanceledRef.current || !newTxt || newTxt === value) {
            setTxt(value)
            return
        }
        onSave(newTxt)
    }

    function onKeyDown(ev) {
        if (ev.key === 'Enter') ev.target.blur()
        if (ev.key === 'Escape') {
            isCanceledRef.current = true
            ev.target.blur()
        }
    }

    if (isEditing) {
        return (
            <input
                className={`inline-edit editing ${className}`}
                style={style}
                value={txt}
                placeholder={placeholder}
                autoFocus
                onFocus={ev => ev.target.select()}
                onChange={ev => setTxt(ev.target.value)}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
            />
        )
    }

    return (
        <span className={`inline-edit ${className}`} style={style} onClick={onStartEdit} title="Click to edit">
            {value || <span className="placeholder">{placeholder}</span>}
        </span>
    )
}
