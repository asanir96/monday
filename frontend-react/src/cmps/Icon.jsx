import mondayIcons from '../assets/icons/monday-icons.json'

// monday's own icons (extracted from monday into assets/icons/monday-icons.json).
// Each icon is an SVG string that uses fill="currentColor", so it takes the text color of its parent.
// Size comes from CSS (.icon is 20x20 by default).
// <Icon name="bell" />  -  section defaults to the main header icons
export function Icon({ name, section = 'mainHeader', className = '' }) {
    const svg = mondayIcons[section]?.[name]
    if (typeof svg !== 'string') return null

    // Our own static SVG markup (not user content), so injecting it is safe
    return <span className={`icon ${className}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />
}
