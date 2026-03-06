"use client";

import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface CustomPhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    placeholder?: string;
    required?: boolean;
    name?: string;
}

export function CustomPhoneInput({
    value,
    onChange,
    error,
    placeholder,
    required = false,
    name = "phone",
}: CustomPhoneInputProps) {
    return (
        <div className="relative w-full">
            <style jsx global>{`
                /* Base input container */
                .react-tel-input .form-control {
                    width: 100% !important;
                    height: 58px !important;
                    padding-left: 64px !important;
                    border-radius: 1rem !important;
                    background: rgba(255, 255, 255, 0.4) !important;
                    border: 1px solid rgba(229, 231, 235, 0.6) !important;
                    color: #111827 !important;
                    font-family: inherit !important;
                    font-weight: 700 !important;
                    transition: all 0.3s ease !important;
                }
                /* Dark mode base */
                .dark .react-tel-input .form-control {
                    background: rgba(0, 0, 0, 0.5) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: white !important;
                }

                /* Error States */
                .react-tel-input.has-error .form-control {
                    border-color: #ef4444 !important;
                    box-shadow: 0 0 15px rgba(239, 68, 68, 0.2) !important;
                }
                .react-tel-input.has-error .form-control:focus {
                    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.5) !important;
                }

                /* Focus States Normal */
                .react-tel-input:not(.has-error) .form-control:focus {
                    border-color: #3b82f6 !important;
                    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5) !important;
                }

                /* Flag Dropdown */
                .react-tel-input .flag-dropdown {
                    background: transparent !important;
                    border: none !important;
                    border-radius: 1rem 0 0 1rem !important;
                }
                .react-tel-input .selected-flag {
                    background: transparent !important;
                    width: 56px !important;
                    padding: 0 0 0 20px !important;
                    border-radius: 1rem 0 0 1rem !important;
                }
                .react-tel-input .selected-flag:hover,
                .react-tel-input .selected-flag:focus,
                .react-tel-input .flag-dropdown.open .selected-flag {
                    background: rgba(0, 0, 0, 0.05) !important;
                }
                .dark .react-tel-input .selected-flag:hover,
                .dark .react-tel-input .selected-flag:focus,
                .dark .react-tel-input .flag-dropdown.open .selected-flag {
                    background: rgba(255, 255, 255, 0.05) !important;
                }

                /* Country List Dropdown */
                .react-tel-input .country-list {
                    background: rgba(255, 255, 255, 0.95) !important;
                    backdrop-filter: blur(10px) !important;
                    border-radius: 1rem !important;
                    border: 1px solid rgba(229, 231, 235, 0.6) !important;
                    color: #111827 !important;
                    margin-top: 8px !important;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
                    padding: 8px !important;
                    width: 300px !important;
                }
                .dark .react-tel-input .country-list {
                    background: rgba(10, 10, 10, 0.95) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: white !important;
                }

                /* Search Box */
                .react-tel-input .country-list .search {
                    background: transparent !important;
                    padding: 4px 4px 12px 4px !important;
                }
                .react-tel-input .country-list .search-box {
                    width: 100% !important;
                    border-radius: 0.5rem !important;
                    border: 1px solid rgba(229, 231, 235, 0.6) !important;
                    padding: 10px 12px !important;
                    margin: 0 !important;
                    font-family: inherit !important;
                    background: rgba(255, 255, 255, 0.5) !important;
                }
                .dark .react-tel-input .country-list .search-box {
                    background: rgba(255, 255, 255, 0.05) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: white !important;
                }

                /* Countries items */
                .react-tel-input .country-list .country {
                    border-radius: 0.5rem !important;
                    padding: 8px 12px !important;
                    margin-bottom: 2px !important;
                }
                .react-tel-input .country-list .country:hover {
                    background: rgba(59, 130, 246, 0.1) !important;
                }
                .react-tel-input .country-list .country.highlight {
                    background: rgba(59, 130, 246, 0.2) !important;
                }
            `}</style>

            <PhoneInput
                country={"ua"}

                value={value}
                onChange={onChange}
                placeholder={placeholder}
                containerClass={`react-tel-input transition-all duration-300 ${error ? "has-error" : ""
                    }`}
                enableSearch={true}
                disableSearchIcon={true}
                searchPlaceholder="..."
                inputProps={{
                    required,
                    name,
                }}
            />
        </div>
    );
}
