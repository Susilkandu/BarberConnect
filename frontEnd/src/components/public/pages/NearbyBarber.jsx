import React from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaSearch,
  FaStar,
  FaMoneyBillWave,
} from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { IoMdPeople } from "react-icons/io";
import { MdPhotoCamera } from "react-icons/md";

const NearbyBarber = () => {
  const salonList = [
    {
      id: 1,
      name: "The Classic Barber",
      location: "5",
      rating: 4.5,
      price: "₹500 - ₹1000",
      services: [
        "Haircut",
        "Beard Styling",
        "Shaving",
        "massage",
        "eye lensing",
      ],
      specialization: "Men’s Grooming",
      images: [
        "https://media.istockphoto.com/id/1288801785/photo/barber-shop.jpg?s=612x612&w=0&k=20&c=R4e9Ts7MaRN2DaGTebLtiu_ThxRk2cGUefbQneL90ro=",
        "https://media.istockphoto.com/id/987634696/photo/barber-applies-shaving-foam.jpg?s=1024x1024&w=is&k=20&c=8Cv1k87tsQC5x-WJybbIUgrnRVA1xj4yVYsi4OawEwo=",
      ],
      bookingUrl: "/book/1",
    },
    {
      id: 1,
      name: "The Classic Barber",
      location: "5",
      rating: 4.5,
      price: "₹500 - ₹1000",
      services: [
        "Haircut",
        "Beard Styling",
        "Shaving",
        "massage",
        "eye lensing",
      ],
      specialization: "Men’s Grooming",
      images: [
        "https://media.istockphoto.com/id/1288801785/photo/barber-shop.jpg?s=612x612&w=0&k=20&c=R4e9Ts7MaRN2DaGTebLtiu_ThxRk2cGUefbQneL90ro=",
        "https://media.istockphoto.com/id/987634696/photo/barber-applies-shaving-foam.jpg?s=1024x1024&w=is&k=20&c=8Cv1k87tsQC5x-WJybbIUgrnRVA1xj4yVYsi4OawEwo=",
      ],
      bookingUrl: "/book/1",
    },
    {
      id: 1,
      name: "The Classic Barber",
      location: "5",
      rating: 4.5,
      price: "₹500 - ₹1000",
      services: [
        "Haircut",
        "Beard Styling",
        "Shaving",
        "massage",
        "eye lensing",
      ],
      specialization: "Men’s Grooming",
      images: [
        "https://media.istockphoto.com/id/1288801785/photo/barber-shop.jpg?s=612x612&w=0&k=20&c=R4e9Ts7MaRN2DaGTebLtiu_ThxRk2cGUefbQneL90ro=",
        "https://media.istockphoto.com/id/987634696/photo/barber-applies-shaving-foam.jpg?s=1024x1024&w=is&k=20&c=8Cv1k87tsQC5x-WJybbIUgrnRVA1xj4yVYsi4OawEwo=",
      ],
      bookingUrl: "/book/1",
    },
    {
      id: 1,
      name: "The Classic Barber",
      location: "5",
      rating: 4.5,
      price: "₹500 - ₹1000",
      services: [
        "Haircut",
        "Beard Styling",
        "Shaving",
        "massage",
        "eye lensing",
      ],
      specialization: "Men’s Grooming",
      images: [
        "https://media.istockphoto.com/id/1288801785/photo/barber-shop.jpg?s=612x612&w=0&k=20&c=R4e9Ts7MaRN2DaGTebLtiu_ThxRk2cGUefbQneL90ro=",
        "https://media.istockphoto.com/id/987634696/photo/barber-applies-shaving-foam.jpg?s=1024x1024&w=is&k=20&c=8Cv1k87tsQC5x-WJybbIUgrnRVA1xj4yVYsi4OawEwo=",
      ],
      bookingUrl: "/book/1",
    },
    {
      id: 1,
      name: "The Classic Barber",
      location: "5",
      rating: 4.5,
      price: "₹500 - ₹1000",
      services: [
        "Haircut",
        "Beard Styling",
        "Shaving",
        "massage",
        "eye lensing",
      ],
      specialization: "Men’s Grooming",
      images: [
        "https://media.istockphoto.com/id/1288801785/photo/barber-shop.jpg?s=612x612&w=0&k=20&c=R4e9Ts7MaRN2DaGTebLtiu_ThxRk2cGUefbQneL90ro=",
        "https://media.istockphoto.com/id/987634696/photo/barber-applies-shaving-foam.jpg?s=1024x1024&w=is&k=20&c=8Cv1k87tsQC5x-WJybbIUgrnRVA1xj4yVYsi4OawEwo=",
      ],
      bookingUrl: "/book/1",
    },
    {
      id: 2,
      name: "Beauty Barber Shop",
      location: "2.5",
      rating: 4.8,
      price: "₹300 - ₹800",
      services: ["Haircut", "Facial", "Shaving"],
      specialization: "Bridal Makeup",
      images: [
        "https://media.istockphoto.com/id/987634696/photo/barber-applies-shaving-foam.jpg?s=1024x1024&w=is&k=20&c=8Cv1k87tsQC5x-WJybbIUgrnRVA1xj4yVYsi4OawEwo=",
        "salon4.jpg",
      ],
      bookingUrl: "/book/2",
    },
    // More salons can be added here
  ];

  return (
    <div className="bg-[#F9FAFB] text-[#1F2937]">
      {/* Hero Section
      <section className="pt-24 text-center bg-[#1F2937] text-[#F9FAFB] py-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Nearby Barbers</h1>
        <div className="flex justify-center items-center space-x-2 mb-8">
          <input
            type="text"
            placeholder="Enter Location"
            className="px-6 py-3 rounded-lg bg-[#E5E7EB] text-[#1F2937] w-1/3"
          />
          <button className="bg-[#FFD369] px-6 py-3 rounded-lg flex items-center text-[#1F2937]">
            <FaSearch className="mr-2"/> Search
          </button>
        </div>
        <Link 
          to="/nearbyBarber"
          className="bg-[#FFD369] px-6 py-3 rounded-lg text-[#1F2937]">
          View Nearby Barbers
        </Link>
      </section> */}
      {/* Sallon List */}
      <div className="max-h-screen w-full mt-10">
        {salonList.map((salon) => (
          <div
            key={salon.id}
            className=" flex items-center justify-start bg-white shadow-lg rounded-lg mb-4 cursor-pointer active hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-2/5 flex flex-col justify-items-center items-center">
              <div className="relative mb-4">
                <div className="absolute top-0 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white py-1 px-3 text-xs rounded-full">
                  <FaMapMarkerAlt className="inline mr-1" /> {salon.location} km
                </div>
                <img
                  src={salon.images[0]}
                  alt={salon.name}
                  className="w-24 h-24 object-cover rounded-2xl mt-4 hover:cursor-zoom-in hover:scale-200"
                />
              </div>
            </div>
            <div className="w-3/5 ml-3">
              <h3 className="text-xl font-bold">{salon.name}</h3>
              <div className="flex justify-between items-center w-full">
                <div>
                  <div className="flex items-center text-yellow-500">
                    <FaStar />
                    <span className="ml-2">{salon.rating} / 5</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="ml-2">{salon.price}</span>
                  </div>
                </div>
                <Link
                  to={salon.bookingUrl}
                  className="w-[8rem] md:w-2/5 text-center text-[1rem] bg-[#1F2937] text-white py-2 rounded-md hover:bg-yellow-500 transition-colors duration-300"
                >
                  Book Now
                </Link>
              </div>
              <div className="">
                <h4 className="text-lg font-semibold">Services:</h4>
                <ul className="flex gap-2 py-2 w-full overflow-x-auto">
                  {salon.services.map((service, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 bg-gray-100 px-3 text-center rounded-full shadow-sm"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <BsFillShieldLockFill />
                <span className="ml-2">{salon.specialization}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyBarber;
