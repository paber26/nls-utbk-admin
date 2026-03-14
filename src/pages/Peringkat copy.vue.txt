<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- ================= MAIN ================= -->
      <main class="flex-1">
        <!-- Topbar -->
        <header class="bg-white border-b px-6 py-4">
          <h1 class="text-lg font-semibold text-slate-800">Peringkat</h1>
          <p class="text-sm text-slate-500">Lihat peringkat berdasarkan hasil tryout</p>
        </header>

        <!-- Content -->
        <div class="px-6 py-8">
          <!-- Filter -->
          <section class="flex flex-wrap gap-4 mb-6">
            <select class="px-4 py-2 rounded-lg border text-sm bg-white">
              <option>Nasional</option>
              <option>Sekolah</option>
            </select>

            <select class="px-4 py-2 rounded-lg border text-sm bg-white">
              <option>Semua Mapel</option>
              <option>Matematika</option>
              <option>Fisika</option>
              <option>Kimia</option>
              <option>Biologi</option>
              <option>Informatika</option>
            </select>

            <select class="px-4 py-2 rounded-lg border text-sm bg-white">
              <option>Tryout Terbaru</option>
              <option>Tryout #1</option>
              <option>Tryout #2</option>
            </select>
          </section>

          <!-- Leaderboard -->
          <section class="bg-white rounded-xl border overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-slate-100">
                <tr>
                  <th class="px-4 py-3 text-left">Peringkat</th>
                  <th class="px-4 py-3 text-left">Nama</th>
                  <th class="px-4 py-3 text-left">Sekolah</th>
                  <th class="px-4 py-3 text-center">Nilai</th>
                </tr>
              </thead>

              <tbody>
                <!-- Top 1 -->
                <tr class="border-t bg-yellow-50">
                  <td class="px-4 py-3 font-semibold">🥇 1</td>
                  <td class="px-4 py-3 font-medium">Budi Santoso</td>
                  <td class="px-4 py-3">SMA Negeri 1 Jakarta</td>
                  <td class="px-4 py-3 text-center font-semibold">95</td>
                </tr>

                <!-- Top 2 -->
                <tr class="border-t bg-slate-50">
                  <td class="px-4 py-3 font-semibold">🥈 2</td>
                  <td class="px-4 py-3 font-medium">Siti Aisyah</td>
                  <td class="px-4 py-3">SMA Negeri 3 Bandung</td>
                  <td class="px-4 py-3 text-center font-semibold">92</td>
                </tr>

                <!-- Top 3 -->
                <tr class="border-t bg-slate-50">
                  <td class="px-4 py-3 font-semibold">🥉 3</td>
                  <td class="px-4 py-3 font-medium">Andi Pratama</td>
                  <td class="px-4 py-3">SMA Negeri 2 Surabaya</td>
                  <td class="px-4 py-3 text-center font-semibold">90</td>
                </tr>

                <!-- Others -->
                <tr class="border-t">
                  <td class="px-4 py-3">4</td>
                  <td class="px-4 py-3">Rina Putri</td>
                  <td class="px-4 py-3">SMA Negeri 5 Medan</td>
                  <td class="px-4 py-3 text-center">88</td>
                </tr>

                <tr class="border-t bg-indigo-50">
                  <td class="px-4 py-3 font-semibold">12</td>
                  <td class="px-4 py-3 font-medium">Aldo</td>
                  <td class="px-4 py-3">SMA Negeri …</td>
                  <td class="px-4 py-3 text-center font-semibold">78</td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- Note -->
          <p class="text-xs text-slate-400 mt-4">*Peringkat diperbarui secara otomatis setelah tryout selesai.</p>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router"

import Sidebar from "../components/layout/Sidebar.vue"
import TopbarPeringkat from "../components/layout/TopbarPeringkat.vue"
</script>
