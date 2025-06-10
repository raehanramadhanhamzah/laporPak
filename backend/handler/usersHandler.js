import { User } from "../model/userModel.js";
import { Report } from "../model/reportModel.js";
import bcrypt from "bcrypt";
export async function getAllUsersHandler(request, h) {
  try {
    const { name, page, limit } = request.query;

    let query = {};
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    let users;
    let pagination = null;

    if (!page || !limit) {
      users = await User.find(query).select("-password");
    } else {
      const p = parseInt(page);
      const l = parseInt(limit);
      const skip = (p - 1) * l;

      users = await User.find(query).select("-password").skip(skip).limit(l);

      const totalUsers = await User.countDocuments(query);

      pagination = {
        currentPage: p,
        limit: l,
        totalUsers,
        totalPages: Math.ceil(totalUsers / l),
      };
    }

    return h
      .response({
        status: "success",
        message:
          users.length > 0
            ? "Berhasil mendapatkan user"
            : "User tidak ditemukan",
        listUser: users,
      })
      .code(200);
  } catch (error) {
    console.error("gagal getAllUsersHandler:", error);
    return h.response({ error: error.message }).code(500);
  }
}

export async function getDetailUsersHandler(request, h) {
  try {
    const userId = request.params.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return h
        .response({
          status: "fail",
          message: "User tidak ditemukan",
        })
        .code(404);
    }
    return h
      .response({
        status: "success",
        message: "Berhasil mendapatkan detail user",
        user,
      })
      .code(200);
  } catch (error) {
    console.error("gagal getDetailUsersHandler:", error);
    return h.response({ error: error.message }).code(500);
  }
}

export async function updateProfileByIdHandler(request, h) {
  try {
    const userId = request.params.id;
    const {
      name,
      email,
      phone,
      address,
      rt,
      rw,
      kelurahan,
      kecamatan,
    } = request.payload;

    if (email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
      if (existingEmail) {
        return h
          .response({
            status: "fail",
            message: "Email sudah digunakan oleh user lain",
          })
          .code(409);
      }
    }

    if (phone !== undefined) {
      if (!phone) {
        return h
          .response({
            status: "fail",
            message: "Nomor telepon wajib diisi",
          })
          .code(400);
      }

      const phoneOwner = await User.findOne({ phone, _id: { $ne: userId } });
      if (phoneOwner) {
        return h
          .response({
            status: "fail",
            message: "Nomor telepon sudah digunakan oleh user lain",
          })
          .code(409);
      }

      const reportWithPhone = await Report.findOne({
        "reporterInfo.phone": phone,
        reporterId: { $exists: false },
      });
      if (reportWithPhone) {
        return h
          .response({
            status: "fail",
            message:
              "Nomor telepon sudah digunakan pada laporan yang belum terdaftar ke user",
          })
          .code(409);
      }
    }

    const user = await User.findById(userId);
    if (!user) {
      return h
        .response({
          status: "fail",
          message: "User tidak ditemukan",
        })
        .code(404);
    }
    user.name = name || user.name;
    user.email = email || user.email;    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.rt = rt || user.rt;
    user.rw = rw || user.rw;
    user.kelurahan = kelurahan || user.kelurahan;
    user.kecamatan = kecamatan || user.kecamatan;
    user.updatedAt = new Date();

    await user.save();

    return h
      .response({
        status: "success",
        message: "Berhasil memperbarui data user",
        updatedUser: user,
      })
      .code(200);
  } catch (error) {
    console.error("gagal updateUserByIdHandler:", error);
    return h.response({ error: error.message }).code(500);
  }
}

export async function deleteUserByIdHandler(request, h) {
  try {
    const userId = request.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return h
        .response({
          status: "fail",
          message: "User tidak ditemukan",
        })
        .code(404);
    }
    const reportWithUser = await Report.findOne({ reporterId: userId });
    if (reportWithUser) {
      return h
        .response({
          status: "fail",
          message:
            "Tidak dapat menghapus user yang memiliki laporan terdaftar",
        })
        .code(400);
    }
    await User.deleteOne({ _id: userId });
    return h
      .response({
        status: "success",
        message: "Berhasil menghapus user",
      })
      .code(200);
  }
  catch (error) {
    console.error("gagal deleteUserByIdHandler:", error);
    return h.response({ error: error.message }).code(500);
  }
}
export async function updatePasswordByIdHandler(request, h) {
  try {
    const userId = request.params.id;
    const { oldPassword, newPassword, confirmPassword} = request.payload;

    if (!oldPassword || !newPassword) {
      return h
        .response({
          status: "fail",
          message: "Password lama dan password baru wajib diisi",
        })
        .code(400);
    }

    const user = await User.findById(userId);
    if (!user) {
      return h
        .response({
          status: "fail",
          message: "User tidak ditemukan",
        })
        .code(404);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return h
        .response({
          status: "fail",
          message: "Password lama tidak cocok",
        })
        .code(401);
    }
    const isconfirmed = newPassword === confirmPassword;
    if (!isconfirmed) {
      return h
        .response({
          status: "fail",
          message: "Konfirmasi password tidak cocok",
        })
        .code(400);
    }
    user.password = newPassword;
    user.updatedAt = new Date();
    await user.save();

    return h
      .response({
        status: "success",
        message: "Berhasil memperbarui password user",
      })
      .code(200);
  } catch (error) {
    console.error("gagal updatePasswordByIdHandler:", error);
    return h.response({ error: error.message }).code(500);
  }
} 
