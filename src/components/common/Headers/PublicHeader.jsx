import { ButtonRedirect } from "../Ui/ButtonRedirect";
import jobIcon from "../../../assets/searchjob.png";

export const PublicHeader = () => {
  return (
   <header className=" mx-6 my-4  px-6 py-2
  bg-white
  border border-gray-200 
  rounded-3xl 
  shadow-sm 
  flex items-center justify-between">

  {/* Logo */}
  <div className="flex items-center gap-3">
    <img
      src={jobIcon}
      alt="JobPortal logo"
      className="h-9 w-9 object-contain"
    />
    <span className="text-xl font-semibold tracking-tight text-gray-800">
      Job<span className="text-blue-600">Portal</span>
    </span>
  </div>

  {/* Navigation */}
  <nav className="flex items-center gap-6">
    <ButtonRedirect
      link={'/features'}
      buttonName={'Features'}
      style={'capitalize font-semibold text-gray-700 bg-white px-6 py-3  hover:shadow-md hover:text-blue-600 hover:bg-white'}
    />

    <ButtonRedirect
      link={'/register?role=employer'}
      buttonName={'For Employers'}
      style={'capitalize font-semibold text-gray-700 bg-white px-6 py-3 hover:shadow-md hover:text-blue-600 hover:bg-white'}
    />

    <ButtonRedirect
      link={'/register?role=job_seeker'}
      buttonName={'For Job Seekers'}
      style={'capitalize font-semibold text-gray-700 bg-white px-6 py-3  hover:shadow-md hover:text-blue-600 hover:bg-white'}
    />
  </nav>

  {/* Login Button */}
  <div>
    <ButtonRedirect
      link={"/login"}
      buttonName={"Login"}
      style={'text-sm font-semibold text-white bg-blue-600 px-5 py-2.5 rounded-xl shadow-sm hover:bg-blue-700 hover:shadow-md transition-all duration-300'}
    />
  </div>

</header>
  );
};
