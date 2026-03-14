<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- ================= MAIN ================= -->
      <main class="flex-1">
        <!-- Topbar -->
        <header class="bg-white border-b px-6 py-4">
          <h1 class="text-lg font-semibold text-slate-800">Kelola Peserta</h1>
          <p class="text-sm text-slate-500">Daftar seluruh peserta yang terdaftar di platform</p>
        </header>

        <!-- Content -->
        <div class="px-6 py-6">
          <!-- ================= FILTER ================= -->
          <section class="bg-white rounded-xl border p-4 mb-6 flex flex-wrap gap-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama / email"
              class="px-4 py-2 border rounded-lg text-sm w-full md:w-64"
            />

            <input
              v-model="filterSekolah"
              type="text"
              placeholder="Sekolah"
              class="px-4 py-2 border rounded-lg text-sm w-full md:w-56"
            />

            <select v-model="filterKelas" class="px-4 py-2 border rounded-lg text-sm w-full md:w-32">
              <option value="">Kelas</option>
              <option value="X">X</option>
              <option value="XI">XI</option>
              <option value="XII">XII</option>
            </select>

            <select v-model="filterStatus" class="px-4 py-2 border rounded-lg text-sm w-full md:w-40">
              <option value="">Status Profil</option>
              <option value="Lengkap">Lengkap</option>
              <option value="Belum Lengkap">Belum Lengkap</option>
            </select>
          </section>

          <!-- ================= TABLE ================= -->
          <section class="bg-white rounded-xl border overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-100">
                <tr>
                  <th class="px-4 py-3 text-center w-12">No</th>
                  <th class="px-4 py-3 text-left">Nama</th>
                  <th class="px-4 py-3 text-left">Sekolah</th>
                  <th class="px-4 py-3 text-center">Kelas</th>
                  <th class="px-4 py-3 text-left">WhatsApp</th>
                  <th class="px-4 py-3 text-center">Status</th>
                  <th class="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(peserta, index) in filteredPeserta" :key="peserta.id" class="border-t">
                  <td class="px-4 py-3 text-center text-slate-500">
                    {{ index + 1 }}
                  </td>
                  <td class="px-4 py-3 font-medium">
                    {{ peserta.nama_lengkap }}
                  </td>
                  <td class="px-4 py-3">
                    {{ peserta.sekolah_nama }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    {{ peserta.kelas }}
                  </td>
                  <td class="px-4 py-3">
                    {{ peserta.whatsapp }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span
                      v-if="peserta.status_profil === 'Lengkap'"
                      class="px-2 py-1 text-xs bg-emerald-100 text-emerald-600 rounded"
                    >
                      Lengkap
                    </span>
                    <span v-else class="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">Belum Lengkap</span>
                  </td>
                  <td class="px-4 py-3 text-center space-x-2">
                    <RouterLink :to="`/peserta/detail/${peserta.id}`" class="text-primary text-xs hover:underline">
                      Detail
                    </RouterLink>
                    <a href="#" class="text-red-500 text-xs hover:underline">Nonaktifkan</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- ================= PAGINATION ================= -->
          <div class="flex justify-between items-center mt-4 text-sm text-slate-600">
            <span>Menampilkan 1–10 dari 3.462 peserta</span>

            <div class="flex gap-2">
              <button class="px-3 py-1 border rounded">Prev</button>
              <button class="px-3 py-1 border rounded bg-primary text-white">1</button>
              <button class="px-3 py-1 border rounded">2</button>
              <button class="px-3 py-1 border rounded">Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import api from "@/services/api"

import Sidebar from "../components/layout/Sidebar.vue"

const pesertaList = ref([])

const searchQuery = ref("")
const filterSekolah = ref("")
const filterKelas = ref("")
const filterStatus = ref("")

const filteredPeserta = computed(() => {
  return pesertaList.value.filter((p) => {
    const matchSearch =
      !searchQuery.value ||
      p.nama_lengkap?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchSekolah =
      !filterSekolah.value || p.sekolah_nama?.toLowerCase().includes(filterSekolah.value.toLowerCase())

    const matchKelas = !filterKelas.value || p.kelas === filterKelas.value

    const matchStatus = !filterStatus.value || p.status_profil === filterStatus.value

    return matchSearch && matchSekolah && matchKelas && matchStatus
  })
})

const fetchPeserta = async () => {
  try {
    const response = await api.get("/peserta")
    pesertaList.value = response.data
    console.log("Data peserta berhasil diambil:", response.data)
  } catch (error) {
    console.error("Gagal mengambil data peserta:", error)
  }
}

onMounted(() => {
  fetchPeserta()
})
</script>
