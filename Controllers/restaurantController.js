import Restaurant from "../Models/restaurantModel.js";

//create a Restaurant
export const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      cuisines,
      priceRange,
      address,
      location,
      phone,
      email,
      images,
      amenities,
      dietaryOptions,
      ambiance,
      openingHours,
      menu,
      capacity,
    } = req.body;

    // Validate required fields
    if (!name || !address || !location?.city || !priceRange) {
      return res.status(400).json({
        message: "Name, address, city and price range are required.",
      });
    }

    // Create Mongoose document
    const restaurant = new Restaurant({
      name: name.trim(),

      description: description || "",

      cuisines: Array.isArray(cuisines) ? cuisines : [],

      priceRange: Number(priceRange),

      address: address.trim(),

      location: {
        city: location.city.trim(),
        state: location.state || "",
        country: location.country || "",
        lat: location.lat ?? null,
        lng: location.lng ?? null,
      },

      phone: phone || "",

      email: email || "",

      images: Array.isArray(images) ? images : [],

      amenities: Array.isArray(amenities) ? amenities : [],

      dietaryOptions: Array.isArray(dietaryOptions) ? dietaryOptions : [],

      ambiance: Array.isArray(ambiance) ? ambiance : [],

      openingHours: Array.isArray(openingHours) ? openingHours : [],

      menu: Array.isArray(menu) ? menu : [],

      capacity: capacity ? Number(capacity) : 40,

      // Comes from authenticated user
      ownerId: req.user._id,
    });

    // Save document to MongoDB
    await restaurant.save();

    return res.status(201).json({
      message: "Restaurant created successfully.",

      data: restaurant,
    });
  } catch (error) {
    //console.error("Create restaurant error:", error);

    return res.status(500).json({
      message: "Failed to create restaurant.",
    });
  }
};

//Update a Restaurant
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found.",
      });
    }

    // Restaurant owners can only
    // update their own restaurants.
    if (
      req.user.role === "restaurant_owner" &&
      restaurant.ownerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only update your own restaurant.",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "cuisines",
      "priceRange",
      "address",
      "location",
      "phone",
      "email",
      "images",
      "amenities",
      "dietaryOptions",
      "ambiance",
      "openingHours",
      "menu",
      "capacity",
      "isActive",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        restaurant[field] = req.body[field];
      }
    }

    await restaurant.save();

    return res.status(201).json({
      message: "Restaurant updated successfully.",

      data: restaurant,
    });
  } catch (error) {
    console.error("Update restaurant error:", error);

    return res.status(500).json({
      message: "Failed to update restaurant.",
    });
  }
};

//Get all Restaurants
export const getAllRestaurants = async (req, res) => {
  try {
    const {
      q,
      cuisine,
      city,
      minPrice,
      maxPrice,
      dietary,
      ambiance,
      amenity,
      sort,
    } = req.query;

    const filter = {
      isActive: true,
    };

    // -----------------------------
    // Text search
    // -----------------------------

    if (q) {
      filter.$text = {
        $search: q,
      };
    }

    // -----------------------------
    // Cuisine
    // -----------------------------

    if (cuisine) {
      filter.cuisines = {
        $in: cuisine.split(",").map((item) => item.trim()),
      };
    }

    // -----------------------------
    // City
    // -----------------------------

    if (city) {
      filter["location.city"] = {
        $regex: city.trim(),
        $options: "i",
      };
    }

    // -----------------------------
    // Price
    // -----------------------------

    if (minPrice || maxPrice) {
      filter.priceRange = {};

      if (minPrice) {
        filter.priceRange.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.priceRange.$lte = Number(maxPrice);
      }
    }

    // -----------------------------
    // Dietary
    // -----------------------------

    if (dietary) {
      filter.dietaryOptions = {
        $in: dietary.split(",").map((item) => item.trim()),
      };
    }

    // -----------------------------
    // Ambiance
    // -----------------------------

    if (ambiance) {
      filter.ambiance = {
        $in: ambiance.split(",").map((item) => item.trim()),
      };
    }

    // -----------------------------
    // Amenities
    // -----------------------------

    if (amenity) {
      filter.amenities = {
        $in: amenity.split(",").map((item) => item.trim()),
      };
    }

    // -----------------------------
    // Sorting
    // -----------------------------

    let sortOption = {
      rating: -1,
    };

    if (sort === "rating_asc") {
      sortOption = {
        rating: 1,
      };
    }

    if (sort === "rating_desc") {
      sortOption = {
        rating: -1,
      };
    }

    if (sort === "newest") {
      sortOption = {
        createdAt: -1,
      };
    }

    const restaurants = await Restaurant.find(filter)
      .sort(sortOption)
      .limit(100);

    return res.status(201).json({
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.error("Restaurant search error:", error);

    return res.status(500).json({
      message: "Failed to fetch restaurants.",
    });
  }
};

//Get Restaurant by Id

export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found.",
      });
    }

    return res.status(201).json({
      data: restaurant,
    });
  } catch (error) {
    console.error("Get restaurant error:", error);

    return res.status(500).json({
      message: "Failed to fetch restaurant.",
    });
  }
};
