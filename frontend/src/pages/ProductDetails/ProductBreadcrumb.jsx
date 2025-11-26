const ProductBreadcrumb = ({ category, name, isCustomProduct }) => {
  return (
    <nav className="text-sm text-gray-500 mb-6">
      <span>Home / </span>
      <span>{category} / </span>
      <span className="text-gray-800">{name}</span>

      {isCustomProduct && (
        <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
          Custom
        </span>
      )}
    </nav>
  );
};

export default ProductBreadcrumb;
