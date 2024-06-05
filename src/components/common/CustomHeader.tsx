import { useNavigate } from "react-router-dom";

interface IProps {
  title: string;
  children?: React.ReactNode;
}

const CustomHeader: React.FC<IProps> = ({ title = "", children }) => {
  const router = useNavigate();

  const handleBack = () => {
    router(-1);
  };

  return (
    <div className="flex items-center justify-between pr-5">
      <h1 className="text-[28px] font-semibold">{title}</h1>
      {children}
    </div>
  );
};

export default CustomHeader;
