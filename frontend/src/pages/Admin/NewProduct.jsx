import { useEffect, useState } from "react";
import { FiCheck, FiPlus, FiTrash2, FiUpload, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getBrands } from "../../actions/brandAction";
import { getCategory } from "../../actions/categoryAction";
import { getGenders } from "../../actions/genderAction";
import { getLogos } from "../../actions/logoAction";
import { clearErrors, createProduct } from "../../actions/productAction";
import { getSubcategories } from "../../actions/subcategoryAction";
import { getSubsubcategories } from "../../actions/subsubcategoryAction";
import { getTypes } from "../../actions/typeAction";
import MetaData from "../../component/layout/MetaData";
import { NEW_PRODUCT_RESET } from "../../constants/productContants";
import Sidebar from "./Sidebar";

const NewProduct = () => {
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector((state) => state.newProduct);
  const { categories } = useSelector((state) => state.categories);
  const { subcategories } = useSelector((state) => state.subcategories);
  const { subsubcategories } = useSelector((state) => state.subsubcategories);
  const { types } = useSelector((state) => state.types);
  const { genders } = useSelector((state) => state.genders);
  const { brands } = useSelector((state) => state.brands);
  const { logos } = useSelector((state) => state.logos);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    listItems: [],
    type: "",
    gender: "",
    brand: "",
    deliveryCharge: "",
    show: "",
    oldPrice: "",
    salePrice: "",
    buyPrice: "",
    sizes: [],
    availability: "inStock", // Fixed: Changed from "available" to "inStock"
    quantity: "",
    sold: "",
    weight: "",
    colors: [], // Fixed: Changed from "color" to "colors" array
    category: "",
    subCategory: "",
    subsubCategory: "",
    videoLink: "",
    source: "",
    logos: [],
  });

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [customSizeInput, setCustomSizeInput] = useState("");
  const [selectedStandardSize, setSelectedStandardSize] = useState("");

  const [listItems, setListItems] = useState([""]);
  const [listItemInput, setListItemInput] = useState("");
  const [colorInput, setColorInput] = useState(""); // Added for colors input

  const [selectedLogos, setSelectedLogos] = useState([]); // Full logo objects for display

  // Standard size options
  const standardSizeOptions = [
    { value: "XS", label: "XS" },
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" },
    { value: "32", label: "32" },
    { value: "34", label: "34" },
    { value: "36", label: "36" },
    { value: "38", label: "38" },
    { value: "40", label: "40" },
    { value: "42", label: "42" },
    { value: "44", label: "44" },
    { value: "500ml", label: "500ml" },
    { value: "1L", label: "1L" },
    { value: "1.5L", label: "1.5L" },
    { value: "2L", label: "2L" },
  ];

  useEffect(() => {
    dispatch(getCategory());
    dispatch(getSubcategories());
    dispatch(getSubsubcategories());
    dispatch(getTypes());
    dispatch(getBrands());
    dispatch(getGenders());
    dispatch(getLogos());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Product created successfully");
      dispatch({ type: NEW_PRODUCT_RESET });
      resetForm();
    }
  }, [dispatch, error, success]);

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      description: "",
      listItems: [],
      type: "",
      gender: "",
      brand: "",
      deliveryCharge: "",
      show: "",
      oldPrice: "",
      salePrice: "",
      buyPrice: "",
      sizes: [],
      availability: "inStock", // Fixed
      quantity: "",
      sold: "",
      weight: "",
      colors: [], // Fixed
      category: "",
      subCategory: "",
      subsubCategory: "",
      videoLink: "",
      source: "",
      logos: [],
    });
    setImages([]);
    setImagesPreview([]);
    setCustomSizeInput("");
    setSelectedStandardSize("");
    setListItems([""]);
    setListItemInput("");
    setColorInput(""); // Reset color input
    setSelectedLogos([]); // ✅ রিসেট
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      // ✅ Changed from "productType" to "type"
      // ✅ Product type change হলে logo selection রিসেট
      setFormData({
        ...formData,
        [name]: value,
        logos: value === "custom" ? formData.logos : [],
      });

      if (value !== "custom") {
        setSelectedLogos([]);
      }
    } else if (name === "availability") {
      const newQuantity = value === "inStock" ? formData.quantity : "0";
      setFormData({
        ...formData,
        [name]: value,
        quantity: newQuantity,
      });
    } else if (name === "weight") {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // ✅ Logo selection handlers - FIXED
  const handleLogoSelect = (logoId) => {
    setSelectedLogos((prev) => {
      const newSelectedLogos = prev.includes(logoId)
        ? prev.filter((id) => id !== logoId)
        : [...prev, logoId];

      // Update formData with logo IDs
      setFormData({
        ...formData,
        logos: newSelectedLogos,
      });

      return newSelectedLogos;
    });
  };

  // ✅ Remove logo from selection - FIXED
  const removeLogoFromSelection = (logoId) => {
    const newSelectedLogos = selectedLogos.filter((id) => id !== logoId);
    setSelectedLogos(newSelectedLogos);

    setFormData({
      ...formData,
      logos: newSelectedLogos,
    });

    toast.info("Logo removed from product");
  };
  // Add standard size to the sizes array
  const addStandardSize = () => {
    if (
      selectedStandardSize &&
      !formData.sizes.includes(selectedStandardSize)
    ) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, { name: selectedStandardSize, price: 0 }],
      });
      setSelectedStandardSize("");
    }
  };

  // Add custom size to the sizes array
  const addCustomSize = () => {
    if (
      customSizeInput.trim() &&
      !formData.sizes.includes(customSizeInput.trim())
    ) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, { name: customSizeInput.trim(), price: 0 }],
      });

      setCustomSizeInput("");
    }
  };

  // Remove size from the sizes array
  const removeSize = (name) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((s) => s.name !== name),
    });
  };

  // Add a color to the colors array
  const addColor = () => {
    if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
      setFormData({
        ...formData,
        colors: [...formData.colors, { name: colorInput.trim(), price: 0 }],
      });

      setColorInput("");
    }
  };

  // Remove a color from the colors array
  const removeColor = (name) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((c) => c.name !== name),
    });
  };

  // Add a new list item
  const addListItem = () => {
    if (listItemInput.trim()) {
      setListItems([...listItems, listItemInput.trim()]);
      setListItemInput("");
    }
  };

  // Remove a list item
  const removeListItem = (index) => {
    const newListItems = [...listItems];
    newListItems.splice(index, 1);
    setListItems(newListItems);
  };

  // Update a list item
  const updateListItem = (index, value) => {
    const newListItems = [...listItems];
    newListItems[index] = value;
    setListItems(newListItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.type === "custom" && selectedLogos.length === 0) {
      toast.error("Please select at least one logo for custom products");
      return;
    }
    const data = new FormData();

    data.set("name", formData.name);
    data.set("title", formData.title);
    data.set("description", formData.description);

    // Fixed: Send listItems as array properly
    listItems
      .filter((item) => item.trim())
      .forEach((item) => {
        data.append("listItems", item);
      });

    data.set("type", formData.type);
    data.set("gender", formData.gender);
    data.set("brand", formData.brand);
    data.set("source", formData.source);
    data.set("deliveryCharge", formData.deliveryCharge);
    data.set("show", formData.show);
    if (formData.videoLink) data.set("videoLink", formData.videoLink);
    data.set("oldPrice", formData.oldPrice);
    data.set("salePrice", formData.salePrice);
    data.set("buyPrice", formData.buyPrice);

    // Fixed: Send sizes as array properly
    data.append("sizes", JSON.stringify(formData.sizes));

    // Fixed: Send colors as array properly
    data.append("colors", JSON.stringify(formData.colors));

    data.set("availability", formData.availability);

    // Fixed quantity logic
    const finalQuantity =
      formData.availability === "inStock" ? formData.quantity : 0;
    data.set("quantity", finalQuantity);

    data.set("weight", formData.weight);
    data.set("sold", formData.sold);
    // ✅ Logo IDs append করুন
    formData.logos.forEach((logoId) => {
      data.append("logos", logoId);
    });
    // Get category names
    const selectedCategory = categories.find(
      (cat) => cat._id === formData.category
    );
    if (selectedCategory) {
      data.set("category", selectedCategory.name);
    }

    // Get subcategory name
    if (formData.subCategory) {
      const selectedSubCategory = subcategories.find(
        (sub) => sub._id === formData.subCategory
      );
      if (selectedSubCategory) {
        data.set("subCategory", selectedSubCategory.name);
      }
    }

    // Get subsubcategory name
    if (formData.subsubCategory) {
      const selectedSubsubCategory = subsubcategories.find(
        (subsub) => subsub._id === formData.subsubCategory
      );
      if (selectedSubsubCategory) {
        data.set("subsubCategory", selectedSubsubCategory.name);
      }
    }

    images.forEach((img) => {
      data.append("images", img);
    });

    dispatch(createProduct(data));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, file]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImagesPreview = [...imagesPreview];
    newImagesPreview.splice(index, 1);
    setImagesPreview(newImagesPreview);

    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div className="min-h-screen container bg-gray-50">
      <MetaData title="Create New Product" />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Create New Product
            </h1>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 lg:mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Product Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Title <span className="text-red-500"></span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter product title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub Category
                  </label>
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">-- Select Sub Category --</option>
                    {subcategories?.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub Sub Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub Sub Category
                  </label>
                  <select
                    name="subsubCategory"
                    value={formData.subsubCategory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">-- Select Sub Sub Category --</option>
                    {subsubcategories?.map((subsub) => (
                      <option key={subsub._id} value={subsub._id}>
                        {subsub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">-- Select Product Type --</option>
                    <option value="custom">Custom</option>
                    {types &&
                      types.map((type) => (
                        <option key={type._id} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Product Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Brand
                  </label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">-- Select Product Brand --</option>
                    {brands &&
                      brands.map((brand) => (
                        <option key={brand._id} value={brand.name}>
                          {brand.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Product Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">-- Select Product Gender --</option>
                    {genders &&
                      genders.map((gender) => (
                        <option key={gender._id} value={gender.name}>
                          {gender.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Prices */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="oldPrice"
                    placeholder="Enter original price"
                    required
                    value={formData.oldPrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="salePrice"
                    placeholder="Enter sale price"
                    required
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buy Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="buyPrice"
                    placeholder="Enter buy price"
                    required
                    value={formData.buyPrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Charge <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="deliveryCharge"
                    value={formData.deliveryCharge}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">-- Select Delivery Option --</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Show<span className="text-red-500">*</span>
                  </label>
                  <select
                    name="show"
                    value={formData.show}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">-- Select Show Option --</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="inStock">In Stock</option>
                    <option value="outOfStock">Out of Stock</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                {/* Quantity */}
                {formData.availability === "inStock" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      placeholder="Enter quantity"
                      required
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sold
                  </label>
                  <input
                    type="number"
                    name="sold"
                    placeholder="0"
                    value={formData.sold}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="text"
                    name="weight"
                    placeholder="e.g. 0.3, 1, 2.5"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter weight in kilograms (numbers only, e.g., 0.3, 1, 2.5)
                  </p>
                </div>

                {/* Video Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <input
                    type="text"
                    name="source"
                    placeholder="Enter Product Source"
                    value={formData.source}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="videoLink"
                    placeholder="Enter YouTube video link"
                    value={formData.videoLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              {/* Logo Selection Section - Only show when type is "custom" */}
              {formData.type === "custom" && (
                <div className="border-t pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Select Logos for Custom Product{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  {logos && logos.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {logos.map((logo) => (
                          <div
                            key={logo._id}
                            className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${
                              selectedLogos.includes(logo._id)
                                ? "border-indigo-500 bg-indigo-50"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                            onClick={() => handleLogoSelect(logo._id)}
                          >
                            {logo.image && logo.image.url ? (
                              <img
                                src={logo.image.url}
                                alt="Logo"
                                className="w-full h-20 object-contain"
                              />
                            ) : (
                              <div className="w-full h-20 flex items-center justify-center bg-gray-100 text-gray-400">
                                No Image
                              </div>
                            )}

                            {selectedLogos.includes(logo._id) && (
                              <div className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full p-1">
                                <FiCheck size={12} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Selected Logos Display */}
                      {selectedLogos.length > 0 && (
                        <div className="mt-6">
                          <h3 className="font-medium text-gray-800 mb-3">
                            Selected Logos ({selectedLogos.length}):
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {selectedLogos.map((logoId) => {
                              const logo = logos.find((l) => l._id === logoId);
                              return (
                                <div
                                  key={logoId}
                                  className="relative bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
                                >
                                  <div className="flex items-center gap-3">
                                    {/* Logo Image */}
                                    {logo?.image?.url ? (
                                      <img
                                        src={logo.image.url}
                                        alt="Selected Logo"
                                        className="w-12 h-12 object-contain border border-gray-200 rounded"
                                      />
                                    ) : (
                                      <div className="w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-400 border border-gray-200 rounded">
                                        <FiX size={16} />
                                      </div>
                                    )}

                                    {/* Remove Button */}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeLogoFromSelection(logoId)
                                      }
                                      className="text-red-500 hover:text-red-700 cursor-pointer p-1 hover:bg-red-50 rounded-full transition-colors"
                                      title="Remove logo"
                                    >
                                      <FiX size={16} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No logos available. Please add logos first.
                    </div>
                  )}
                </div>
              )}
              {/* Size Selection Section */}
              <div className="border-t pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Sizes
                </label>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Standard Sizes */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-800">
                      Standard Sizes
                    </h3>
                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2">
                      {standardSizeOptions.map((size) => (
                        <label
                          key={size.value}
                          className={`flex items-center p-2 sm:p-3 border rounded-lg cursor-pointer transition-colors text-sm sm:text-base ${
                            selectedStandardSize === size.value
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <input
                            type="radio"
                            name="standardSize"
                            value={size.value}
                            checked={selectedStandardSize === size.value}
                            onChange={(e) =>
                              setSelectedStandardSize(e.target.value)
                            }
                            className="mr-2"
                          />
                          {size.label}
                        </label>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addStandardSize}
                      disabled={!selectedStandardSize}
                      className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto"
                    >
                      <FiPlus size={16} /> Add Selected Size
                    </button>
                  </div>

                  {/* Custom Sizes */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-800">Custom Sizes</h3>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="Enter custom size"
                        value={customSizeInput}
                        onChange={(e) => setCustomSizeInput(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                      />
                      <button
                        type="button"
                        onClick={addCustomSize}
                        disabled={!customSizeInput.trim()}
                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto"
                      >
                        <FiPlus size={16} /> Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selected Sizes Display */}
                {formData.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {formData.sizes.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-indigo-100 px-3 py-1 rounded-lg"
                      >
                        <span className="font-semibold">{item.name}</span>

                        <input
                          type="number"
                          value={item.price}
                          placeholder="0"
                          onChange={(e) => {
                            const newSizes = [...formData.sizes];
                            newSizes[index].price = Number(e.target.value);
                            setFormData({ ...formData, sizes: newSizes });
                          }}
                          className="w-20 px-2 py-1 border border-gray-300 rounded"
                        />

                        <span className="text-sm">৳</span>

                        <FiTrash2
                          className="text-red-500 cursor-pointer"
                          onClick={() => removeSize(item.name)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Colors Section - Similar to Sizes */}
              <div className="border-t pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Colors
                </label>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Enter color (e.g., red, white, multi)"
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addColor}
                      disabled={!colorInput.trim()}
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <FiPlus size={16} /> Add Color
                    </button>
                  </div>

                  {/* Selected Colors Display */}
                  {formData.colors.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {formData.colors.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-lg"
                        >
                          <span className="font-semibold">{item.name}</span>

                          <input
                            type="number"
                            value={item.price}
                            placeholder="0"
                            onChange={(e) => {
                              const newColors = [...formData.colors];
                              newColors[index].price = Number(e.target.value);
                              setFormData({ ...formData, colors: newColors });
                            }}
                            className="w-20 px-2 py-1 border border-gray-300 rounded"
                          />

                          <span className="text-sm">৳</span>

                          <FiTrash2
                            className="text-red-500 cursor-pointer"
                            onClick={() => removeColor(item.name)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Enter product description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* List Items Section */}
              <div className="border-t pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Key Features (Optional)
                </label>

                <div className="space-y-3">
                  {listItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-gray-500">•</span>
                      <input
                        type="text"
                        placeholder={`Feature ${index + 1}`}
                        value={item}
                        onChange={(e) => updateListItem(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      {listItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeListItem(index)}
                          className="text-red-500 hover:text-red-700 cursor-pointer p-2"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}

                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <input
                      type="text"
                      placeholder="Add a new feature"
                      value={listItemInput}
                      onChange={(e) => setListItemInput(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addListItem}
                      disabled={!listItemInput.trim()}
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <FiPlus size={16} /> Add Feature
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Images <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <label className="flex flex-col items-center justify-center w-full sm:w-48 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                    <FiUpload className="text-gray-400 mb-2" size={24} />
                    <span className="text-sm text-gray-500 text-center">
                      {imagesPreview.length
                        ? "Add More Images"
                        : "Upload Images"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesChange}
                      className="hidden"
                      required={imagesPreview.length === 0}
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {imagesPreview.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Preview ${index}`}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg border object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FiX size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 cursor-pointer rounded-lg text-white font-semibold flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <FiPlus size={18} /> Create Product
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
