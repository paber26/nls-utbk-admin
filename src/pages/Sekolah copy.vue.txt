<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- MAIN -->
      <main class="flex-1">
        <!-- TOPBAR -->
        <header class="bg-white border-b px-6 py-4">
          <h1 class="text-lg font-semibold text-slate-800">Data Sekolah</h1>
          <p class="text-sm text-slate-500">Daftar sekolah dan statistik peserta</p>
        </header>

        <!-- CONTENT -->
        <div class="px-6 py-6 w-full">
          <!-- FILTER -->
          <section class="bg-white rounded-xl border p-4 mb-6 flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Cari nama sekolah"
              class="px-4 py-2 border rounded-lg text-sm w-full md:w-72"
            />

            <select class="px-4 py-2 border rounded-lg text-sm w-full md:w-48">
              <option>Semua Provinsi</option>
              <option>DKI Jakarta</option>
              <option>Jawa Barat</option>
              <option>Jawa Tengah</option>
              <option>Sulawesi Utara</option>
            </select>
          </section>

          <!-- TABLE SEKOLAH -->
          <section class="bg-white rounded-xl border overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-100">
                <tr>
                  <th class="px-4 py-3 text-left">Nama Sekolah</th>
                  <th class="px-4 py-3 text-left">Provinsi</th>
                  <th class="px-4 py-3 text-center">Jumlah Peserta</th>
                  <th class="px-4 py-3 text-center">Peringkat Nasional</th>
                  <th class="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                <tr class="border-t">
                  <td class="px-4 py-3 font-medium">SMA Negeri 1 Jakarta</td>
                  <td class="px-4 py-3">DKI Jakarta</td>
                  <td class="px-4 py-3 text-center">124</td>
                  <td class="px-4 py-3 text-center font-semibold">3</td>
                  <td class="px-4 py-3 text-center">
                    <RouterLink to="/sekolah/detail/ini" class="text-indigo-500 text-xs hover:underline">
                      Detail
                    </RouterLink>
                  </td>
                </tr>

                <tr class="border-t bg-slate-50">
                  <td class="px-4 py-3 font-medium">SMA Negeri 3 Bandung</td>
                  <td class="px-4 py-3">Jawa Barat</td>
                  <td class="px-4 py-3 text-center">98</td>
                  <td class="px-4 py-3 text-center font-semibold">7</td>
                  <td class="px-4 py-3 text-center">
                    <RouterLink to="/sekolah/detail/ini" class="text-indigo-500 text-xs hover:underline">
                      Detail
                    </RouterLink>
                  </td>
                </tr>

                <tr class="border-t">
                  <td class="px-4 py-3 font-medium">SMA Negeri 1 Manado</td>
                  <td class="px-4 py-3">Sulawesi Utara</td>
                  <td class="px-4 py-3 text-center">56</td>
                  <td class="px-4 py-3 text-center font-semibold">18</td>
                  <td class="px-4 py-3 text-center">
                    <RouterLink to="/sekolah/detail/ini" class="text-indigo-500 text-xs hover:underline">
                      Detail
                    </RouterLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- INFO -->
          <p class="text-xs text-slate-500 mt-4">*Peringkat sekolah dihitung berdasarkan akumulasi nilai peserta.</p>
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
