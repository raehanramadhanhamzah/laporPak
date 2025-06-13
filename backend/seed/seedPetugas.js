import { User } from "../model/userModel.js";

export async function seedPetugas() {
  try {
    const petugasList = [
      {
        name: "Petugas 1",
        email: "petugas1@gmail.com",
        password: "12345678",
        phone: "0811111111",
        address: "Pos Damkar 1, Makassar",
        kelurahan: "Makassar 1",
        kecamatan: "Makassar 1",
      },
      {
        name: "Petugas 2",
        email: "petugas2@gmail.com",
        password: "12345678",
        phone: "0822222222",
        address: "Pos Damkar 2, Makassar",
        kelurahan: "Makassar 1",
        kecamatan: "Makassar 1",
      },
      {
        name: "Petugas 3",
        email: "petugas3@gmail.com",
        password: "12345678",
        phone: "0833333333",
        address: "Pos Damkar 3, Makassar",
        kelurahan: "Makassar 1",
        kecamatan: "Makassar 1",
      },
    ];

    for (const petugas of petugasList) {
      const exists = await User.findOne({ email: petugas.email });
      if (exists) {
        console.log(`${petugas.name} sudah ada`);
        continue;
      }

      const newPetugas = new User({
        ...petugas,
        role: "petugas",
      });

      await newPetugas.save();
      console.log(`${petugas.name} berhasil dibuat`);
    }
  } catch (err) {
    console.error("Gagal seed petugas:", err);
  }
}
