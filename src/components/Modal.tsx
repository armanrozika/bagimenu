import { AiOutlineCloseCircle } from "react-icons/ai";
import { ProductType } from "../types/types";

function Modal({
  setShowModal,
  activeProduct,
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  activeProduct: ProductType | undefined;
}) {
  return (
    <div
      className="w-full h-full bg-[rgb(0,0,0,0.4)] fixed top-0 left-0 z-20"
      onClick={() => {
        setShowModal(false);
      }}
    >
      <div className="flex flex-col h-full justify-center items-center">
        <div
          onClickCapture={(e) => e.stopPropagation()}
          className="bg-white p-5 rounded-xl max-w-[350px]"
        >
          <img src={activeProduct?.image_url} alt="" className="mx-auto" />
          <p className="mt-3 text-hitampudar font-semibold">
            {activeProduct?.name}
          </p>
          <p className="text-hitampudar mt-2 border border-gray-300 p-3 rounded-lg">
            {activeProduct?.notes}
          </p>
        </div>
        <AiOutlineCloseCircle
          className="text-white text-3xl mt-3 cursor-pointer"
          onClick={() => {
            setShowModal(false);
          }}
        />
      </div>
    </div>
  );
}

export default Modal;
