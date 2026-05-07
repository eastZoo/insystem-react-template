import styled from "styled-components";

export const HeaderSection = styled.header`
  grid-area: HD;
  display: flex;
  padding: 13px 16px;
  background: #0C4CA3;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderTitle = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 24px;
  color: #FFFFFF;
  text-transform: uppercase;
  margin: 0;
`;

export const HeaderUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const UserInfoText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const UserRole = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: #FFFFFF;
`;

export const UserDivider = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1px;
  height: 13px;
  background: rgba(255, 255, 255, 0.5);
`;

export const UserId = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: #FFFFFF;
`;

export const UserIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  cursor: pointer;

  svg {
    width: 20px;
    height: 22px;

    path {
      fill: #FFFFFF;
    }
  }

  &:hover {
    opacity: 0.8;
  }
`;

// 레거시 지원용 (사이드메뉴 버튼)
export const HeaderSidemenuBtn = styled.button`
  display: flex;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;

  svg {
    path {
      fill: #FFFFFF;
    }
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;
