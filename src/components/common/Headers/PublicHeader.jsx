import { ButtonRedirect } from "../Ui/ButtonRedirect";
import jobIcon from "../../../assets/searchjob.png";

export const PublicHeader = () => {
  return (
    <header className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      
      <div className="flex items-center gap-3">
        <img
          src={jobIcon}
          alt="JobPortal logo"
          className="h-10 w-10 object-contain text-blue-700"
        />
        <span className="text-xl font-bold text-gray-800">
          Job<span className="text-sky-700">Portal</span> 
        </span>
      </div>

      <div className="flex items-center gap-4">
        <ButtonRedirect
          link={"/login"}
          buttonName={"Login"}
          style={"bg-blue-800 text-white px-5 py-2 rounded-lg hover:bg-sky-400 transition"}
        />
      </div>

    </header>
  );
};
