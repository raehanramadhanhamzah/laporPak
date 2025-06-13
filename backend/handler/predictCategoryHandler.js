import { predictCategory } from "../utils/index.js";

export async function predictCategoryHandler(request, h) {
  try {
    const { title, description } = request.payload;

    if (!title || !description) {
      return h
        .response({
          status: "fail",
          message: "Title dan description wajib diisi.",
        })
        .code(400);
    }

    const result = await predictCategory(title, description);

    return h
      .response({
        status: "success",
        message: "Kategori berhasil diprediksi.",
        predictResult: result,
      })
      .code(200);
  } catch (error) {
    console.error("Gagal prediksi kategori:", error);
    return h
      .response({
        status: "fail",
        message: "Terjadi kesalahan saat memproses prediksi.",
      })
      .code(500);
  }
}