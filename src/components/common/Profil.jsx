import { ButtonRedirect } from "./Ui/ButtonRedirect";

export const Profil = ({
  src,
  alt,
  buttonName_button,
  buttonName_join,
  styleButton,
  sous_title,
  para,
  list = [],
  JoinStyle,
  redirectionto,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300 " >
      {/* Top section: image + badge button */}
      <div className="flex items-center justify-between">
        {/* Left: icon + title */}
        <div className="flex items-center gap-3">
          <img src={src} alt={alt} className="h-12 w-12 object-contain" />
          <h3 className="text-xl font-semibold capitalize text-gray-950">
            {sous_title}
          </h3>
        </div>

        {/* Right: action button */}
        <ButtonRedirect
          link="/register"
          buttonName={buttonName_button}
          style={styleButton}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3">
        <p className="text-gray-600 text-m leading-relaxed">{para}</p>

        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
          {list.map((l, index) => (
            <li key={index}>{l}</li>
          ))}
        </ul>
      </div>

      {/* Bottom action */}
      <div className="mt-auto">
        <ButtonRedirect
          link={redirectionto}
          buttonName={buttonName_join}
          style={JoinStyle}
        />
      </div>
    </div>
  );
};
