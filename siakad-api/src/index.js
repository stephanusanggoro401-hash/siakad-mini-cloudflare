export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ======================
    // CORS PRE-FLIGHT (WAJIB PALING ATAS)
    // ======================
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    // ======================
    // GET DATA MAHASISWA
    // ======================
    if (url.pathname === "/mahasiswa" && request.method === "GET") {
      const { results } = await env.DB
        .prepare("SELECT * FROM mahasiswa")
        .all();

      return new Response(JSON.stringify(results), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // ======================
    // POST TAMBAH MAHASISWA
    // ======================
    if (url.pathname === "/mahasiswa" && request.method === "POST") {
      const data = await request.json();

      // Validasi sederhana
      if (!data.nama || !data.nim || !data.prodi) {
        return new Response(
          JSON.stringify({ error: "Data tidak lengkap" }),
          { status: 400 }
        );
      }

      await env.DB
        .prepare(
          "INSERT INTO mahasiswa (nama, nim, prodi) VALUES (?, ?, ?)"
        )
        .bind(data.nama, data.nim, data.prodi)
        .run();

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    // ======================
    // NOT FOUND
    // ======================
    return new Response("Not Found", { status: 404 });
  }
};
