export function EmptyCellTrigger({onStartEdit,children}) {
    
    return <div
        className="empty-cell-trigger"
        onClick={onStartEdit}>
            {children}
    </div>
}