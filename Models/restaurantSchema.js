import mongoose from "mongoose";

const openingHourSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },

    open: {
      type: String,
      default: "09:00",
    },

    close: {
      type: String,
      default: "22:00",
    },

    closed: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      default: "Main",
    },

    image: {
      type: String,
      default: "",
    },

    dietaryTags: {
      type: [String],
      default: [],
    },
  },
  {
    _id: true,
  },
);

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 3000,
    },

    cuisines: {
      type: [String],
      default: [],
    },

    priceRange: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        default: "",
        trim: true,
      },

      country: {
        type: String,
        default: "",
        trim: true,
      },

      lat: {
        type: Number,
        default: null,
      },

      lng: {
        type: Number,
        default: null,
      },
    },

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    amenities: {
      type: [String],
      default: [],
    },

    dietaryOptions: {
      type: [String],
      default: [],
    },

    ambiance: {
      type: [String],
      default: [],
    },

    openingHours: {
      type: [openingHourSchema],
      default: [],
    },

    menu: {
      type: [menuItemSchema],
      default: [],
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
      default: 40,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

restaurantSchema.index({
  name: "text",
  description: "text",
  cuisines: "text",
  "location.city": "text",
});

restaurantSchema.index({
  ownerId: 1,
});

restaurantSchema.index({
  "location.city": 1,
});

restaurantSchema.index({
  cuisines: 1,
});

restaurantSchema.index({
  priceRange: 1,
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
