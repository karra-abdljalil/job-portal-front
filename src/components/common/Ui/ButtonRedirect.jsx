import { Button } from "../../ui/button";
import { useNavigate } from "react-router-dom";

export const ButtonRedirect = ({ link, buttonName, style }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link);
  };

  return (
    <Button
      onClick={handleClick}
      className={style}      
    >
      {buttonName}
    </Button>
  );
};
