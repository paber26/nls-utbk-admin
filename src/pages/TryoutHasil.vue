<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <main class="flex-1">
        <header class="bg-white border-b px-4 md:px-6 py-4">
          <h1 class="text-lg font-semibold text-slate-800">Hasil Simulasi</h1>
          <p class="text-sm text-slate-500">Ringkasan hasil pengerjaan simulasi SNBT</p>
        </header>

        <div class="px-4 md:px-6 py-6 w-full">
          <section class="bg-white rounded-xl border p-6 mb-6">
            <span class="inline-block text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded mb-2">SNBT</span>
            <h2 class="text-xl font-semibold text-slate-800">Simulasi Penuh SNBT</h2>
            <p class="text-sm text-slate-500">Waktu: 195 menit • Jumlah soal: 160</p>
          </section>

          <section class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-xl border p-4 text-center">
              <p class="text-sm text-slate-500">Skor Akhir</p>
              <p class="text-3xl font-bold text-primary mt-1">78</p>
            </div>

            <div class="bg-white rounded-xl border p-4 text-center">
              <p class="text-sm text-slate-500">Benar</p>
              <p class="text-3xl font-bold text-emerald-600 mt-1">18</p>
            </div>

            <div class="bg-white rounded-xl border p-4 text-center">
              <p class="text-sm text-slate-500">Salah</p>
              <p class="text-3xl font-bold text-red-500 mt-1">9</p>
            </div>

            <div class="bg-white rounded-xl border p-4 text-center">
              <p class="text-sm text-slate-500">Tidak Dijawab</p>
              <p class="text-3xl font-bold text-slate-400 mt-1">3</p>
            </div>
          </section>

          <section class="bg-white rounded-xl border p-6 mb-6">
            <h3 class="font-semibold text-slate-800 mb-2">Analisis Peringkat</h3>
            <p class="text-sm text-slate-600">
              Peringkat Nasional:
              <b>#12</b>
              dari
              <b>1.245</b>
              peserta
            </p>
            <p class="text-sm text-slate-600 mt-1">
              Peringkat Sekolah:
              <b>#1</b>
            </p>
          </section>

          <section class="bg-white rounded-xl border p-6 mb-6">
            <h3 class="font-semibold text-slate-800 mb-4">Ringkasan Jawaban</h3>

            <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
              <!-- Legend:
            hijau = benar
            merah = salah
            abu = kosong
          -->

              <div class="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center">1</div>
              <div class="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center">2</div>
              <div class="w-10 h-10 rounded-lg bg-red-500 text-white flex items-center justify-center">3</div>
              <div class="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center">4</div>
              <div class="w-10 h-10 rounded-lg bg-red-500 text-white flex items-center justify-center">5</div>
              <div class="w-10 h-10 rounded-lg bg-slate-300 text-slate-700 flex items-center justify-center">6</div>

              <!-- dst... -->
            </div>

            <div class="flex gap-4 text-sm mt-4">
              <div class="flex items-center gap-2">
                <span class="w-4 h-4 bg-emerald-500 rounded"></span>
                Benar
              </div>
              <div class="flex items-center gap-2">
                <span class="w-4 h-4 bg-red-500 rounded"></span>
                Salah
              </div>
              <div class="flex items-center gap-2">
                <span class="w-4 h-4 bg-slate-300 rounded"></span>
                Tidak Dijawab
              </div>
            </div>
          </section>

          <section class="bg-white rounded-xl border p-6">
            <div class="flex flex-col sm:flex-row gap-4">
              <a href="/tryout" class="flex-1 text-center px-6 py-3 rounded-lg border hover:bg-slate-100">
                Kembali ke Batch
              </a>

              <a
                href="/peringkat"
                class="flex-1 text-center px-6 py-3 rounded-lg bg-primary text-white hover:bg-orange-700"
              >
                Lihat Leaderboard
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import Sidebar from "../components/layout/Sidebar.vue"
</script>
