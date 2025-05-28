const Business = require("../../business/models/businessModel");

const fetchAllBarbers = async (query) => {
  try {
    let {
      business_name,
      location,
      longitude,
      latitude,
      sortBy,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = query;

    // Sanitize inputs
    [page, limit] = [Math.max(+page || 1, 1), Math.max(+limit || 10, 1)];
    [longitude, latitude, minPrice, maxPrice] = [+longitude, +latitude, +minPrice, +maxPrice];

    const pipeline = [];
    const match = {};
    const isGeoValid = !isNaN(longitude) && !isNaN(latitude);

    if (isGeoValid) {
      pipeline.push({
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          maxDistance: 1_000_000,
          spherical: true,
        },
      });
    }

    if (business_name) match.business_name = { $regex: business_name, $options: "i" };
    if (location) match.location = { $regex: location, $options: "i" };
    if (!isNaN(minPrice)) match["average_price_range.min"] = { $gte: minPrice };
    if (!isNaN(maxPrice)) match["average_price_range.max"] = { ...match["average_price_range.max"], $lte: maxPrice };

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
        business_name: 1,
        location: 1,
        rating: 1,
        experience: 1,
        services: 1,
        average_price_range: 1,
        created_at: 1,
        distance: 1,
      },
    });

    const [rawBarbers, totalCount] = await Promise.all([
      Business.aggregate(pipeline),
      Business.countDocuments(match),
    ]);

    const barbers = rawBarbers.map(b => {
      const obj = b.toObject?.() || b;
      const d = obj.distance;
      const formattedDistance = typeof d === "number" && !isNaN(d)
        ? d >= 1000
          ? `near ${(d / 1000).toFixed(2)} km`
          : `near ${Math.round(d)} meters`
        : null;
      return { ...obj, formattedDistance };
    });

    return {
      success: true,
      message: "Fetched",
      barbers,
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

module.exports = { fetchAllBarbers };
