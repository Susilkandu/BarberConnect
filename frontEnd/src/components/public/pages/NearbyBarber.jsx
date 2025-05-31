import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaStar} from "react-icons/fa";
import { FaRupeeSign } from "react-icons/fa6";
import { FaSearchLocation, FaMapMarkerAlt, FaSortAmountDown } from "react-icons/fa";
import { MdBusinessCenter, MdOutlineAttachMoney } from "react-icons/md";

import {useDispatch} from "react-redux";
import requestHandler from "../../../utils/requestHandler";
import publicServices from "../../../services/public/publicServices";
import { useSelector } from "react-redux";

const NearbyBarber = () => {
  const dispatch = useDispatch();
  const [barberList, setBarberList] = useState([]);
  const liveLocation = useSelector(state=>state.auth.liveLocation);
  const [filters, setFilters] = useState({
  business_name: "",
  location: "",
  sortBy: "",
  minPrice: "",
  maxPrice: "",
  page: 1,
  limit: 10
});

  const handleFilters = (e, key) => {
  setFilters({ ...filters, [key]: e.target.value });
};


  useEffect(()=>{
    handleGetBarberList();
  },[])

  // const handleGetBarberList = async()=>{
  //   const lng = liveLocation[0];
  //   const latd = liveLocation[1];
  //   await requestHandler(dispatch,()=> publicServices.getBarbersList(`longitude=${lng}&latitude=${latd}&sortBy=latest`),{
  //     onSuccess: (res)=>{
  //       const barbers = res.data.barbers;
  //       setBarberList(barbers);
  //     }
  //   })
  // }
  const handleGetBarberList = async () => {
  const lng = liveLocation[0];
  const latd = liveLocation[1];

  // Base query params
  const queryParams = {
    longitude: lng,
    latitude: latd,
    sortBy: filters.sortBy || "latest",
    business_name: filters.business_name,
    location: filters.location,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    page: filters.page,
    limit: filters.limit,
  };

  // Remove empty values
  const filteredParams = Object.entries(queryParams).reduce((acc, [key, value]) => {
    if (value !== "" && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});

  const queryString = new URLSearchParams(filteredParams).toString();

  await requestHandler(
    dispatch,
    () => publicServices.getBarbersList(queryString),
    {
      onSuccess: (res) => {
        const barbers = res.data.barbers;
        setBarberList(barbers);
      },
    }
  );
};

// Filter component
const FilterForm = () => {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-4 mb-6 w-full overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 text-xl font-semibold text-gray-800">
        <div className="text-yellow-600"><FaSortAmountDown /></div>
        <span>Filter Barbers</span>
      </div>

      {/* Horizontal Scrollable Filters */}
      <div className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar">
        {/* Custom scroll style */}
        {[
          {
            label: "Business Name",
            icon: <MdBusinessCenter />,
            type: "text",
            value: filters.business_name,
            placeholder: "e.g. Style Zone",
            key: "business_name",
          },
          {
            label: "Location",
            icon: <FaSearchLocation />,
            type: "text",
            value: filters.location,
            placeholder: "e.g. Delhi",
            key: "location",
          },
          {
            label: "Sort By",
            icon: <FaSortAmountDown />,
            type: "select",
            options: ["rating", "experience", "latest"],
            value: filters.sortBy,
            key: "sortBy",
          },
          {
            label: "Min Price",
            icon: <MdOutlineAttachMoney />,
            type: "number",
            value: filters.minPrice,
            placeholder: "e.g. 100",
            key: "minPrice",
          },
          {
            label: "Max Price",
            type: "number",
            value: filters.maxPrice,
            placeholder: "e.g. 1000",
            key: "maxPrice",
          },
        ].map((field) => (
          <div
            key={field.key}
            className="flex-shrink-0 w-60 bg-gray-50 p-3 rounded-xl border shadow-sm"
          >
            <label className="text-sm text-gray-700 mb-1 flex items-center gap-1">
              {field.icon} {field.label}
            </label>

            {field.type === "select" ? (
              <select
                value={field.value}
                onChange={(e)=>{handleFilters(e, field.key)}}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Select</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                step={field.type === "number" ? "any" : undefined}
                min={field.key === "page" || field.key === "limit" ? "1" : undefined}
                max={field.key === "limit" ? "100" : undefined}
                value={field.value}
                onChange={(e)=>{handleFilters(e, field.key)}}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <button
        onClick={handleGetBarberList}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};


  return (
    <div className="bg-[#F9FAFB] text-[#1F2937]" >
      <FilterForm />
      {/* Sallon List */}
      <div className="max-h-screen w-full mt-10">
        {barberList?.map((salon) => (
          <div
            key={salon._id}
            className=" flex items-center justify-start bg-white shadow-lg rounded-lg mb-4 cursor-pointer active hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-2/5 flex flex-col justify-items-center items-center">
              <div className="relative mb-4">
                <div className="absolute top-0 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white py-1 px-3 text-xs rounded-full">
                  <FaMapMarkerAlt className="inline mr-1" /> {salon?.formattedDistance}
                </div>
                <img
                  src={salon?.profile_image?`http://localhost:8000/api/photos/${salon.profile_image}`:" "}
                  alt={salon?.business_name}
                  className="w-24 h-24 object-cover rounded-2xl mt-4 hover:cursor-zoom-in hover:scale-200"
                />
              </div>
            </div>
            <div className="w-3/5 ml-3">
              <h3 className="text-xl font-bold">{salon.business_name}</h3>
              <div className="flex justify-between items-center w-full">
                <div>
                  <div className="flex items-center text-yellow-500">
                    <FaStar />
                    <span className="ml-2">{salon.rating} / 5</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="ml-2">{salon?.average_price_range?.min} - {salon?.average_price_range?.max} <FaRupeeSign/></span>
                  </div>
                </div>
                <Link
                  to={salon.business_name}
                  className="w-[8rem] md:w-2/5 text-center text-[1rem] bg-[#1F2937] text-white py-2 rounded-md hover:bg-yellow-500 transition-colors duration-300"
                >
                  Book Now
                </Link>
              </div>
              <div className="">
                <h4 className="text-lg font-semibold">Services:</h4>
                <ul className="flex gap-2 py-2 w-full overflow-x-auto">
                  {salon?.services_offered?.map((service, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 bg-gray-100 px-3 text-center rounded-full shadow-sm"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default NearbyBarber;
