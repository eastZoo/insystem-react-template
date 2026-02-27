import * as yup from "yup";
import { dateValidate } from "../../../../common/util/yupTestFunction";

export const modalPerformanceRecordsSchema = yup
  .object({
    workDate: yup
      .string()
      .nullable()
      .test(
        "is-valid-date",
        "올바른 날짜 형식(yyyy-mm-dd)을 입력해주세요.",
        dateValidate
      ), // 작업시작날짜
    workDateEnd: yup
      .string()
      .nullable()
      .test(
        "is-valid-date",
        "올바른 날짜 형식(yyyy-mm-dd)을 입력해주세요.",
        dateValidate
      ), // 작업종료날짜
    workDescription: yup.string().nullable(), // 작업내용
    assignedTo: yup.string().required("담당자를 입력해주세요.").nullable(), //담당자
    projectName: yup.string().nullable(), // 프로젝트명
    majorScheduleName: yup.string().nullable(), // 대일정명
    subScheduleName: yup.string().nullable(), // 단위일정명
    subSchedulesOid: yup.string().nullable(), // 단위일정 OID
    isTravel: yup.boolean().nullable(), // 출장 여부
    test: yup.string().nullable(),
  })
  .required();
