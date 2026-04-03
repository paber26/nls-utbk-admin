<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <main class="flex-1">
        <header class="bg-white border-b px-6 py-4">
          <h1 class="text-lg font-semibold text-slate-800">Persiapan Simulasi</h1>
          <p class="text-sm text-slate-500">Pastikan peserta memahami ketentuan sebelum memulai simulasi SNBT</p>
        </header>

        <div class="px-6 py-8 w-full">
          <div class="grid lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
              <section class="bg-white rounded-xl border p-6">
                <span class="inline-block text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded mb-3">SNBT</span>
                <h2 class="text-xl font-semibold text-slate-800">Simulasi Penuh SNBT</h2>
                <p class="text-sm text-slate-500 mt-1">Waktu: 195 menit • Jumlah soal: 160</p>
              </section>

              <section class="bg-white rounded-xl border p-6">
                <h3 class="text-lg font-semibold text-slate-800 mb-4">Ketentuan & Persiapan</h3>

                <ul class="space-y-4 text-sm text-slate-700">
                  <li class="flex gap-3">
                    <span class="text-primary mt-1">✔</span>
                    Gunakan
                    <b>Google Chrome versi terbaru</b>
                    untuk pengalaman terbaik.
                  </li>

                  <li class="flex gap-3">
                    <span class="text-primary mt-1">✔</span>
                    Pastikan
                    <b>koneksi internet stabil</b>
                    selama pengerjaan simulasi.
                  </li>

                  <li class="flex gap-3">
                    <span class="text-primary mt-1">✔</span>
                    Siapkan
                    <b>alat tulis</b>
                    untuk mencatat strategi, hitungan, dan evaluasi komponen.
                  </li>

                  <li class="flex gap-3">
                    <span class="text-primary mt-1">✔</span>
                    Pastikan perangkat dalam kondisi
                    <b>baterai cukup</b>
                    .
                  </li>

                  <li class="flex gap-3">
                    <span class="text-primary mt-1">✔</span>
                    Setelah dimulai,
                    <b>waktu berjalan terus</b>
                    dan tidak bisa dihentikan.
                  </li>

                  <li class="flex gap-3">
                    <span class="text-primary mt-1">✔</span>
                    <b>Berdoa</b>
                    , kerjakan dengan
                    <b>jujur dan mandiri</b>
                    .
                  </li>
                </ul>
              </section>
            </div>

            <div class="space-y-6">
              <section class="bg-white rounded-xl border p-6 sticky top-6">
                <label class="flex items-start gap-3 text-sm text-slate-700 mb-6">
                  <input type="checkbox" class="mt-1" />
                  <span>Saya telah membaca dan memahami seluruh ketentuan simulasi SNBT.</span>
                </label>

                <div class="flex flex-col gap-3">
                  <a
                    href="/tryout"
                    class="px-6 py-3 rounded-lg border text-center text-slate-700 hover:bg-slate-100"
                  >
                    Kembali
                  </a>

                  <a
                    href="/tryout"
                    class="px-6 py-3 rounded-lg bg-primary text-white text-center font-semibold hover:bg-orange-700"
                  >
                    Mulai Simulasi
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import Sidebar from "../components/layout/Sidebar.vue"
</script>
