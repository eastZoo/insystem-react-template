import { Modals } from "@/components/organisms/Modals";
import DaumPostcode from "react-daum-postcode";

export const PostCode = (props: any) => {
  const onComplete = (data: any) => {
    props.isComplete(data);
  };

  return (
    <Modals modalTitle="우편번호 찾기" setModalShow={props.close} width={25}>
      <DaumPostcode onComplete={onComplete} />
    </Modals>
  );
};
