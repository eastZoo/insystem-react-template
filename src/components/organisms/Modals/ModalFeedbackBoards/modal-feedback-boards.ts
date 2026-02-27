import * as yup from "yup";

export const modalFeedbackBoardsSchema = yup.object({
  feedbackState: yup.string().required("상태를 입력해주세요.").nullable(), // 상태
  feedbackCategory: yup
    .string()
    .required("카테고리를 입력해주세요.")
    .nullable(), // 카테고리
  feedbackRequest: yup.string().required("내용을 입력해주세요.").nullable(), // 내용
});
