import { Column } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CSSProperties } from "react";
import { Project } from "../types/project";
import { MajorSchedule } from "../types/majorschedule";
import { SubSchedule } from "../types/subSchedules";

export const getCommonPinningStyles = (
  column: Column<any>,
  index?: number
): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");

  // ❇️ 부모 컬럼이면 자식 컬럼들의 size 합산값 계산
  const childColumnsSize = column.columns
    ? column.columns.reduce((sum, child) => sum + child.getSize(), 0)
    : 0;

  return {
    backgroundColor: isPinned ? "#eef4ff" : undefined,
    color: isPinned ? "black" : "",
    boxShadow: isLastLeftPinnedColumn
      ? "-4px 0 4px -4px gray inset"
      : undefined,
    // left:
    //   isPinned === "left"
    //     ? `${66.8 * (index ? index : column.getIndex())}px`
    //     : undefined,
    // left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    left:
      isPinned === "left"
        ? column.columns // 자식 컬럼이 있으면
          ? column.id === "colspanC"
            ? 0
            : column.getStart("left") - childColumnsSize // ❇️자식 size만큼 빼주기
          : column.getStart("left") // ❇️나머지는 기존 로직 유지
        : undefined,
    position: isPinned ? "sticky" : "relative",
    width: isPinned ? column.getSize() : "20px",
    zIndex: isPinned ? 1 : 0,
    textAlign: "center",
    lineHeight: isPinned ? "18px" : "",
    wordBreak: "break-word", // ❇️영어로 한줄로 쭉 적을 시 줄바꿈이 안됨 (예외사항 처리) || 띄어쓰기 하거나 한글은 줄 바꿈 잘 됨
  };
};

export const getDateFromProjectList = (projectList: Project[]) => {
  let projectDateStart = projectList[0]?.projectDateStart; // ❇️ 첫 번째 프로젝트의 시작일과 종료일을 초기값으로 설정.
  let projectDateEnd = projectList[0]?.projectDateEnd;
  for (const item of projectList) {
    // ❇️ 모든 프로젝트 중 가장 빠른 시작일과 가장 늦은 종료일을 찾음
    const tmpStart = dayjs(item.projectDateStart).diff(projectDateStart, "day"); // ❇️ 현재까지의 최소 시작일과 비교
    const tmpEnd = dayjs(item.projectDateEnd).diff(projectDateEnd, "day"); // ❇️ 현재까지의 최대 종료일과 비교
    if (tmpStart < 0) {
      projectDateStart = item.projectDateStart; // ❇️ 더 빠른 시작일 있으면 갱신
    }
    if (tmpEnd > 0) {
      projectDateEnd = item.projectDateEnd; // ❇️ 더 늦은 종료일 있으면 갱신
    }
  }
  return { projectDateStart, projectDateEnd };
};

export const getDateFromMajorScheduleList = (
  majorScheduleList: MajorSchedule[]
) => {
  let majorDatePlanStart = majorScheduleList[0]?.majorDatePlanStart;
  let majorDatePlanEnd = majorScheduleList[0]?.majorDatePlanEnd;
  let majorDateStart = majorScheduleList[0]?.majorDateStart;
  let majorDateEnd = majorScheduleList[0]?.majorDateEnd;
  for (const item of majorScheduleList) {
    const tmpStart = dayjs(item.majorDatePlanStart).diff(
      majorDatePlanStart,
      "day"
    );
    const tmpEnd = dayjs(item.majorDatePlanEnd).diff(majorDatePlanEnd, "day");
    const tmpStartDate = dayjs(item.majorDateStart).diff(majorDateStart, "day");
    const tmpEndDate = dayjs(item.majorDateEnd).diff(majorDateEnd, "day");
    if (tmpStart < 0) {
      majorDatePlanStart = item.majorDatePlanStart;
    }
    if (tmpEnd > 0) {
      majorDatePlanEnd = item.majorDatePlanEnd;
    }
    if (tmpStartDate < 0) majorDateStart = item.majorDateStart;
    if (tmpEndDate > 0) majorDateEnd = item.majorDateEnd;
  }
  return { majorDatePlanStart, majorDatePlanEnd, majorDateStart, majorDateEnd };
};

export const getDateFromSubScheduleList = (subScheduleList: SubSchedule[]) => {
  let subDatePlanStart = subScheduleList[0]?.subDatePlanStart;
  let subDatePlanEnd = subScheduleList[0]?.subDatePlanEnd;
  let subSchedulePhase = subScheduleList[0]?.subSchedulePhase;
  for (const item of subScheduleList) {
    const tmpStart = dayjs(item.subDatePlanStart).diff(subDatePlanStart, "day");
    const tmpEnd = dayjs(item.subDatePlanEnd).diff(subDatePlanEnd, "day");
    if (tmpStart < 0) {
      subDatePlanStart = item.subDatePlanStart;
    }
    if (tmpEnd > 0) {
      subDatePlanEnd = item.subDatePlanEnd;
    }
  }
  return { subDatePlanStart, subDatePlanEnd, subSchedulePhase };
};

export const getDateRangeArray = (startDate: string, endDate: string) => {
  const dateObj: any = {};
  let currentDate = dayjs(startDate);
  const adjustedEnd = dayjs(endDate).endOf("month"); // 해당 월의 마지막은 31일

  while (
    currentDate.isBefore(dayjs(adjustedEnd)) ||
    currentDate.isSame(dayjs(adjustedEnd))
  ) {
    const arr = dateObj[currentDate.format("YYYY-MM")];
    if (!arr) {
      dateObj[currentDate.format("YYYY-MM")] = [currentDate.format("DD")];
    } else {
      arr.push(currentDate.format("DD"));
    }
    currentDate = currentDate.add(1, "day"); // 하루 더하기
  }
  return dateObj;
};
