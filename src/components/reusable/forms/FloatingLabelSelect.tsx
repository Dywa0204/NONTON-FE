import { useState, forwardRef } from "react";
import { Plus } from "react-feather";
import Select, { SingleValue, Options, ActionMeta, components } from "react-select";

interface Option {
  value: string | number;
  label: string;
}

type SelectValue = string | number | null | Array<string | number>;

interface FloatingLabelSelectProps {
  label: string;
  value: SelectValue;
  onChange: (val: any, actionMeta: ActionMeta<Option>) => void;
  options: Options<Option>;
  placeholder?: string;
  isLoading?: boolean;
  onMenuOpen?: () => void;
  onMenuScrollToBottom?: () => void;
  onInputChange?: (val: string, actionMeta: { action: string }) => void;
  name: string;
  error?: string | string[];
  touched?: boolean | any;
  isClearable?: boolean;
  isDisabled?: boolean;
  isMultiple?: boolean;
  className?: string
}

const FloatingLabelSelect = forwardRef<any, FloatingLabelSelectProps>(
  (
    {
      label,
      value,
      onChange,
      options,
      placeholder,
      isLoading,
      onMenuOpen,
      onMenuScrollToBottom,
      onInputChange,
      name,
      error,
      touched,
      isClearable,
      isDisabled,
      isMultiple,
      className
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    const isMulti = Array.isArray(value) || isMultiple;

    const formattedValue = isMulti
      ? options.filter((opt) => (value as (string | number)[]).includes(opt.value))
      : options.find((opt) => opt.value === value) || null;

    const handleChange = (
      val: SingleValue<Option> | readonly Option[] | null,
      actionMeta: ActionMeta<Option>
    ) => {
      if (isMulti) {
        const multiVal = val ? (val as Option[]).map((v) => v.value) : [];
        onChange(multiVal as any, actionMeta);
      } else {
        onChange(val as SingleValue<Option>, actionMeta);
      }
    };

    const isActive =
      focused ||
      isLoading ||
      (isMulti ? (Array.isArray(value) && value.length > 0) : !!value);

    const CustomOption = (props: any) => {
      const isNew = props.data?.value === "#new#";

      return (
        <components.Option {...props}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              color: isNew ? "green" : "inherit",
              fontWeight: isNew ? "600" : "normal",
            }}
          >
            <span>{props.data.label}</span>
            {isNew && <Plus size={14} style={{ color: "green" }} />}
          </div>
        </components.Option>
      );
    };

    return (
      <div className={`mb-3 position-relative ${className ?? ""}`} style={{ height: "58px" }}>
        <label
          style={{
            position: "absolute",
            top: isActive ? "7px" : "50%",
            left: "6px",
            transform: isActive ? "none" : "translateY(-50%)",
            fontSize: isActive ? "0.7rem" : "0.9rem",
            color: isActive ? "#6c757da6" : "#6c757d",
            backgroundColor: isDisabled ? "#f2f2f2" : "white",
            padding: "0 6px",
            transition: "all 0.15s ease-in-out",
            pointerEvents: "none",
            zIndex: 3,
          }}
        >
          {label}
        </label>

        <Select
          ref={ref}
          name={name}
          placeholder={placeholder}
          options={options}
          isLoading={isLoading}
          isClearable={isClearable}
          isSearchable
          isDisabled={isDisabled}
          isMulti={isMulti}
          value={formattedValue}
          onChange={handleChange}
          components={{ Option: CustomOption }}
          onMenuOpen={onMenuOpen}
          onMenuScrollToBottom={onMenuScrollToBottom}
          onInputChange={onInputChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          styles={{
            control: (base, state) => ({
              ...base,
              borderColor:
                touched && error
                  ? "#dc3545"
                  : state.isFocused
                    ? "#86b7fe"
                    : "#dee6ed",
              boxShadow: state.isFocused
                ? "0 0 0 0.25rem rgba(13,110,253,.25)"
                : "none",
              borderRadius: "0.2rem",
              paddingLeft: "2px",
              minHeight: "58px",
              "&:hover": {
                borderColor:
                  touched && error
                    ? "#dc3545"
                    : state.isFocused
                      ? "#86b7fe"
                      : "#dee6ed",
              },
              alignItems: "end",
            }),
            valueContainer: (base) => ({
              ...base,
              paddingTop: "6px",
              paddingBottom: "6px",
            }),
            placeholder: (base) => ({
              ...base,
              color: "transparent",
            }),
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            menu: (base) => ({ ...base, zIndex: 9999 }),
          }}
          menuPortalTarget={document.body}
        />

        {touched && error && (
          <div className="text-danger small mt-1">{error}</div>
        )}
      </div>
    );
  }
);

export default FloatingLabelSelect;
