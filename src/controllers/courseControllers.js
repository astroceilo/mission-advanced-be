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
    } = req.query;

    const where = {};

    // 🔍 SEARCH (title)
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }

    // 🎯 FILTER level
    if (level) {
      where.level = level;
    }

    // 📊 SORT
    const [field, order] = sortBy.split(":");
    const orderOption = [[field, order?.toUpperCase() || "DESC"]];

    // 📄 PAGINATION
    const offset = (page - 1) * limit;

    const { rows, count } = await Course.findAndCountAll({
      where,
      order: orderOption,
      limit: Number(limit),
      offset: Number(offset),
    });

    console.log("getCourses terpanggil");
    return sendResponse(res, {
      message: "Courses fetched successfully",
      data: {
        total: count,
        page: Number(page),
        totalPages: Math.ceil(count / limit),
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