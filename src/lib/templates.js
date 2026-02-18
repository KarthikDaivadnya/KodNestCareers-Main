export const TEMPLATE_KEY = 'resumeBuilderTemplate'
export const COLOR_KEY    = 'resumeBuilderColor'

export const TEMPLATES = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern',  label: 'Modern'  },
  { id: 'minimal', label: 'Minimal' },
]

export const COLORS = [
  { id: 'teal',     label: 'Teal',     value: 'hsl(168, 60%, 40%)' },
  { id: 'navy',     label: 'Navy',     value: 'hsl(220, 60%, 35%)' },
  { id: 'burgundy', label: 'Burgundy', value: 'hsl(345, 60%, 35%)' },
  { id: 'forest',   label: 'Forest',   value: 'hsl(150, 50%, 30%)' },
  { id: 'charcoal', label: 'Charcoal', value: 'hsl(0, 0%, 25%)'    },
]

export function loadTemplate() {
  const stored = localStorage.getItem(TEMPLATE_KEY)
  return TEMPLATES.find(t => t.id === stored)?.id ?? 'classic'
}
export function saveTemplate(id) { localStorage.setItem(TEMPLATE_KEY, id) }

export function loadColor() {
  const stored = localStorage.getItem(COLOR_KEY)
  return COLORS.find(c => c.id === stored)?.id ?? 'teal'
}
export function saveColor(id) { localStorage.setItem(COLOR_KEY, id) }
export function getColorValue(id) { return COLORS.find(c => c.id === id)?.value ?? COLORS[0].value }

/* Legacy style map kept for Builder's mini preview (still used) */
export const TEMPLATE_STYLES = {
  classic: {
    fontFamily:   "'Georgia', 'Times New Roman', serif",
    headerAlign:  'text-center',
    headerBorder: 'border-b border-gray-300 pb-4 mb-5',
    nameClass:    'text-[22px] font-bold tracking-tight',
    contactClass: 'text-[10px] text-gray-500 mt-1 tracking-wide',
    linkClass:    'text-[10px] text-gray-400 mt-0.5',
    sectionWrap:  'mb-4',
    sectionLabel: 'text-[9px] font-bold tracking-[0.18em] uppercase text-gray-500 border-b border-gray-300 pb-1.5 mb-2',
    entryRole:    'text-[11px] font-bold text-gray-900',
    entryCompany: 'text-[10px] text-gray-500 italic mb-1',
    entryDate:    'text-[9.5px] text-gray-400',
    bulletText:   'text-[10px] text-gray-700 leading-snug',
    bodyText:     'text-[10.5px] text-gray-700 leading-[1.65]',
    skillsText:   'text-[10px] text-gray-700 leading-relaxed',
  },
  modern: {
    fontFamily:   "'Inter', system-ui, sans-serif",
    headerAlign:  'text-left',
    headerBorder: 'mb-5',
    nameClass:    'text-[21px] font-bold tracking-tight',
    contactClass: 'text-[10px] text-gray-500 mt-1',
    linkClass:    'text-[10px] text-gray-400 mt-0.5',
    sectionWrap:  'mb-4',
    sectionLabel: 'text-[9px] font-bold tracking-widest uppercase text-gray-700 border-l-[3px] border-gray-800 pl-2 mb-2',
    entryRole:    'text-[11px] font-semibold text-gray-900',
    entryCompany: 'text-[10px] text-gray-500 mb-1',
    entryDate:    'text-[9.5px] text-gray-400',
    bulletText:   'text-[10px] text-gray-700 leading-snug',
    bodyText:     'text-[10.5px] text-gray-600 leading-[1.65]',
    skillsText:   'text-[10px] text-gray-600 leading-relaxed',
  },
  minimal: {
    fontFamily:   "'Inter', system-ui, sans-serif",
    headerAlign:  'text-left',
    headerBorder: 'mb-4',
    nameClass:    'text-[18px] font-semibold tracking-tight',
    contactClass: 'text-[9.5px] text-gray-400 mt-0.5',
    linkClass:    'text-[9.5px] text-gray-400 mt-0.5',
    sectionWrap:  'mb-3',
    sectionLabel: 'text-[8.5px] tracking-[0.2em] uppercase text-gray-400 font-medium mb-1.5',
    entryRole:    'text-[10.5px] font-semibold text-gray-900',
    entryCompany: 'text-[9.5px] text-gray-400 mb-0.5',
    entryDate:    'text-[9px] text-gray-400',
    bulletText:   'text-[9.5px] text-gray-600 leading-snug',
    bodyText:     'text-[10px] text-gray-600 leading-[1.6]',
    skillsText:   'text-[9.5px] text-gray-600 leading-relaxed',
  },
}

/* Action verbs for bullet guidance */
export const ACTION_VERBS = [
  'built','developed','designed','implemented','led','improved','created',
  'optimized','automated','managed','delivered','reduced','increased','launched',
  'shipped','architected','scaled','migrated','refactored','integrated','deployed',
  'wrote','fixed','tested','mentored','trained','analyzed','researched','coordinated',
]
export function bulletVerb(text) {
  if (!text?.trim()) return false
  const first = text.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '')
  return ACTION_VERBS.includes(first)
}
export function bulletHasNumber(text) {
  if (!text?.trim()) return false
  return /(\d+%|\d+k|\d+x|\d+\+|\$\d+|\d{2,})/i.test(text)
}
