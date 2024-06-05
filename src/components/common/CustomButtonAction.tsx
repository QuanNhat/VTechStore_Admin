import IcPen from "@/assets/icons/ic_pen.svg";
import IcTrash from "@/assets/icons/ic_trash.svg";

interface IProps {
  onClick: () => void;
}
export const ButtonEdit = ({ onClick }: IProps) => {
  return (
    <button
      className="flex items-center justify-center rounded-full sm-max:bg-[#1890FF14] sm-max:h-9 sm-max:w-9"
      onClick={onClick}
    >
      <img src={IcPen} alt="IcPen" className="w-5 h-5" />
    </button>
  );
};

export const ButtonDelete = ({ onClick }: IProps) => {
  return (
    <button
      className="flex items-center justify-center rounded-full sm-max:bg-[#1890FF14] sm-max:h-9 sm-max:w-9"
      onClick={onClick}
    >
      <img src={IcTrash} alt="IcTrash" className="w-5 h-5" />
    </button>
  );
};
