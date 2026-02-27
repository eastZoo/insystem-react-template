import * as yup from "yup";
import { dateValidate } from "../../../../common/util/yupTestFunction";
import { validateDateRange } from "../../../../common/functions/validateDateRange";

export const modalSubScheduleSchema = yup
  .object({
    subScheduleName: yup
      .string()
      .required("단위일정명을 입력해주세요.")
      .max(255, "255자 이내로 작성해주세요.")
      .nullable(), // 단위일정명
    subSchedulePhase: yup.string().nullable(), // 단계
    description: yup.string().nullable(), // 단위일정 설명
    subDatePlanStart: yup
      .string()
      .nullable()
      .test(
        "is-valid-date",
        "올바른 날짜 형식(yyyy-mm-dd)을 입력해주세요.",
        dateValidate
      ), // 계획시작날짜
    subDatePlanEnd: yup
      .string()
      .nullable()
      .test(
        "is-valid-date",
        "올바른 날짜 형식(yyyy-mm-dd)을 입력해주세요.",
        dateValidate
      )
      .test("is-valid-date-range", "", function (value) {
        const startDate = this.parent.subDatePlanStart;
        const endDate = value;

        const { userInfo } = this.options.context || {};

        const validation = validateDateRange(
          startDate,
          String(endDate),
          7,
          "days",
          userInfo?.userName
        );

        if (!validation.isValid) {
          return this.createError({ message: validation.message });
        }

        return true;
      }),
    difficultyLevel: yup.string().nullable(), //난이도
    priorityLevel: yup.string().nullable(), //중요도
    assignedTo: yup.string().required("담당자를 입력해주세요.").nullable(), //담당자
    projectName: yup.string().required("프로젝트를 선택해주세요.").nullable(),
    majorScheduleName: yup
      .string()
      .required("대일정을 선택해주세요.")
      .nullable(),
    // isDelayed: yup.boolean().nullable(), //지연여부
    // delayReason: yup.string().nullable(), //지연사유
    displayOrder: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" || originalValue === undefined ? null : value
      )
      .nullable(), // 표시순서
    majorScheduleOid: yup.string().nullable(), // 대일정 OID
  })
  .required();
