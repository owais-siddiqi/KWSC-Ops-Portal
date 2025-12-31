import { useState, useRef, useEffect } from 'react'

interface Option {
  value: string
  label: string
}

interface MultiSelectDropdownProps {
  options: Option[]
  value: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  label?: string
}

export default function MultiSelectDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const displayText = value.length === 0 
    ? placeholder 
    : value.length === 1
    ? options.find(opt => opt.value === value[0])?.label || placeholder
    : `${value.length} selected`

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-left bg-white flex items-center justify-between hover:border-gray-400 transition-colors"
      >
        <span className={value.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
          {displayText}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = value.includes(option.value)
            return (
              <div
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={`
                  px-3 py-2 cursor-pointer text-sm flex items-center justify-between
                  ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-900 hover:bg-gray-100'}
                `}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

