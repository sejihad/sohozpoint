// src/component/product/LogoSelector.jsx
import { useRef } from "react";
import { FaPalette, FaUpload } from "react-icons/fa";
import { toast } from "sonner";
import LogoPositionSelector from "./LogoPositionSelector";

const LogoSelector = ({
  logos,
  selectedLogos,
  onLogoSelect,
  onCustomLogoUpload,
  logoCharge,
  selectedPosition,
  onPositionChange,
  onRemoveLogo,
}) => {
  const fileInputRef = useRef(null);

  const handleCustomLogoClick = () => {
    if (!selectedPosition) {
      toast.error("Please select logo position first");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        onCustomLogoUpload(event.target.result, file, selectedPosition);
      };
      reader.readAsDataURL(file);
    }
  };

  const getSelectedLogoForPosition = (position) => {
    return selectedLogos.find((logo) => logo.position === position);
  };

  const canAddMoreLogos = selectedLogos.length < 2;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mt-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <FaPalette className="mr-2 text-green-600" />
        Add Custom Logo
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({selectedLogos.length}/2 selected)
        </span>
      </h3>

      <LogoPositionSelector
        selectedPosition={selectedPosition}
        onPositionChange={onPositionChange}
        selectedLogos={selectedLogos}
      />

      {selectedPosition && canAddMoreLogos && (
        <div className="mb-6 mt-4">
          <h4 className="font-medium text-gray-700 mb-3">
            Select logo for {selectedPosition.replace("-", " ")}:
          </h4>
          <div className="max-h-[130px] overflow-y-auto">
            <div className="grid grid-cols-3 gap-3">
              {logos && logos.length > 0 ? (
                logos.map((logo) => {
                  const isSelected =
                    getSelectedLogoForPosition(selectedPosition)?._id ===
                    logo._id;

                  return (
                    <button
                      key={logo._id}
                      onClick={() => onLogoSelect(logo, selectedPosition)}
                      className={`p-2 border-2 rounded-lg transition-all duration-200 group ${
                        isSelected
                          ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                          : "border-gray-200 hover:border-green-300 hover:shadow-md"
                      }`}
                      type="button"
                    >
                      <div className="w-full h-16 flex items-center justify-center">
                        <img
                          src={logo.image?.url || "/placeholder-image.jpg"}
                          alt={logo.name}
                          className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-200"
                          onError={(e) =>
                            (e.target.src = "/placeholder-image.jpg")
                          }
                        />
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {logo.name}
                      </p>

                      <p className="text-sm font-semibold text-green-600">
                        +৳
                        {logo.isCustom
                          ? logoCharge?.price || 0
                          : logo.price || 0}
                      </p>
                    </button>
                  );
                })
              ) : (
                <div className="col-span-3 text-center py-4 text-gray-500">
                  No logos available
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedPosition && canAddMoreLogos && (
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-3">
            Or upload custom logo for {selectedPosition.replace("-", " ")}:
          </h4>
          <button
            onClick={handleCustomLogoClick}
            className="w-full py-4 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-200 flex flex-col items-center justify-center group"
            type="button"
          >
            <FaUpload className="text-2xl text-gray-400 mb-2 group-hover:text-green-500" />
            <span className="text-sm text-gray-600 group-hover:text-green-600">
              Upload Custom Logo
            </span>
            {logoCharge && logoCharge.price > 0 && (
              <span className="text-xs text-green-600 font-medium mt-1">
                Additional charge: ৳{logoCharge.price}
              </span>
            )}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}

      {!canAddMoreLogos && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            ✅ Maximum 2 logos selected (1 Front + 1 Back)
          </p>
        </div>
      )}

      {selectedLogos.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">
            Selected Logos ({selectedLogos.length}/2):
          </h4>
          {selectedLogos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-between mb-2 last:mb-0 p-2 bg-white rounded"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 mr-3">
                  <img
                    src={logo.image?.url}
                    alt={logo.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {logo.isCustom ? "Custom Logo" : logo.name}
                  </p>
                  <p className="text-xs text-gray-600 capitalize">
                    {logo.position.replace("-", " ")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">
                  +৳{logo.isCustom ? logoCharge?.price || 0 : logo.price || 0}
                </p>

                <button
                  onClick={() => onRemoveLogo(index)}
                  className="text-xs text-red-500 hover:text-red-700 mt-1"
                  type="button"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogoSelector;
