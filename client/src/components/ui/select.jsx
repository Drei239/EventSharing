import Select from "react-select";

export const CustomSelect = ({ options, defaultValue, ...props }) => {
  return (
    <Select
      options={options}
      defaultValue={defaultValue}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          borderColor: state.isFocused ? "grey" : "gray",
          paddingLeft: "10px",
        }),
      }}
      {...props}
    />
  );
};
