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

      restaurant,
    });
  } catch (error) {
    console.error("Create restaurant error:", error);

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

    return res.json({
      message: "Restaurant updated successfully.",

      restaurant,
    });
  } catch (error) {
    console.error("Update restaurant error:", error);

    return res.status(500).json({
      message: "Failed to update restaurant.",
    });
  }
};
