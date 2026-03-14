<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- ================= MAIN ================= -->
      <main class="flex-1">
        <!-- Topbar -->
        <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Manajemen Paket Soal</h1>
            <p class="text-sm text-slate-500">Kelola bank soal berdasarkan subtes dan kategori tryout UTBK/SNBT</p>
          </div>

          <RouterLink
            to="/banksoal/tambah"
            class="px-5 py-2.5 bg-orange-600 text-white text-sm font-semibold rounded-xl shadow-md hover:bg-orange-700 transition"
          >
            + Tambah Soal
          </RouterLink>
        </header>

        <div class="px-6 py-6">
          <section class="bg-white rounded-xl border p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
            <select
              v-model="selectedMapel"
              @change="fetchBankSoal"
              class="px-4 py-2 border rounded-xl text-sm w-full md:w-64 bg-white"
            >
              <option value="">Semua Subtes</option>
              <option v-for="mapel in mapelList" :key="mapel.id || mapel.nama" :value="mapel.nama || mapel">
                {{ mapel.nama || mapel }}
              </option>
            </select>

            <select
              v-model="selectedStatus"
              @change="fetchBankSoal"
              class="px-4 py-2 border rounded-xl text-sm w-full md:w-44 bg-white"
            >
              <option value="">Semua Status Paket</option>
              <option value="draft">Draft</option>
              <option value="aktif">Aktif</option>
            </select>

            <div class="flex items-center gap-2 text-sm">
              <span class="text-slate-500">Tampilkan:</span>
              <select
                v-model.number="perPage"
                @change="handlePerPageChange"
                class="px-3 py-2 border rounded-xl text-sm bg-white"
              >
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
                <option :value="200">200</option>
              </select>
            </div>
          </section>

          <section class="bg-white rounded-xl border overflow-x-auto">
            <table :key="currentPage" class="w-full text-sm">
              <thead class="bg-slate-100">
                <tr>
                  <th class="px-4 py-3 text-left">Subtes</th>
                  <th class="px-4 py-3 text-left">Soal</th>
                  <th class="px-4 py-3 text-center">Penginput</th>
                  <th class="px-4 py-3 text-center">Jumlah Terpakai</th>
                  <th class="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                <tr v-if="loading">
                  <td colspan="5" class="px-4 py-6 text-center text-slate-400">Memuat data...</td>
                </tr>
                <tr v-else-if="bankSoal.length === 0">
                  <td colspan="5" class="px-4 py-8 text-center text-slate-400">
                    Belum ada soal pada subtes ini. Coba ubah filter atau refresh data.
                  </td>
                </tr>

                <tr v-for="item in bankSoal" :key="item.id" class="border-t">
                  <td class="px-4 py-3">{{ item.mapel || item.mapel_nama || "-" }}</td>
                  <td class="px-4 py-3 font-medium">
                    <div v-html="formatSoal(item.pertanyaan)"></div>
                  </td>
                  <td class="px-4 py-3 text-center">{{ item.pembuat }}</td>
                  <td class="px-4 py-3 text-center">{{ item.jumlah_terpakai }}</td>
                  <td class="px-4 py-3 text-center space-x-2">
                    <RouterLink :to="`/banksoal/lihat/${item.id}`" class="text-orange-700 text-xs hover:underline">
                      Lihat
                    </RouterLink>
                    <RouterLink :to="`/banksoal/edit/${item.id}`" class="text-slate-600 text-xs hover:underline">
                      Edit
                    </RouterLink>
                    <a href="#" class="text-red-500 text-xs hover:underline">Hapus</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <div class="flex flex-wrap gap-3 justify-between items-center mt-4 text-sm">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 border rounded disabled:opacity-50"
            >
              ⬅ Sebelumnya
            </button>

            <span>Halaman {{ currentPage }} dari {{ lastPage }}</span>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === lastPage"
              class="px-3 py-1 border rounded disabled:opacity-50"
            >
              Selanjutnya ➡
            </button>
          </div>

          <p class="text-xs text-slate-500 mt-4">
            *Setiap paket soal terhubung ke satu subtes/kategori dan dapat dipakai pada satu atau beberapa batch tryout.
          </p>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue"
import "katex/dist/katex.min.css"
// import { api } from "@/services/api"
import api from "@/services/api"

import Sidebar from "../components/layout/Sidebar.vue"

const bankSoal = ref([])
const loading = ref(true)
const mapelList = ref([])

const selectedMapel = ref("")
const selectedStatus = ref("")

const currentPage = ref(1)
const lastPage = ref(1)
const perPage = ref(50)

const truncate = (text, limit = 100) => {
  if (!text) return "-"

  // Jika mengandung LaTeX, jangan truncate supaya MathJax tidak error
  if (text.includes("$")) {
    return text
  }

  return text.length > limit ? text.slice(0, limit) + "..." : text
}

const formatSoal = (text, limit = 100) => {
  if (!text) return "-"

  let result = text

  // Paksa display math ($$) jadi inline math ($) khusus untuk tabel
  result = result.replace(/\$\$(.*?)\$\$/gs, "$$$1$")

  // Hilangkan newline yang bikin MathJax turun baris
  result = result.replace(/\n+/g, " ")

  // Truncate hanya jika tidak ada LaTeX
  if (!result.includes("$")) {
    return result.length > limit ? result.slice(0, limit) + "..." : result
  }

  return result
}

const fetchBankSoal = async () => {
  try {
    loading.value = true

    const params = {}
    if (selectedMapel.value) params.mapel = selectedMapel.value
    if (selectedStatus.value) params.status = selectedStatus.value

    params.page = currentPage.value
    params.per_page = perPage.value

    const res = await api.get("/banksoal", { params })

    // Support array, normal pagination, or nested resource pagination
    if (Array.isArray(res.data)) {
      bankSoal.value = res.data
      currentPage.value = 1
      lastPage.value = 1
    } else if (Array.isArray(res.data.data)) {
      // Normal Laravel pagination
      bankSoal.value = res.data.data
      currentPage.value = res.data.current_page ?? 1
      lastPage.value = res.data.last_page ?? 1
    } else if (Array.isArray(res.data.data?.data)) {
      // Laravel Resource pagination (nested)
      bankSoal.value = res.data.data.data
      currentPage.value = res.data.data.current_page ?? 1
      lastPage.value = res.data.data.last_page ?? 1
    } else {
      bankSoal.value = []
      currentPage.value = 1
      lastPage.value = 1
    }

    await nextTick()
  } catch (error) {
    console.error("Gagal mengambil bank soal:", error)
    bankSoal.value = []
  } finally {
    loading.value = false
  }
}

const fetchMapel = async () => {
  try {
    const res = await api.get("/mapel")
    mapelList.value = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
  } catch (error) {
    console.error("Gagal mengambil daftar subtes:", error)
    mapelList.value = []
  }
}

const goToPage = (page) => {
  if (page < 1 || page > lastPage.value) return
  currentPage.value = page
  fetchBankSoal()
}

const handlePerPageChange = () => {
  currentPage.value = 1
  fetchBankSoal()
}

onMounted(() => {
  fetchMapel()
  fetchBankSoal()
})
</script>
