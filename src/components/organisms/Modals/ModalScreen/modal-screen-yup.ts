import { Screen } from "src/common/types/screen";
import * as yup from "yup";

export const modalScreenSchema = yup.object<Screen>({
  screenNo: yup.number().nullable().required("화면번호를 입력해주세요"),
  menuType: yup.string().nullable(),
  screenName: yup.string().required("화면명을 입력해주세요"),
  filePath: yup.string().required("소스경로를 입력해주세요"),
  path: yup.string().required("라우트경로를 입력해주세요"),
  screenType: yup.string().nullable(),
  isUse: yup.boolean(),
});
