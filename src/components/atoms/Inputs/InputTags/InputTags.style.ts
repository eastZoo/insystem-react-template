// components/Inputs/InputTags.style.ts
import styled from "styled-components";

export const TagBox = styled.div`
  /* .react-tags {
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #fff;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  } */
  /* .react-tags__list {
    display: flex;
    flex: 1;
  } */

  .react-tags__combobox-input {
    outline: none;
    padding: 6px;
    min-width: 100%;
  }

  /* .react-tags__selected {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  } */

  /* .react-tags__tag {
    background: "#f0f0f0";
    color: #333;
    padding: 4px 5px;
    border-radius: 5px;
    font-size: 13px;
    display: flex;
    align-items: center;
    margin-right: 5px;
  } */

  /* .react-tags__remove {
    margin-left: 8px;
    cursor: pointer;
    font-weight: bold;
  } */

  .react-tags__listbox {
    margin-top: 4px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 15px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 10;
    position: absolute;
  }

  .react-tags__listbox .react-tags__option {
    padding: 6px 10px;
    cursor: pointer;
    border-radius: 4px;
  }

  /* .react-tags__option {
    padding: 6px 10px;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      background: rgb(198, 63, 63);
    }

    &[aria-selected="true"] {
      background: #007bff;
      color: white;
    }
  } */
`;
