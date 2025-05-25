import { User } from "../model/userModel.js";

export async function getAllUsersHandler(request, h) {
  try {
    const { name, page, limit } = request.query;

    let query = {};
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    let users;
    let pagination = null;

    if (!page || !limit) {
      users = await User.find(query).select('-password');
    } else {
      const p = parseInt(page);
      const l = parseInt(limit);
      const skip = (p - 1) * l;

      users = await User.find(query)
        .select('-password')
        .skip(skip)
        .limit(l);

      const totalUsers = await User.countDocuments(query);

      pagination = {
        currentPage: p,
        limit: l,
        totalUsers,
        totalPages: Math.ceil(totalUsers / l),
      };
    }

    return h.response({
      status: "success",
      message: users.length > 0 ? "Berhasil mendapatkan user" : "User tidak ditemukan",
      listUser:users
    }).code(200);
  } catch (error) {
    console.error("gagal getAllUsersHandler:", error);
    return h.response({ error: error.message }).code(500);
  }
}

export async function getDetailUsersHandler(request, h) {
  try {
    const userId = request.params.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return h.response({
        status: "fail",
        message: "User tidak ditemukan",
      }).code(404);
    }
    return h.response({
      status: "success",
      message: "Berhasil mendapatkan detail user",
      user,
    }).code(200);
  }
  catch (error) {
    console.error("gagal getDetailUsersHandler:", error);
    return h.response({ error: error.message }).code(500);
  }
}


