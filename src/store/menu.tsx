import { atom, selector, DefaultValue } from "recoil";
import type { MenuType, Tab, TabSelect } from "@/types/menu";
import { menuListDummy } from "@/lib/data/menuListDummy";

/**
 * Recoil atom과 sessionStorage를 양방향으로 동기화하는 effect 생성 함수.
 *
 * - 페이지 최초 로드(새로고침 포함) 시 sessionStorage에 저장된 값을 atom 초기값으로 복원.
 * - atom 값이 변경될 때마다 sessionStorage에 자동 저장.
 * - atom이 reset되면 sessionStorage 항목을 삭제.
 *
 * @param key sessionStorage에 저장할 키 이름
 */
function sessionStorageEffect<T>(key: string) {
  return ({ setSelf, onSet }: {
    setSelf: (value: T | DefaultValue) => void;
    onSet: (fn: (newValue: T, oldValue: T | DefaultValue, isReset: boolean) => void) => void;
  }) => {
    // 앱 시작 시 sessionStorage에 저장된 값이 있으면 atom에 복원
    try {
      const saved = sessionStorage.getItem(key);
      if (saved != null) setSelf(JSON.parse(saved));
    } catch { }

    // atom 값이 바뀔 때마다 sessionStorage에 반영
    onSet((newValue, _, isReset) => {
      if (isReset) {
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.setItem(key, JSON.stringify(newValue));
      }
    });
  };
}

/**
 * API 또는 dummy 데이터로 채워지는 전역 메뉴 목록 (평면 배열 또는 중첩 배열).
 * useMenuData 훅의 MenuSet()을 통해 설정되며, Recoil selector에서 메뉴 검색 시 사용.
 */
export let M: MenuType[] = [];

/**
 * 전역 메뉴 목록(M)을 설정한다.
 * useMenuData 훅에서 API 응답 또는 menuListDummy 로드 후 호출.
 */
export const MenuSet = (Menu: MenuType[]) => {
  M = Menu;
};

/**
 * 중첩(트리) 구조의 메뉴 배열을 재귀적으로 순회하여 평면(1차원) 배열로 변환한다.
 *
 * 메뉴 항목이 submenu 배열을 가지고 있으면 하위 항목까지 모두 포함시킨다.
 * API 응답(평면) / menuListDummy(중첩) 모두 처리 가능하도록 항상 이 함수를 거쳐 사용한다.
 *
 * @param menuTree 변환할 메뉴 배열 (중첩 또는 평면)
 * @returns 모든 메뉴 항목이 담긴 평면 배열
 */
export function flattenMenuTree(menuTree: any[]): MenuType[] {
  const result: MenuType[] = [];

  function traverse(items: any[]) {
    for (const item of items) {
      result.push({
        oid: item.id || item.oid,   // API는 id, dummy는 oid 필드 사용
        title: item.title,
        icon: item.icon,
        depth: item.depth,
        parentId: item.parentId || "0",
        path: item.path,
        sortRef: item.sortRef,
      });
      // 하위 메뉴가 있으면 재귀 탐색
      if (item.submenu && Array.isArray(item.submenu)) {
        traverse(item.submenu);
      }
    }
  }

  traverse(menuTree);
  return result;
}

/** 서버에서 불러온 전체 메뉴 트리를 저장하는 atom */
export const menuState = atom<MenuType[]>({
  key: `menu`,
  default: [],
});

/**
 * 현재 열려 있는 탭 목록을 저장하는 atom.
 * sessionStorage와 동기화되어 새로고침 후에도 탭이 유지된다.
 */
export const openTabsState = atom<Tab[]>({
  key: `openTabs`,
  default: [],
  effects: [sessionStorageEffect<Tab[]>("openTabs")],
});

/**
 * 현재 선택(활성화)된 메뉴의 OID를 저장하는 atom.
 * sessionStorage와 동기화되어 새로고침 후에도 선택 상태가 유지된다.
 */
export const selectedMenuState = atom<string>({
  key: `selectedMenu`,
  default: "",
  effects: [sessionStorageEffect<string>("selectedMenu")],
});

/**
 * 탭 열기 / 닫기를 처리하는 selector.
 *
 * - get: 현재 선택된 메뉴 OID 반환 (selectedMenuState 위임)
 * - set: { id, isClose } 형태의 값을 받아 탭을 열거나 닫는다.
 *   - isClose: true  → 해당 탭 닫기 (closeTab 호출)
 *   - isClose: false → 해당 메뉴 탭 열기 또는 포커스 전환 (openTab 호출)
 *
 * 메뉴 검색 우선순위: 전역 M → menuState(Recoil) → menuListDummy
 * 세 경우 모두 flattenMenuTree로 평탄화 후 사용하여 중첩 구조도 처리 가능.
 */
export const selectedMenuSelector = selector({
  key: `selectedMenuSelector`,
  get: ({ get }) => {
    return get(selectedMenuState);
  },
  set: ({ get, set }, newValue: Object) => {
    const { id, isClose } = newValue as TabSelect;
    const openTabs: Tab[] = get(openTabsState);
    const menuTree = get(menuState);
    const preMenuId: string = get(selectedMenuState);

    if (isClose) {
      // 탭 닫기: 닫은 후 활성 탭 ID와 남은 탭 목록 갱신
      const { chagedId, deletedMenuList } = closeTab(openTabs, id, preMenuId);
      set(selectedMenuState, chagedId);
      set(openTabsState, deletedMenuList);
    } else {
      // 탭 열기: M → menuState → menuListDummy 순으로 메뉴 목록 확보
      // M도 중첩 구조일 수 있으므로 항상 flattenMenuTree를 통해 평탄화
      let flatMenuList = M.length > 0 ? flattenMenuTree(M) : flattenMenuTree(menuTree);
      if (flatMenuList.length === 0) {
        flatMenuList = flattenMenuTree(menuListDummy);
      }

      const tmpOpenTabs = openTab(flatMenuList, openTabs, id);
      if (tmpOpenTabs) {
        set(selectedMenuState, id);
        set(openTabsState, tmpOpenTabs);
      }
    }
  },
});

/**
 * 탭을 닫는 로직.
 * 닫은 탭이 현재 선택된 탭이면 마지막 탭으로 포커스를 이동한다.
 * 탭이 모두 닫히면 선택된 메뉴 ID를 빈 문자열로 초기화한다.
 *
 * @param openTabs  현재 열린 탭 목록
 * @param id        닫을 탭의 메뉴 OID
 * @param preMenuId 이전에 선택되어 있던 메뉴 OID
 */
function closeTab(openTabs: Tab[], id: string, preMenuId: string) {
  let chagedId = preMenuId;
  let deletedMenuList = openTabs.filter((menu: Tab) => {
    return menu.id !== id;
  });

  // 닫은 탭이 현재 활성 탭이면 마지막 탭을 새 활성 탭으로 지정
  if (id === preMenuId && deletedMenuList.length > 0) {
    chagedId = deletedMenuList[deletedMenuList.length - 1].id;
    deletedMenuList[deletedMenuList.length - 1] = {
      ...deletedMenuList[deletedMenuList.length - 1],
      isSelected: true,
    };
  }

  // 모든 탭이 닫히면 선택 초기화
  if (deletedMenuList.length === 0) chagedId = "";

  return { chagedId, deletedMenuList };
}

/**
 * 메뉴를 탭으로 여는 로직.
 * 이미 열려 있는 탭이면 해당 탭을 선택(isSelected) 상태로만 전환한다.
 * 열려 있지 않으면 새 탭을 목록에 추가한다.
 *
 * @param menuList 평탄화된 전체 메뉴 목록
 * @param openTabs 현재 열린 탭 목록
 * @param id       열려는 메뉴의 OID
 * @returns 업데이트된 탭 목록, 메뉴를 찾지 못하면 null
 */
function openTab(menuList: MenuType[], openTabs: Tab[], id: string): Tab[] | null {
  let isUse: boolean = false;
  const selectedMenu: MenuType | undefined = menuList.find(
    (menu: MenuType) => menu.oid === id
  );

  if (!selectedMenu) {
    console.warn(`Menu not found with id: ${id}`, { menuList, id });
    return null;
  }

  // 기존 탭 전체를 비활성화하면서, 대상 탭은 활성화
  let tmpOpenTabs = openTabs.map((tab: Tab) => {
    const tmpTab = { ...tab };
    if (tmpTab.id === id) {
      isUse = true;
      return { ...tab, isSelected: true };
    }
    tmpTab.isSelected = false;
    return { ...tab, isSelected: false };
  });

  // 아직 열리지 않은 탭이면 새로 추가
  if (!isUse) {
    tmpOpenTabs = [
      ...tmpOpenTabs,
      {
        id: id,
        menuName: selectedMenu.title,
        path: selectedMenu.path || "",
        isSelected: true,
      },
    ];
  }
  return tmpOpenTabs;
}
