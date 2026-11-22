import { useEffect, useRef } from 'react'

// Reusable dropdown shell: a trigger + content that opens under it.
// Controlled by the parent (isOpen / onClose). Closes on outside click and on Escape;
// onClose gets the reason ('outside' / 'escape') for parents that treat them differently.
// Used by the header menus and (later) the status / priority / member / date pickers.
//
// <Popover isOpen={isOpen} onClose={() => setIsOpen(false)} trigger={<button onClick={...}>Open</button>}>
//     content
// </Popover>
//
// animation: how it appears - monday picks one per popup (monday-design-values-5.json, Popover.css):
// 'expand' (grows from the top), 'slide' (fades in from 20px higher), 'fade', or none.
// Nothing animates on close, same as monday.
export function Popover({ isOpen, onClose, trigger, children, className = '', animation = '' }) {
    const wrapperRef = useRef(null)

    useEffect(() => {
        if (!isOpen) return

        // The wrapper contains the trigger too, so clicking the trigger is not an "outside" click
        function onDocMouseDown(ev) {
            if (!wrapperRef.current || wrapperRef.current.contains(ev.target)) return
            // A field still being edited inside gets its blur (= save) before the content unmounts
            if (wrapperRef.current.contains(document.activeElement)) document.activeElement.blur()
            onClose('outside')
        }
        function onDocKeyDown(ev) {
            if (ev.key === 'Escape') onClose('escape')
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
                <div className={`popover ${className}${animation ? ` appear-${animation}` : ''}`} role="dialog">
                    {children}
                </div>
            )}
        </div>
    )
}
