import React, { useState } from "react";
import {
  ChakraProvider,
  CSSReset,
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  VStack,
  Collapse,
} from "@chakra-ui/react";
import axios from "axios";

const categories = ["Ring", "Necklace", "Wristband"];
const ringTypes = ["Alliance", "Signet"];
const otherTypes = ["Anchor", "Beehive"];
const brands = ["BNH", "Pandora"];
const metals = ["Gold", "White gold", "Rose gold", "Silver"];
const stoneTypes = ["Diamond", "Pearls"];
const stoneColors = ["Red", "White"];

const ProductForm = () => {
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [metal, setMetal] = useState("");
  const [showLengthWidth, setShowLengthWidth] = useState(false);
  const [showRingSize, setShowRingSize] = useState(false);
  const [showStoneDetails, setShowStoneDetails] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);

  const getCaratOptions = () => {
    if (metal === "Silver") {
      return ["Sterling", "Tretårnet"];
    } else {
      return ["24", "21", "18", "14"];
    }
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setType("");
    setShowLengthWidth(value !== "Ring");
    setShowRingSize(value === "Ring");
    setShowStoneDetails(value === "Ring");
  };

  const handleMetalChange = (value) => {
    setMetal(value);
  };

  const removeEmptyValues = (obj) => {
    const newObj = {};

    Object.keys(obj).forEach((key) => {
      const prop = obj[key];
      const isFromToProperty =
        prop &&
        typeof prop === "object" &&
        Object.prototype.hasOwnProperty.call(prop, "from") &&
        Object.prototype.hasOwnProperty.call(prop, "to");

      if (isFromToProperty) {
        if (prop.from !== "" && prop.to === "") {
          obj[key].to = prop.from;
        } else if (prop.to !== "" && prop.from === "") {
          obj[key].from = prop.to;
        }
      }
    });

    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "object") {
          const cleanedValue = removeEmptyValues(value);
          if (Object.keys(cleanedValue).length > 0) {
            newObj[key] = cleanedValue;
          }
        } else if (value !== "" && value !== 0) {
          newObj[key] = value;
        }
      }
    });
    return newObj;
  };

  const handleSubmit = async () => {
    const isFormValid = validateForm();

    if (isFormValid) {
      const formData = {
        category,
        type,
        length: {
          from: document.getElementById("lengthFrom").value,
          to: document.getElementById("lengthTo").value,
        },
        width: {
          from: document.getElementById("widthFrom").value,
          to: document.getElementById("widthTo").value,
        },
        weight: {
          from: document.getElementById("weightFrom").value,
          to: document.getElementById("weightTo").value,
        },
        metal,
        carat: document.getElementById("carat").value,
        brand: document.getElementById("brand").value,
        price: {
          from: document.getElementById("priceFrom").value,
          to: document.getElementById("priceTo").value,
        },
        ringSize: {
          from: document.getElementById("ringSizeFrom").value,
          to: document.getElementById("ringSizeTo").value,
        },
        stoneType: document.getElementById("stoneType").value,
        stoneColor: document.getElementById("stoneColor").value,
      };

      const cleanedForm = removeEmptyValues(formData);

      const finalData = {
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        name: document.getElementById("name").value,
        filter: { ...cleanedForm },
      };

      try {
        // Make the post request using Axios
        const response = await axios.post(
          "http://localhost:3002/search-agent",
          finalData
        );

        // Handle the response as needed
        console.log("Post request successful:", response.data);
      } catch (error) {
        // Handle errors
        console.error("Error making post request:", error);
      }
    } else {
      console.log("Form is not valid. Please fill in all required fields.");
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "email",
      "phone",
      "name",
      // Add other required fields here
    ];

    const isFormValid = requiredFields.every((field) => {
      const fieldValue = document.getElementById(field).value;
      return fieldValue.trim() !== "";
    });

    setIsFormValid(isFormValid);

    return isFormValid;
  };

  return (
    <ChakraProvider>
      <CSSReset />
      <Box p={4} id="productForm">
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Category</FormLabel>
            <Select
              placeholder="Select category"
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Type</FormLabel>
            <Select
              placeholder="Select type"
              onChange={(e) => setType(e.target.value)}
            >
              {category === "Ring"
                ? ringTypes.map((ringType) => (
                    <option key={ringType} value={ringType}>
                      {ringType}
                    </option>
                  ))
                : otherTypes.map((otherType) => (
                    <option key={otherType} value={otherType}>
                      {otherType}
                    </option>
                  ))}
            </Select>
          </FormControl>

          <Collapse in={showLengthWidth}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Length</FormLabel>
                <Input id="lengthFrom" type="number" placeholder="From" />
                <Input id="lengthTo" type="number" placeholder="To" />
              </FormControl>

              <FormControl>
                <FormLabel>Width</FormLabel>
                <Input id="widthFrom" type="number" placeholder="From" />
                <Input id="widthTo" type="number" placeholder="To" />
              </FormControl>
            </VStack>
          </Collapse>

          <FormControl>
            <FormLabel>Weight</FormLabel>
            <Input id="weightFrom" type="number" placeholder="From" />
            <Input id="weightTo" type="number" placeholder="To" />
          </FormControl>

          <FormControl>
            <FormLabel>Metal</FormLabel>
            <Select
              id="metal"
              placeholder="Select metal"
              onChange={(e) => handleMetalChange(e.target.value)}
            >
              {metals.map((metal) => (
                <option key={metal} value={metal}>
                  {metal}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Carat</FormLabel>
            <Select id="carat" placeholder="Select carat">
              {getCaratOptions().map((carat) => (
                <option key={carat} value={carat}>
                  {carat}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Brand</FormLabel>
            <Select id="brand" placeholder="Select brand">
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Price</FormLabel>
            <Input id="priceFrom" type="number" placeholder="From" />
            <Input id="priceTo" type="number" placeholder="To" />
          </FormControl>

          <Collapse in={showRingSize}>
            <FormControl>
              <FormLabel>Ring Size</FormLabel>
              <Input id="ringSizeFrom" type="number" placeholder="From" />
              <Input id="ringSizeTo" type="number" placeholder="To" />
            </FormControl>
          </Collapse>

          <Collapse in={showStoneDetails}>
            <FormControl>
              <FormLabel>Stone Type</FormLabel>
              <Select id="stoneType" placeholder="Select stone type">
                {stoneTypes.map((stoneType) => (
                  <option key={stoneType} value={stoneType}>
                    {stoneType}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Stone Color</FormLabel>
              <Select id="stoneColor" placeholder="Select stone color">
                {stoneColors.map((stoneColor) => (
                  <option key={stoneColor} value={stoneColor}>
                    {stoneColor}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Collapse>

          {/* User Details */}
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input id="email" type="email" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Phone</FormLabel>
            <Input id="phone" type="tel" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input id="name" type="text" />
          </FormControl>

          <Button
            colorScheme="teal"
            mt={4}
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Submit
          </Button>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default ProductForm;
