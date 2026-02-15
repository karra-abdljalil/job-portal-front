import { Button } from "../../ui/button";
import { useNavigate } from "react-router-dom";

export const ButtonRedirect = ({ link, buttonName, variant , size  }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link);
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant} 
      size={size}       
    >
      {buttonName}
    </Button>
  );
};
