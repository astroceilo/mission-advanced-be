import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} from "../models/users.model.js";

import { sendResponse } from "../utils/response.js";

// GET /users
export const index = async (req, res) => {
  try {
    const users = await getAllUsers();

    return sendResponse(res, {
      success: true,
      message: "Users fetched successfully",
      data: users,
      status: 200,
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      message: error.message,
      status: 500,
    });
  }
};

// GET /users/:id
export const show = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      return sendResponse(res, {
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    return sendResponse(res, {
      success: true,
      message: user.full_name + " fetched successfully",
      data: user,
      status: 200,
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      message: error.message,
      status: 500,
    });
  }
};

// POST /users
export const store = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return sendResponse(res, {
        success: false,
        message: "full_name, email, and password are required",
        status: 400,
      });
    }

    const emailExists = await getUserByEmail(email);
    if (emailExists) {
      return sendResponse(res, {
        success: false,
        message: "Email already exists",
        status: 400,
      });
    }

    const user = await createUser(req.body);

    return sendResponse(res, {
      success: true,
      message: "User created successfully",
      data: user,
      status: 201,
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      message: error.message,
      status: 500,
    });
  }
};

// PUT /users/:id
export const update = async (req, res) => {
  try {
    const { id } = req.params;

    const userExists = await getUserById(id);
    if (!userExists) {
      return sendResponse(res, {
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    const { email } = req.body;

    if (email) {
      const emailExists = await getUserByEmail(email);

      if (emailExists && emailExists.id !== Number(id)) {
        return sendResponse(res, {
          success: false,
          message: "Email already exists",
          status: 400,
        });
      }
    }

    const user = await updateUser(id, req.body);

    return sendResponse(res, {
      success: true,
      message: "User updated successfully",
      data: user,
      status: 200,
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      message: error.message,
      status: 500,
    });
  }
};

// DELETE /users/:id
export const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    if (!user) {
      return sendResponse(res, {
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    await deleteUser(id);

    return sendResponse(res, {
      success: true,
      message: user.full_name + " deleted successfully",
      status: 200,
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      message: error.message,
      status: 500,
    });
  }
};
