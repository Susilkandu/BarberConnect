const { ObjectId } = require("mongodb");
const Salon = require("../../salon/models/salonModel");

const fetchAllSalons = async (query) => {
  try {
    let {
      salon_name,
      full_address,
      longitude,
      latitude,
      sortBy,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = query;
    minPrice = parseInt(minPrice);
    maxPrice = parseInt(maxPrice);
    // Sanitize inputs
    [page, limit] = [Math.max(+page || 1, 1), Math.max(+limit || 10, 1)];

    const pipeline = [];
    const match = {};
    const isGeoValid = !isNaN(longitude) && !isNaN(latitude);

    if (isGeoValid) {
      pipeline.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          maxDistance: 1000000, // 1 million meters = 1000 km
          spherical: true,
        },
      });
    }

    if (salon_name) match.salon_name = { $regex: salon_name, $options: "i" };
    if (full_address)
      match.full_address = { $regex: full_address, $options: "i" };
    if (minPrice && maxPrice) {
      match["average_price_range.min"] = { $gte: +minPrice };
      match["average_price_range.max"] = { $lte: +maxPrice };
    } else if (minPrice) {
      match["average_price_range.min"] = { $gte: +minPrice };
    } else if (maxPrice) {
      match["average_price_range.max"] = { $lte: +maxPrice };
    }

    if (Object.keys(match).length) pipeline.push({ $match: match });

    const sortMap = {
      rating: { rating: -1 },
      experience: { experience: -1 },
      latest: { created_at: -1 },
    };
    if (sortMap[sortBy]) pipeline.push({ $sort: sortMap[sortBy] });

    pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });

    pipeline.push({
      $project: {
        _id: 1,
        salon_name: 1,
        profile_image: 1,
        rating: 1,
        services_offered: 1,
        average_price_range: 1,
        distance: 1,
      },
    });

    const [rawSalons, totalCount] = await Promise.all([
      Salon.aggregate(pipeline),
      Salon.countDocuments(match),
    ]);

    const salons = rawSalons.map((b) => {
      const obj = b.toObject?.() || b;
      const d = obj.distance;
      const formattedDistance =
        typeof d === "number" && !isNaN(d)
          ? d >= 1000
            ? `near ${(d / 1000).toFixed(2)} km`
            : `near ${Math.round(d)} meters`
          : null;
      return { ...obj, formattedDistance };
    });

    return {
      success: true,
      message: "Fetched",
      salons,
      pagination: {
        total: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    console.error("Error in fetchAllBarbers:", error);
    return {
      success: false,
      message: "Server Error",
      error: error.message,
    };
  }
};
const fetchSalonDetails = async (salon_id) => {
  try {
    salon_id = new ObjectId(salon_id);

    const data = await Salon.aggregate([
      { $match: { _id: salon_id } },
      {
        $lookup: {
          from: "salonservices",
          let: { salonId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$salon_id", "$$salonId"] },
                isDeleted: { $ne: true }
              }
            },
            {
              $lookup: {
                from: "masterservices",
                localField: "service_id",
                foreignField: "_id",
                as: "serviceDetails"
              }
            },
            { $unwind: "$serviceDetails" }
          ],
          as: "services"
        }
      },
      {
        $project: {
          salon_name: 1,
          bio: 1,
          profile_image: 1,
          banner: 1,
          photos: 1,
          full_address: 1,
          location_coordinates: 1,
          operating_hours: 1,
          social_links: 1,
          rating: 1,
          rating_count: 1,
          verified_by_admin: 1,
          trust_score: 1,
          experience: 1,
          slot_configuration: 1,
          booking_settings: 1,
          average_price_range: 1,
          services: {
            _id: 1,
            price: 1,
            estimated_duration: 1,
            gender: 1,
            serviceDetails: {
              _id: 1,
              name: 1,
              description: 1,
              category: 1
            }
          },
          owner_name: 1,
          is_verified: 1,
          status: 1,
          unavailable_dates: 1
        }
      }
    ]);

    if (!data || data.length === 0) {
      return { success: false, message: "Salon Details Not Found" };
    }

    // Convert operating_hours Map to a plain object
    const salonData = data[0];
    const operatingHours = {};
    
    if (salonData.operating_hours instanceof Map) {
      salonData.operating_hours.forEach((value, key) => {
        operatingHours[key] = value;
      });
    } else {
      // Handle case where operating_hours is already an object
      Object.assign(operatingHours, salonData.operating_hours || {});
    }

    // Format the data for response
    const formattedData = {
      ...salonData,
      operating_hours: Object.entries(operatingHours).map(([day, hours]) => ({
        day: Number(day),
        dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day],
        opening: hours.opening,
        closing: hours.closing,
        is_open: hours.is_open
      }))
    };

    return { 
      success: true, 
      message: "Fetched Successfully", 
      data: formattedData 
    };

  } catch (error) {
    console.error("Error fetching salon details:", error);
    return { 
      success: false, 
      message: "Error fetching salon details",
      error: error.message 
    };
  }
};

module.exports = {
  fetchAllSalons,
  fetchSalonDetails,
};
