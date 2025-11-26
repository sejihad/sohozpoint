// src/component/product/LogoPositionSelector.jsx

const LogoPositionSelector = ({
  selectedPosition,
  onPositionChange,
  selectedLogos,
}) => {
  const positions = [
    { value: "front", label: "Front ", icon: "👕" },
    { value: "back", label: "Back ", icon: "👕" },
  ];

  const isPositionTaken = (position) => {
    return selectedLogos.some((logo) => logo.position === position);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 border border-gray-200 mt-4">
      <h4 className="font-medium text-gray-700 mb-3">
        Select Logo Position: <span className="text-red-500">*</span>
        <span className="text-xs text-gray-500 ml-2">
          (Max: 1 Front + 1 Back)
        </span>
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {positions.map((position) => {
          const isTaken = isPositionTaken(position.value);
          const isSelected = selectedPosition === position.value;

          return (
            <button
              key={position.value}
              onClick={() => onPositionChange(position.value)}
              disabled={isTaken && !isSelected}
              className={`p-3 border-2 rounded-lg text-center transition-all ${
                isSelected
                  ? "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200"
                  : isTaken
                  ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 hover:border-green-300 hover:shadow-md"
              }`}
              type="button"
            >
              <div className="text-2xl mb-1">{position.icon}</div>
              <span className="text-xs font-medium">{position.label}</span>
              {isTaken && (
                <span className="text-xs text-red-500 block mt-1">
                  selected
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LogoPositionSelector;
