import { useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export type TimeRange = 'daily' | 'yesterday' | 'weekly' | 'monthly' | 'custom'

interface TimeRangeSelectorProps {
    timeRange: TimeRange
    onTimeRangeChange: (range: TimeRange) => void
    startDate: string
    onStartDateChange: (date: string) => void
    endDate: string
    onEndDateChange: (date: string) => void
}

export default function TimeRangeSelector({
    timeRange,
    onTimeRangeChange,
    startDate,
    onStartDateChange,
    endDate,
    onEndDateChange,
}: TimeRangeSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [showCustomPicker, setShowCustomPicker] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Convert string dates to Date objects for DatePicker
    const startDateObj = startDate ? new Date(startDate) : null
    const endDateObj = endDate ? new Date(endDate) : null

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setShowCustomPicker(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Auto-close custom picker when both dates are selected
    useEffect(() => {
        if (timeRange === 'custom' && startDate && endDate) {
            // Small delay to let the user see the selection before closing
            const timer = setTimeout(() => {
                setShowCustomPicker(false)
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [timeRange, startDate, endDate])

    const options: { value: TimeRange; label: string }[] = [
        { value: 'daily', label: 'Today' },
        { value: 'yesterday', label: 'Yesterday' },
        { value: 'weekly', label: 'This Week' },
        { value: 'monthly', label: 'This Month' },
    ]

    const selectedLabel = timeRange === 'custom' ? 'Select Range' : options.find(opt => opt.value === timeRange)?.label || 'Select Range'

    // Format date for display
    const formatDisplayDate = (date: Date | null) => {
        if (!date) return ''
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    // Handle date range change from DatePicker
    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates
        if (start) {
            onStartDateChange(start.toISOString().split('T')[0])
        }
        if (end) {
            onEndDateChange(end.toISOString().split('T')[0])
        }
    }

    return (
        <div className="flex flex-col gap-4 relative" ref={dropdownRef}>
            <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Time Range:</span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`flex items-center justify-between w-40 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50
                                }`}
                        >
                            <span>{selectedLabel}</span>
                            <svg className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 z-50 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
                                {options.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            onTimeRangeChange(option.value)
                                            setIsOpen(false)
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${timeRange === option.value ? 'text-[#4388BC] font-medium bg-blue-50' : 'text-gray-700'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            onTimeRangeChange('custom')
                            setShowCustomPicker(true)
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${timeRange === 'custom'
                            ? 'bg-[#4388BC] text-white border-[#4388BC]'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Custom Range
                    </button>
                </div>
            </div>

            {/* Custom Date Range Picker */}
            {timeRange === 'custom' && showCustomPicker && (
                <div className="absolute top-full right-0 mt-2 z-40 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                    {/* Date Display Header */}
                    <div className="flex gap-2 mb-4">
                        <div className={`flex-1 px-4 py-2 rounded-lg border text-center text-sm font-medium ${startDateObj ? 'border-[#4388BC] text-[#4388BC] bg-blue-50' : 'border-gray-300 text-gray-500'}`}>
                            {startDateObj ? formatDisplayDate(startDateObj) : 'Start Date'}
                        </div>
                        <div className={`flex-1 px-4 py-2 rounded-lg border text-center text-sm font-medium ${endDateObj ? 'border-[#4388BC] text-[#4388BC] bg-blue-50' : 'border-gray-300 text-gray-500'}`}>
                            {endDateObj ? formatDisplayDate(endDateObj) : 'End Date'}
                        </div>
                    </div>

                    {/* Calendar */}
                    <DatePicker
                        selected={startDateObj}
                        onChange={handleDateChange}
                        startDate={startDateObj}
                        endDate={endDateObj}
                        selectsRange
                        inline
                        maxDate={new Date()}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        calendarClassName="custom-datepicker"
                    />
                </div>
            )}

            {/* Custom styles for DatePicker */}
            <style>{`
                .custom-datepicker {
                    font-family: inherit !important;
                    border: none !important;
                }
                .react-datepicker {
                    border: none !important;
                    font-family: inherit !important;
                }
                .react-datepicker__header {
                    background-color: white !important;
                    border-bottom: 1px solid #e5e7eb !important;
                    padding-top: 8px !important;
                }
                .react-datepicker__current-month {
                    font-size: 0.875rem !important;
                    font-weight: 500 !important;
                    color: #374151 !important;
                }
                .react-datepicker__day-name {
                    color: #6b7280 !important;
                    font-size: 0.75rem !important;
                    font-weight: 500 !important;
                }
                .react-datepicker__day {
                    color: #374151 !important;
                    font-size: 0.875rem !important;
                    border-radius: 9999px !important;
                    width: 2rem !important;
                    height: 2rem !important;
                    line-height: 2rem !important;
                    margin: 0.125rem !important;
                }
                .react-datepicker__day:hover {
                    background-color: #dbeafe !important;
                    border-radius: 9999px !important;
                }
                .react-datepicker__day--selected,
                .react-datepicker__day--range-start,
                .react-datepicker__day--range-end {
                    background-color: #4388BC !important;
                    color: white !important;
                    border-radius: 9999px !important;
                }
                .react-datepicker__day--in-range {
                    background-color: #dbeafe !important;
                    color: #4388BC !important;
                    border-radius: 0 !important;
                }
                .react-datepicker__day--in-selecting-range {
                    background-color: #dbeafe !important;
                    color: #4388BC !important;
                }
                .react-datepicker__day--keyboard-selected {
                    background-color: #dbeafe !important;
                    color: #4388BC !important;
                }
                .react-datepicker__day--outside-month {
                    color: #d1d5db !important;
                }
                .react-datepicker__navigation {
                    top: 12px !important;
                }
                .react-datepicker__navigation-icon::before {
                    border-color: #6b7280 !important;
                }
                .react-datepicker__month-dropdown,
                .react-datepicker__year-dropdown {
                    background-color: white !important;
                    border: 1px solid #e5e7eb !important;
                    border-radius: 0.5rem !important;
                }
                .react-datepicker__month-option,
                .react-datepicker__year-option {
                    padding: 0.5rem !important;
                }
                .react-datepicker__month-option:hover,
                .react-datepicker__year-option:hover {
                    background-color: #dbeafe !important;
                }
                .react-datepicker__month-option--selected_month,
                .react-datepicker__year-option--selected_year {
                    background-color: #4388BC !important;
                    color: white !important;
                }
            `}</style>
        </div>
    )
}
