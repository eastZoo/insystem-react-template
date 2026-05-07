import { atom, useAtom, useAtomValue } from "jotai";
import { useCallback } from "react";
import type { MenuType, Tab, TabSelect } from "@/types/menu";

// ─── sessionStorage 헬퍼 ─────────────────────────────────────

function readSession<T>(key: string, fallback: T): T {
  try {
    const saved = sessionStorage.getItem(key);
    if (saved != null) return JSON.parse(saved) as T;
  } catch { /* ignore */ }
  return fallback;
}

function writeSession<T>(key: string, value: T) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

// ─── 전역 메뉴 목록 (M) ─────────────────────────────────────

export let M: MenuType[] = [];

export const MenuSet = (Menu: MenuType[]) => {
  M = Menu;
};

// ─── 평탄화 유틸 ─────────────────────────────────────────────

export function flattenMenuTree(menuTree: any[]): MenuType[] {
  const result: MenuType[] = [];
  function traverse(items: any[]) {
    for (const item of items) {
      result.push({
        oid: item.id || item.oid,
        title: item.title,
        icon: item.icon,
        depth: item.depth,
        parentId: item.parentId || "0",
        path: item.path,
        sortRef: item.sortRef,
      });
      if (item.submenu && Array.isArray(item.submenu)) {
        traverse(item.submenu);
      }
    }
  }
  traverse(menuTree);
  return result;
}

// ─── Atoms ───────────────────────────────────────────────────

export const menuState = atom<MenuType[]>([]);

export const openTabsState = atom<Tab[]>(
  readSession<Tab[]>("openTabs", [])
);

export const selectedMenuState = atom<string>(
  readSession<string>("selectedMenu", "")
);

// ─── 탭 열기/닫기 유틸 ───────────────────────────────────────

function closeTab(openTabs: Tab[], id: string, preMenuId: string) {
  let chagedId = preMenuId;
  let deletedMenuList = openTabs.filter((menu: Tab) => menu.id !== id);

  if (id === preMenuId && deletedMenuList.length > 0) {
    chagedId = deletedMenuList[deletedMenuList.length - 1].id;
    deletedMenuList[deletedMenuList.length - 1] = {
      ...deletedMenuList[deletedMenuList.length - 1],
      isSelected: true,
    };
  }
  if (deletedMenuList.length === 0) chagedId = "";

  return { chagedId, deletedMenuList };
}

function openTab(menuList: MenuType[], openTabs: Tab[], id: string): Tab[] | null {
  let isUse = false;
  const selectedMenu = menuList.find((menu) => menu.oid === id);
  if (!selectedMenu) {
    console.warn(`Menu not found with id: ${id}`, { menuList, id });
    return null;
  }

  let tmpOpenTabs = openTabs.map((tab: Tab) => {
    if (tab.id === id) {
      isUse = true;
      return { ...tab, isSelected: true };
    }
    return { ...tab, isSelected: false };
  });

  if (!isUse) {
    tmpOpenTabs = [
      ...tmpOpenTabs,
      {
        id,
        menuName: selectedMenu.title,
        path: selectedMenu.path || "",
        isSelected: true,
      },
    ];
  }
  return tmpOpenTabs;
}

// ─── Recoil selectedMenuSelector 대체 훅 ─────────────────────
// 컴포넌트에서: const [selectedMenu, setMenu] = useSelectedMenu();

export function useSelectedMenu() {
  const [selectedMenu, setSelectedMenu] = useAtom(selectedMenuState);
  const [openTabs, setOpenTabs] = useAtom(openTabsState);
  const menuTree = useAtomValue(menuState);

  const dispatch = useCallback(
    (action: TabSelect | { id: string }) => {
      const { id, isClose } = action as TabSelect;

      if (isClose) {
        const { chagedId, deletedMenuList } = closeTab(openTabs, id, selectedMenu);
        setSelectedMenu(chagedId);
        setOpenTabs(deletedMenuList);
        writeSession("selectedMenu", chagedId);
        writeSession("openTabs", deletedMenuList);
      } else {
        const flatMenuList = M.length > 0 ? flattenMenuTree(M) : flattenMenuTree(menuTree);
        const tmpOpenTabs = openTab(flatMenuList, openTabs, id);
        if (tmpOpenTabs) {
          setSelectedMenu(id);
          setOpenTabs(tmpOpenTabs);
          writeSession("selectedMenu", id);
          writeSession("openTabs", tmpOpenTabs);
        }
      }
    },
    [openTabs, selectedMenu, menuTree, setSelectedMenu, setOpenTabs]
  );

  return [selectedMenu, dispatch] as const;
}
