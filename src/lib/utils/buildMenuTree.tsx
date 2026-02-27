import type { MenuType } from "@/types/menu";
import IconMenu02 from "@/styles/assets/svg/icon_menu_01.svg";
import IconMenu03 from "@/styles/assets/svg/icon_menu_02.svg";
import IconMenu05 from "@/styles/assets/svg/icon_menu_03.svg";
import IconMenu06 from "@/styles/assets/svg/icon_menu_04.svg";
import IconMenu07 from "@/styles/assets/svg/icon_menu_05.svg";
import IconMenu08 from "@/styles/assets/svg/icon_menu_06.svg";

export const iconMap = {
  IconMenu02: <IconMenu02 />,
  IconMenu03: <IconMenu03 />,
  IconMenu05: <IconMenu05 />,
  IconMenu06: <IconMenu06 />,
  IconMenu07: <IconMenu07 />,
  IconMenu08: <IconMenu08 />,
};

export function buildMenuTree(flatList: MenuType[]) {
  const map = new Map<string, any>();
  const roots: any[] = [];

  // 정렬 보장
  flatList.sort((a, b) => (a.sortRef ?? 0) - (b.sortRef ?? 0));

  // 1단계: 초기 구조 생성
  for (const item of flatList) {
    const menuItem = {
      id: item.oid,
      title: item.title,
      icon: item.icon ? iconMap[item.icon as keyof typeof iconMap] : undefined, // 실제 React 엘리먼트는 바인딩 필요
      depth: item.depth,
      path: item.path,
      submenu: [],
    };
    map.set(item.oid, menuItem);
  }

  // 2단계: 부모에 붙이기
  for (const item of flatList) {
    const current = map.get(item.oid);
    if (!item.parentId || item.parentId === "0") {
      roots.push(current);
    } else {
      const parent = map.get(item.parentId);
      if (parent) {
        parent.submenu.push(current);
      }
    }
  }

  // 빈 submenu 제거
  const pruneEmptySubmenu = (items: any[]) => {
    for (const item of items) {
      if (item.submenu.length > 0) {
        pruneEmptySubmenu(item.submenu);
      } else {
        delete item.submenu;
      }
    }
  };

  pruneEmptySubmenu(roots);

  return roots;
}
