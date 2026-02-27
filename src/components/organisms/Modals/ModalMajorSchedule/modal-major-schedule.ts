import * as yup from "yup";
import { dateValidate } from "../../../../common/util/yupTestFunction";
import { validateDateRange } from "../../../../common/functions/validateDateRange";

export const modalMajorScheduleSchema = yup
  .object({
    projectName: yup.string().nullable(), // 프로젝트명
    description: yup.string().nullable(), // 설명
    majorScheduleName: yup
      .string()
      .required("대일정명을 입력해주세요.")
      .nullable(), // 대일정명
    majorDatePlanStart: yup
      .string()
      .nullable()
      .test(
        "is-valid-date",
        "올바른 날짜 형식(yyyy-mm-dd)을 입력해주세요.",
        dateValidate
      ), // 계획시작날짜
    majorDatePlanEnd: yup
      .string()
      .nullable()
      .test(
        "is-valid-date",
        "올바른 날짜 형식(yyyy-mm-dd)을 입력해주세요.",
        dateValidate
      ) // 계획종료날짜
      .test("plan-date-range", "", function (value) {
        const startDate = this.parent.majorDatePlanStart;
        const endDate = value;

        const { userInfo } = this.options.context || {};

        const validation = validateDateRange(
          startDate,
          String(endDate),
          1,
          "months",
          userInfo?.userName
        );

        if (!validation.isValid) {
          return this.createError({ message: validation.message });
        }

        return true;
      }),
    displayOrder: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" || originalValue === undefined ? null : value
      )
      .nullable(), // 표시순서
  })
  .required();
