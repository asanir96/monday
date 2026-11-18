import { useEffect, useRef } from 'react'

// Reusable dropdown shell: a trigger + content that opens under it.
// Controlled by the parent (isOpen / onClose). Closes on outside click and on Escape.
// Used by the header menus and (later) the status / priority / member / date pickers.
//
// <Popover isOpen={isOpen} onClose={() => setIsOpen(false)} trigger={<button onClick={...}>Open</button>}>
//     content
// </Popover>
export function Popover({ isOpen, onClose, trigger, children, className = '' }) {
    const wrapperRef = useRef(null)

    useEffect(() => {
        if (!isOpen) return

        // The wrapper contains the trigger too, so clicking the trigger is not an "outside" click
        function onDocMouseDown(ev) {
            if (wrapperRef.current && !wrapperRef.current.contains(ev.target)) onClose()
        }
        function onDocKeyDown(ev) {
            if (ev.key === 'Escape') onClose()
        }

        document.addEventListener('mousedown', onDocMouseDown)
        document.addEventListener('keydown', onDocKeyDown)
        return () => {
            document.removeEventListener('mousedown', onDocMouseDown)
            document.removeEventListener('keydown', onDocKeyDown)
        }
    }, [isOpen, onClose])

    return (
        <div className="popover-wrapper" ref={wrapperRef}>
            {trigger}
            {isOpen && (
                <div className={`popover ${className}`} role="dialog">
                    {children}
                </div>
            )}
        </div>
    )
}
