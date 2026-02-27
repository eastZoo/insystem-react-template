import { Table } from "../../Table";
import { Buttons } from "../../../atoms/Buttons";
import { ExplainText } from "../../../atoms/ExplainText";
import { ModalProps, Modals } from "..";
import { ReactComponent as IconClose } from "../../../../styles/assets/svg/icon_close.svg";

export const ModalUserAuth = (props: ModalProps) => {
  return (
    <Modals
      modalTitle={
        <>
          메뉴별 설명{" "}
          <Buttons
            type="button"
            size="md"
            layout="icon"
            icon={<IconClose width={12} height={12} />}
            onClick={() => props.setModalShow(false)}
          />
        </>
      }
      setModalShow={props.setModalShow}
    >
      <>
        <ExplainText>
          <>
            ※ 아래 권한 메뉴는 육상용 상태진단체계 웹 페이지에서 사용하는
            작성/등록, 수정(편집), 삭제 버튼 및 아이콘을 기준으로
            정의하였습니다.
          </>
        </ExplainText>
        <Table
          thead={[
            { id: 1, name: "메뉴" },
            { id: 2, name: "설명" },
          ]}
        >
          <>
            <tr>
              <td>사용</td>
              <td>
                <div className="td_left">좌측 메뉴 트리에 표시 여부 선택</div>
              </td>
            </tr>
            <tr>
              <td>작성/등록</td>
              <td>
                <div className="td_left">
                  '작성'은 사용자가 웹 사이트에서 제공되는 템플릿을 활용하여
                  새로운 콘텐츠를 작성하는 권한
                  <br />
                  (예 : 보고서 작성, 차트 생성 등)
                  <br />
                  '등록'은 사용자가 새로운 정보, 파일을 등록하는 권한 (예 : 함정
                  정보, 사용자 정보, 보고서 파일, 참고 파일 등)
                </div>
              </td>
            </tr>
            <tr>
              <td>편집</td>
              <td>
                <div className="td_left">
                  사용자가 자신이 작성한 콘텐츠를 수정할 수 있는 권한 (예 :
                  보고서 편집, 차트 수정 등)
                </div>
              </td>
            </tr>
            <tr>
              <td>삭제</td>
              <td>
                <div className="td_left">
                  사용자가 등록한 파일 또는 작성한 콘텐츠를 삭제할 수 있는 권한
                </div>
              </td>
            </tr>
            <tr>
              <td>읽기</td>
              <td>
                <div className="td_left">오로지 읽기 권한</div>
              </td>
            </tr>
          </>
        </Table>
      </>
    </Modals>
  );
};
