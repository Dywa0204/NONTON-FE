import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Select, { GroupBase, SingleValue } from 'react-select';
import { Button } from 'react-bootstrap';

export interface OptionType {
    name?: string;
    value: string | number;
    label: string;
    otherText?: string;
    isDisabled?: boolean;
    request?: boolean;
}

interface SelectCustomProps {
    name?: string;
    totalData?: number;
    onSelectChange: (option: OptionType) => void;
    optionData: OptionType[];
    selectedValue?: OptionType | '';
    valueKey?: keyof OptionType;
    labelKey?: keyof OptionType;
    defaultLabel?: string;
    isDisabled?: boolean;
    isLoadingMore?: boolean;
    label?: string;
    labelMarginBottom?: string;
    className?: string;
    allowedAddNewItem?: boolean;
    onModal?: boolean;
    required?: boolean;
    isCleareable?: boolean;
    hideEmptyOption?: boolean;
    onLoadMore?: (trigger: boolean) => Promise<void>;
    onSearchRequest?: (query: string) => void;
    searchDelay?: number;
    error?: string;
    width?: string;
}

const SelectCustom: React.FC<SelectCustomProps> = ({
    name,
    totalData = 0,
    onSelectChange,
    optionData,
    selectedValue,
    valueKey = 'value',
    labelKey = 'label',
    defaultLabel = 'Pilih...',
    isDisabled,
    isLoadingMore,
    label,
    labelMarginBottom,
    className,
    allowedAddNewItem = false,
    onModal,
    required,
    isCleareable,
    hideEmptyOption,
    onLoadMore,
    onSearchRequest,
    searchDelay = 600,
    error,
    width,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<OptionType[]>([]);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isNoData, setIsNoData] = useState(false);
    const [hasRequestedSearch, setHasRequestedSearch] = useState(false);

    useEffect(() => {
        setPortalTarget(document.body);
    }, []);

    useEffect(() => {
        const safeOptionData = Array.isArray(optionData) ? optionData : [];

        const defaultOption: OptionType = {
            value: '',
            label: defaultLabel,
        };

        let updatedOption: OptionType[] = hideEmptyOption
            ? [...safeOptionData]
            : [defaultOption, ...safeOptionData];


        if (isLoadingMore) {
            setMenuOpen(true);
            updatedOption.push({
                value: '__loading__',
                label: 'Sedang memuat data...',
                isDisabled: true,
            });
        }

        setOptions(updatedOption);
    }, [optionData, valueKey, labelKey, isLoadingMore]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const safeOptionData = Array.isArray(optionData) ? optionData : [];

            const hasMatch = safeOptionData.some(item => {
                const labelValue = item[labelKey];
                return typeof labelValue === 'string' &&
                    labelValue.toLowerCase().includes(inputValue.toLowerCase());
            });

            if (!hasMatch && inputValue.trim() && !hasRequestedSearch) {
                setIsNoData(true);
                onSearchRequest?.(inputValue);
                setHasRequestedSearch(true);
            } else {
                setIsNoData(false);
                setHasRequestedSearch(false);

                const filtered = safeOptionData.filter(item => {
                    const labelValue = item[labelKey];
                    return String(labelValue).toLowerCase().includes(inputValue.toLowerCase());
                });

                const defaultOption: OptionType = {
                    value: '',
                    label: defaultLabel
                };


                setOptions(hideEmptyOption ? filtered : [defaultOption, ...filtered]);

            }
        }, searchDelay);

        return () => clearTimeout(timeout);
    }, [inputValue, optionData]);

    const mappedOption = useMemo(() => {
        return options.map(item => ({
            ...item,
            value: typeof item[valueKey] === 'string' || typeof item[valueKey] === 'number' ? item[valueKey] : '',
            label: typeof item[labelKey] === 'string' || typeof item[labelKey] === 'number' ? String(item[labelKey]) : '',
        }));
    }, [options, valueKey, labelKey]);

    const formattedSelectedValue = useMemo(() => {
        if (!selectedValue || (typeof selectedValue === 'string' && selectedValue === '')) {
            return undefined;
        }


        const rawValue = selectedValue[valueKey];
        const rawLabel = selectedValue[labelKey];

        if (
            (typeof rawValue === 'string' || typeof rawValue === 'number') &&
            (typeof rawLabel === 'string' || typeof rawLabel === 'number')
        ) {
            return {
                ...selectedValue,
                value: rawValue,
                label: String(rawLabel),
            };
        }

        return undefined;
    }, [selectedValue, valueKey, labelKey]);

    const handleInputChange = (value: string) => {
        setInputValue(value);
        setIsNoData(false);
        setHasRequestedSearch(false);
    };

    const handleChange = useCallback((selectedOption: SingleValue<OptionType>) => {
        if (!selectedOption) {
            onSelectChange({ value: '', label: defaultLabel });
            setInputValue('');
            return;
        }

        if (selectedOption.value === '__loading__') {
            setMenuOpen(true);
            return;
        }

        onSelectChange(selectedOption);
        setInputValue('');
    }, [onSelectChange, defaultLabel]);

    const handleAddNewItem = () => {
        if (!inputValue.trim()) return;

        const inferredValue = /^\d+$/.test(inputValue) ? Number(inputValue) : inputValue;

        const newItem: OptionType = {
            value: inferredValue,
            label: inputValue,
            request: true,
        };

        onSelectChange(newItem);
        setMenuOpen(false);
    };

    const CustomNoOptionMessage = () => (
        <div style={{ padding: '10px' }} className="text-center">
            <p>Tidak ditemukan data...</p>
            <p>"{inputValue}"</p>
            {allowedAddNewItem && (
                <Button variant="primary" onClick={handleAddNewItem}>Tambahkan</Button>
            )}
        </div>
    );

    const handleLoadMore = async () => {
        if (options.length <= totalData && !isNoData && !isLoadingMore && typeof onLoadMore === 'function') {
            await onLoadMore(true);
        }
    };

    const formatOptionLabel = (data: OptionType, { context }: { context: 'menu' | 'value' }) => {
        return (
            <div>
                <span>{String(data[labelKey])}</span>
                {data.otherText && (
                    <span className="ms-2">
                        - <span className="text-danger">{data.otherText}</span>
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className={`custom-select-container ${className || ''}`}>
            {label && (
                <label style={{ marginBottom: labelMarginBottom || '8px' }}>
                    {label}
                    {required && <span className="text-danger">*</span>}
                </label>
            )}
            <Select<OptionType, false, GroupBase<OptionType>>
                classNamePrefix="custom-select"
                className={`custom-select ${className || ''} custom-select-sm`}
                name={name}
                options={mappedOption}
                onInputChange={handleInputChange}
                onChange={handleChange}
                onMenuOpen={() => setMenuOpen(true)}
                onMenuClose={() => {
                    setMenuOpen(false);
                    onSearchRequest?.('menu-close');
                }}
                menuIsOpen={menuOpen}
                value={formattedSelectedValue}
                inputValue={inputValue}
                isClearable={isCleareable && selectedValue !== '' && selectedValue?.label !== defaultLabel}
                placeholder={defaultLabel}
                isDisabled={isDisabled}
                menuPortalTarget={portalTarget}
                {...(onModal ? { menuPosition: 'fixed' } : {})}
                components={{ NoOptionsMessage: CustomNoOptionMessage }}
                styles={{
                    control: (base) => ({
                        ...base,
                        width: width || '100%',
                    }),
                    ...(onModal
                        ? {
                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999
                            })
                        }
                        : {})
                }}
                {...(typeof onLoadMore === 'function'
                    ? { onMenuScrollToBottom: handleLoadMore }
                    : {}
                )}
                isLoading={isLoadingMore}
                formatOptionLabel={formatOptionLabel}
            />
            {error && <small className="text-danger">{error}</small>}
        </div>
    );
};

export default SelectCustom;
