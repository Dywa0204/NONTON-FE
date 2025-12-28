import Select, {Props as SelectProps} from 'react-select'

type SelectAddonsProps<Option, IsMulti extends boolean = false> = SelectProps<Option, IsMulti> & {
  position: "left" | "right",
  text: string
};

const SelectAddon = <Option, IsMulti extends boolean = false>(
  props: SelectAddonsProps<Option, IsMulti>,
) => {
  return (
    <div className="d-flex select-addon" style={{minWidth: "320px"}}>
      <span className="select-addon-left px-2">{props.text}</span>
      <div className="flex-grow-1" style={{marginLeft: "-4px", position: "relative"}}>
        <Select
          classNamePrefix="react-select"
          {...props}
          styles={{
            ...props.styles,
            container: (base) => ({
              ...base,
              width: "100%",
              flex: 1
            }),
            menu: (base) => ({
              ...base,
              position:"absolute",
              zIndex: "5"
            })
          }}
        />
      </div>
    </div>
  )
}

export default SelectAddon;
