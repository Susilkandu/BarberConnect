import React, { useEffect, useState } from "react";
import { Link, } from "react-router-dom";
import { FaStar} from "react-icons/fa";
import { FaSearch, FaMapMarkerAlt, FaRupeeSign, FaSortAmountDown, FaLocationArrow } from "react-icons/fa";

import {useDispatch} from "react-redux";
import requestHandler from "../../../utils/requestHandler";
import publicServices from "../../../services/public/publicServices";
import { useSelector } from "react-redux";

const NearBySalons = () => {
  const dispatch = useDispatch();
  const [salonList, setSalonList] = useState([]);
  const liveLocation = useSelector(state=>state.auth.liveLocation);
  const [filters, setFilters] = useState({
  salon_name: "",
  full_address: "",
  sortBy: "",
  minPrice: "",
  maxPrice: "",
  page: 1,
  limit: 10,
  nearbyMe: false,
});

  const handleFilters = (e) => {
    const {name, value, type, checked} = e.target;
    if(type === "checkbox"){
      setFilters({...filters, [name]: checked});
    }else{
      setFilters({ ...filters, [name]:value});
    }
};


  useEffect(()=>{
    handleGetSalonList();
  },[])
  const handleGetSalonList = async () => {
  const lng = liveLocation[0];
  const latd = liveLocation[1];

  // Base query params
  const queryParams = {
    sortBy: filters.sortBy || "latest",
    salon_name: filters.salon_name,
    full_address: filters.full_address,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    page: filters.page,
    limit: filters.limit,
  };
  if(filters.nearbyMe && liveLocation && liveLocation.length ===2){
    queryParams.longitude = liveLocation[0];
    queryParams.latitude = liveLocation[1];
  }
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
    () => publicServices.getSalonList(queryString),0,
    {
      onSuccess: (res) => {
        const salons = res.data.salons;
        setSalonList(salons);
      },
    }
  );
};

  return (
    <div className="bg-[#F9FAFB] text-[#1F2937]" >
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-white shadow rounded-md md:mt-10">
      <div className="flex items-center border rounded-md px-2 py-1 flex-1 min-w-[150px] max-w-xs">
        <FaSearch className="text-gray-400 mr-2" />
        <input type="text" name="salon_name" value={filters.salon_name} onChange={handleFilters} placeholder="Salon name" className="w-full outline-none text-gray-700"/>
      </div>
      <div className="flex items-center border rounded-md px-2 py-1 flex-1 min-w-[150px] max-w-xs">
        <FaMapMarkerAlt className="text-gray-400 mr-2" />
        <input type="text" name="full_address" value={filters.full_address} onChange={handleFilters} placeholder="Location" className="w-full outline-none text-gray-700"/>
      </div>
      <label className="flex items-center cursor-pointer select-none border rounded-md px-3 py-1 w-[160px] text-gray-700">
        <input type="checkbox" name="nearbyMe" checked={filters.nearbyMe} onChange={handleFilters} className="mr-2"/>
        <FaLocationArrow className="text-gray-500 mr-1" />Nearby Me
      </label>
      <div className="flex items-center border rounded-md px-2 py-1 w-[120px]">
        <FaRupeeSign className="text-gray-400 mr-1" />
        <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilters} placeholder="Min Price" className="w-full outline-none text-gray-700" min={0}/>
      </div>
      <div className="flex items-center border rounded-md px-2 py-1 w-[120px]">
        <FaRupeeSign className="text-gray-400 mr-1" />
        <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilters} placeholder="Max Price" className="w-full outline-none text-gray-700" min={0}/>
      </div>
      <div className="flex items-center border rounded-md px-2 py-1 w-[140px]">
        <FaSortAmountDown className="text-gray-400 mr-2" />
        <select name="sortBy" value={filters.sortBy} onChange={handleFilters} className="w-full outline-none text-gray-700 bg-transparent cursor-pointer">
          <option value="experience">Experience</option>
          <option value="latest">Latest</option>
          <option value="rating">Rating</option>
        </select>
      </div>
      <button onClick={handleGetSalonList}
        className="bg-[#1F2937] hover:bg-yellow-500 text-white px-4 py-2 rounded-md transition-colors duration-300">Search</button>
    </div>

      {/* Sallon List */}
      <div className="max-h-screen w-full mt-10">
        {salonList?.map(
          (salon) => (
          <div
            key={salon._id}
            className="flex items-center justify-start bg-white shadow-lg rounded-lg mb-4 cursor-pointer active hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-2/5 flex flex-col justify-items-center items-center">
              <div className="relative mb-4">
                <div className="absolute top-0 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white py-1 px-3 text-xs rounded-full">
                  <FaMapMarkerAlt className="inline mr-1" /> {salon?.formattedDistance}
                </div>
                <img
                  src={salon?.profile_image?`http://localhost:8000/api/photos/${salon.profile_image}`:" "}
                  alt={salon?.salon_name}
                  className="w-24 h-24 object-cover rounded-2xl mt-4 hover:cursor-zoom-in hover:scale-200"
                />
              </div>
            </div>
            <div className="w-3/5 ml-3">
              <h3 className="text-xl font-bold">{salon?.salon_name}</h3>
              <div className="flex justify-between items-center w-full">
                <div>
                  <div className="flex items-center text-yellow-500">
                    <FaStar />
                    <span className="ml-2">{salon.rating} / 5</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <FaRupeeSign/><span className="ml-2">{salon?.average_price_range?.min} - {salon?.average_price_range?.max}</span>
                  </div>
                </div>
                <Link
                  to={`/viewSalonProfile/${salon._id}`}
                  className="w-[8rem] md:w-2/5 text-center text-[1rem] bg-[#1F2937] text-white py-2 rounded-md hover:bg-yellow-500 transition-colors duration-300"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default NearBySalons;
