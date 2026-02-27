import * as yup from "yup";

export const modalAnonymousBoardsSchema = yup.object({
  boardTitle: yup.string().required("제목을 입력해주세요.").nullable(), // 제목
  boardDescription: yup.string().required("내용을 입력해주세요.").nullable(), // 내용
  boardCategory: yup.string().required("카테고리를 입력해주세요.").nullable(), // 카테고리
  boardComment: yup.string().nullable(), // 코멘트
});
