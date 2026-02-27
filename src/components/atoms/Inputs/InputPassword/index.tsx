import { InputProps, Inputs } from "../Inputs";

export const InputPassword = (props: InputProps) => {
  return (
    <Inputs
      id={props.id && props.id}
      label={props.label && props.label}
      size={props.size}
      width={props.width}
      direction={props.direction}
      errored={props.errored}
      erroredTxt={props.erroredTxt}
      explain={props.explain}
    >
      <input
        id={props.id && props.id}
        type="password"
        placeholder={props.placeholder && props.placeholder}
      />
    </Inputs>
  );
};
