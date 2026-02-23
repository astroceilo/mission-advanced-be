import { Op } from "sequelize";
import Course from "../models/courseModels.js";
import { sendResponse } from "../utils/response.js";

export const getCourses = async (req, res) => {
  try {
    const {
      search,
      level,
      sortBy = "created_at:desc",
      page = 1,
      limit = 10,
      minPrice,
      maxPrice,
      isPublished,
    } = req.query;

    const where = {};

    // SEARCH
    if (search) {
      // where.title = { [Op.like]: `%${search}%` };
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    // FILTER level
    if (level) {
      where.level = level;
    }

    // PRICE RANGE
    if (minPrice || maxPrice) {
      where.price = {};

      if (minPrice) {
        where.price[Op.gte] = Number(minPrice);
      }

      if (maxPrice) {
        where.price[Op.lte] = Number(maxPrice);
      }
    }

    // FILTER isPublished
    if (isPublished !== undefined) {
      where.is_published = isPublished === "true";
    }

    // SORT
    const allowedSortFields = [
      "title",
      "price",
      "created_at",
      "rating_avg",
      "total_reviews",
    ];

    let [field, order] = sortBy.split(":");

    if (!allowedSortFields.includes(field)) {
      field = "created_at";
    }

    order = order?.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const orderOption = [[field, order]];

    // PAGINATION
    const currentPage = Number(page) || 1;
    const perPage = Number(limit) || 10;
    const offset = (currentPage - 1) * perPage;

    const { rows, count } = await Course.findAndCountAll({
      where,
      order: orderOption,
      limit: perPage,
      offset,
    });

    console.log("WHERE:", where);
    return sendResponse(res, {
      message: "Courses fetched successfully",
      data: {
        total: count,
        page: currentPage,
        totalPages: Math.ceil(count / perPage),
        courses: rows,
      },
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      message: error.message,
      status: 500,
    });
  }
};
