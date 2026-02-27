import * as yup from "yup";

export const modalNoticeBoardsSchema = yup.object({
  noticeTitle: yup.string().required("제목을 입력해주세요.").nullable(), // 제목
  noticeDescription: yup.string().required("내용을 입력해주세요.").nullable(), // 내용
  noticeAuthorName: yup.string().nullable(), // 작성자
  noticeCategory: yup.string().nullable(), // 카테고리
});
