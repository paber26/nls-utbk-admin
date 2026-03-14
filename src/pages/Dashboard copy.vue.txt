<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- ================= MAIN ================= -->
      <main class="flex-1">
        <!-- Topbar -->
        <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Dashboard Admin</h1>
            <p class="text-sm text-slate-500">Ringkasan aktivitas platform</p>
          </div>

          <div class="text-right text-sm">
            <p class="font-medium text-slate-800">Admin</p>
            <p class="text-slate-500">Super Administrator</p>
          </div>
        </header>

        <!-- Content -->
        <div class="px-6 py-8">
          <!-- ================= SUMMARY ================= -->
          <section class="grid md:grid-cols-4 gap-6 mb-10">
            <div class="bg-white p-6 rounded-xl border">
              <p class="text-sm text-slate-500">Total Peserta</p>
              <h2 class="text-3xl font-semibold text-slate-800 mt-2">3.462</h2>
            </div>

            <div class="bg-white p-6 rounded-xl border">
              <p class="text-sm text-slate-500">Total Sekolah</p>
              <h2 class="text-3xl font-semibold text-slate-800 mt-2">128</h2>
            </div>

            <div class="bg-white p-6 rounded-xl border">
              <p class="text-sm text-slate-500">Total Tryout</p>
              <h2 class="text-3xl font-semibold text-slate-800 mt-2">24</h2>
            </div>

            <div class="bg-white p-6 rounded-xl border">
              <p class="text-sm text-slate-500">Total Soal</p>
              <h2 class="text-3xl font-semibold text-slate-800 mt-2">720</h2>
            </div>
          </section>

          <!-- ================= QUICK ACTION ================= -->
          <section class="grid md:grid-cols-3 gap-6 mb-10">
            <a href="admin-bank-soal.html" class="bg-white p-6 rounded-xl border hover:border-primary transition">
              <h3 class="font-semibold text-slate-800 mb-1">➕ Tambah Soal</h3>
              <p class="text-sm text-slate-500">Input dan kelola bank soal</p>
            </a>

            <a href="admin-tryout.html" class="bg-white p-6 rounded-xl border hover:border-primary transition">
              <h3 class="font-semibold text-slate-800 mb-1">📝 Buat Tryout</h3>
              <p class="text-sm text-slate-500">Atur jadwal & paket soal</p>
            </a>

            <a href="admin-peringkat.html" class="bg-white p-6 rounded-xl border hover:border-primary transition">
              <h3 class="font-semibold text-slate-800 mb-1">🏆 Lihat Peringkat</h3>
              <p class="text-sm text-slate-500">Ranking nasional & sekolah</p>
            </a>
          </section>

          <!-- ================= AKTIVITAS TERBARU ================= -->
          <section class="bg-white rounded-xl border p-6">
            <h3 class="font-semibold text-slate-800 mb-4">Aktivitas Terbaru</h3>

            <ul class="text-sm text-slate-600 space-y-3">
              <li>👨‍🎓 25 peserta baru mendaftar hari ini</li>
              <li>📝 Tryout OSN Matematika #3 berhasil dibuat</li>
              <li>📚 30 soal baru ditambahkan ke Bank Soal</li>
              <li>🏫 SMA Negeri 2 Surabaya bergabung</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router"

import Sidebar from "../components/layout/Sidebar.vue"
import TopbarDashboard from "../components/layout/TopbarDashboard.vue"
</script>
