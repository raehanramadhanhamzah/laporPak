import { User } from "../model/userModel.js";
import { Report } from "../model/reportModel.js";
import bcrypt from "bcrypt";
export async function createStaffHandler(request, h) {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      rt,
      rw,
      kelurahan,
      kecamatan,
    } = request.payload;

    if (!name || !email || !password || !phone || !address) {
      return h
        .response({
          status: "fail",
          message: "Semua field wajib diisi",
        })
        .code(400);
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return h
        .response({
          status: "fail",
          message: "Email sudah digunakan oleh petugas lain",
        })
        .code(409);
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return h
        .response({
          status: "fail",
          message: "Nomor telepon sudah digunakan oleh petugas lain",
        })
        .code(409);
    }

    const newUser = new User({
      name,
      email,
      password,
      phone,
      address,
      rt,
      rw,
      kelurahan,
      kecamatan,
      role: "petugas",
    });

    await newUser.save();

    return h
      .response({
        status: "success",
        message: "Berhasil membuat petugas baru",
        user: newUser,
      })
      .code(201);
  } catch (error) {
    console.error("gagal createStaffHandler:", error);
    return h.response({ error: error.message }).code(500);
  }
}

export async function updateStaffByIdHandler(request, h) {
  try {
    const userId = request.params.id;
    const { name, phone, address, rt, rw, kelurahan, kecamatan } =
      request.payload;

    const user = await User.findById(userId);
    if (!user) {
      return h
        .response({
          status: "fail",
          message: "Akun petugas tidak ditemukan",
        })
        .code(404);
    }

    if (!name) {
      return h
        .response({
          status: "fail",
          message: "Nama wajib diisi",
        })
        .code(400);
    }

    if (phone === undefined || phone === "") {
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
          message: "Nomor telepon sudah digunakan oleh petugas lain",
        })
        .code(409);
    }

    user.name = name;
    user.phone = phone;
    user.address = address || null;
    user.rt = rt || null;
    user.rw = rw || null;
    user.kelurahan = kelurahan || null;
    user.kecamatan = kecamatan || null;
    user.updatedAt = new Date();

    await user.save();

    return h
      .response({
        status: "success",
        message: "Berhasil memperbarui data petugas",
        updatedUser: user,
      })
      .code(200);
  } catch (error) {
    console.error("gagal updateStaffByIdHandler:", error);
    return h.response({ error: error.message }).code(500);
  }
}

export async function updateStaffPasswordHandler(request, h) {
  try {
    const userId = request.params.id;
    const { newPassword, confirmPassword } = request.payload;

    if (!newPassword || !confirmPassword) {
      return h
        .response({
          status: "fail",
          message: "Password baru dan konfirmasi wajib diisi",
        })
        .code(400);
    }

    if (newPassword !== confirmPassword) {
      return h
        .response({
          status: "fail",
          message: "Konfirmasi password tidak cocok",
        })
        .code(400);
    }

    const user = await User.findById(userId);
    if (!user) {
      return h
        .response({
          status: "fail",
          message: "Akun petugas tidak ditemukan",
        })
        .code(404);
    }

    user.password = newPassword;
    user.updatedAt = new Date();

    await user.save();

    return h
      .response({
        status: "success",
        message: "Password berhasil diperbarui",
      })
      .code(200);
  } catch (error) {
    console.error("gagal updateStaffPasswordHandler:", error);
    return h.response({ error: error.message }).code(500);
  }
}

export async function deleteStaffByIdHandler(request, h) {
  try {
    const userId = request.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return h
        .response({
          status: "fail",
          message: "Akun petugas tidak ditemukan",
        })
        .code(404);
    }

    await User.deleteOne({ _id: userId });
    return h
      .response({
        status: "success",
        message: "Berhasil menghapus akun petugas",
      })
      .code(200);
  } catch (error) {
    console.error("gagal deleteStaffByIdHandler:", error);
    return h.response({ error: error.message }).code(500);
  }
}
