import { useState } from "react";
import { LANGUAGE_VERSIONS } from "./constans";

interface LanguageSelectorProps {
  language: string;
  onSelect: (language: string) => void;
}

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "text-blue-400";

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="ml-2 mb-4">
      <div className="flex items-center mb-2">
        <p className="text-lg mr-4">Select language:</p>
        <button
          className="border-[1px] border-black text-black bg-white text-sm py-2 px-4 rounded-md focus:outline-none"
          onClick={toggleDropdown}
        >
          {language}
        </button>
      </div>
      <div className="relative">
        {isOpen && (
          <div className="absolute mt-1 w-full rounded-md shadow-lg z-10">
            {languages.map(([lang, version]) => (
              <button
                key={lang}
                className={`flex bg-white justify-between w-full px-4 py-2 text-left text-sm ${
                  lang === language ? `${ACTIVE_COLOR}` : "text-black"
                } hover:bg-slate-100`}
                onClick={() => {
                  onSelect(lang);
                  setIsOpen(false);
                }}
              >
                <span>{lang}</span>
                <span className="text-gray-600">({version})</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
