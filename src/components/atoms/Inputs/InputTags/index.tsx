// components/Inputs/InputTags.tsx
import { Inputs, InputProps } from "../Inputs";
import { ReactTags, Tag } from "react-tag-autocomplete";
import * as S from "./InputTags.style";

interface InputTagsProps extends InputProps {
  selected: CustomTag[];
  suggestions: CustomTag[];
  onAdd: (tag: CustomTag) => void;
  onDelete: (i: number) => void;
  placeholder?: string;
  userColor?: string;
}
interface CustomTag extends Tag {
  userColor?: string;
}

export const InputTags = ({
  label,
  size,
  width,
  direction,
  errored,
  erroredTxt,
  selected,
  suggestions,
  onAdd,
  onDelete,
  placeholder,
  disabled,
}: InputTagsProps) => {
  return (
    <Inputs
      label={label}
      size={size}
      width={width}
      direction={direction}
      errored={errored}
      erroredTxt={erroredTxt}
    >
      <S.TagBox>
        <div
          className="react-tags__input-wrapper"
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            borderRadius: "6px",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              minWidth: "100%",
              flexWrap: "wrap",
            }}
          >
            {/* 선택된 태그들 */}
            {selected.map((tag, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: tag.userColor || "#ccc",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  marginRight: "6px",
                  marginBottom: "4px",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (!disabled) {
                    onDelete(index);
                  }
                }}
              >
                {tag.label}
                <span style={{ marginLeft: "8px", cursor: "pointer" }}>×</span>
              </span>
            ))}
          </div>

          {/* 입력 필드 */}
          <div style={{ width: "100%" }}>
            <ReactTags
              selected={[]}
              suggestions={suggestions}
              onAdd={onAdd}
              onDelete={() => {}}
              labelText=""
              placeholderText={placeholder || ""}
              noOptionsText="일치하는 담당자가 없습니다."
              isDisabled={disabled}
            />
          </div>
        </div>
      </S.TagBox>
    </Inputs>
  );
};
