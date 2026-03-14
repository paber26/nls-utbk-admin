<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- MAIN -->
      <main class="flex-1">
        <header class="bg-white border-b px-6 py-4">
          <h1 class="text-lg font-semibold text-slate-800">Data Sekolah</h1>
          <p class="text-sm text-slate-500">Daftar sekolah dan statistik peserta tryout UTBK/SNBT</p>
        </header>

        <!-- CONTENT -->
        <div class="px-6 py-6 w-full">
          <section class="bg-white rounded-xl border p-4 mb-6 flex flex-wrap gap-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama sekolah"
              class="px-4 py-2 border rounded-lg text-sm w-full md:w-72"
            />

            <select v-model="filterStatus" class="px-4 py-2 border rounded-lg text-sm w-full md:w-48">
              <option value="">Semua Status</option>
              <option value="Negeri">Negeri</option>
              <option value="Swasta">Swasta</option>
            </select>

            <select v-model="filterPeserta" class="px-4 py-2 border rounded-lg text-sm w-full md:w-48">
              <option value="">Semua Jumlah Peserta</option>
              <option value="ada">Sudah Ada Peserta</option>
              <option value="kosong">Belum Ada Peserta</option>
            </select>

            <select v-model="perPage" class="px-4 py-2 border rounded-lg text-sm w-full md:w-32">
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            <div class="ml-auto">
              <button
                @click="showModal = true"
                class="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700"
              >
                + Tambah Sekolah
              </button>
            </div>
          </section>

          <!-- TABLE SEKOLAH -->
          <section class="bg-white rounded-xl border overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-100">
                <tr>
                  <th class="px-4 py-3 text-center w-12">No</th>
                  <th class="px-4 py-3 text-left">Nama Sekolah</th>
                  <th class="px-4 py-3 text-left">Status</th>
                  <th class="px-4 py-3 text-center">Jumlah Peserta</th>
                  <th class="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                <tr v-if="loading">
                  <td colspan="5" class="px-4 py-6 text-center text-slate-500">Memuat data sekolah...</td>
                </tr>

                <tr v-for="(school, index) in sekolah" :key="school.id" class="border-t">
                  <td class="px-4 py-3 text-center">{{ (currentPage - 1) * perPage + index + 1 }}</td>
                  <td class="px-4 py-3 font-medium">{{ school.nama }}</td>
                  <td class="px-4 py-3">{{ school.status || "-" }}</td>
                  <td class="px-4 py-3 text-center">{{ school.jumlah_peserta || 0 }}</td>
                  <td class="px-4 py-3 text-center">
                    <RouterLink :to="`/sekolah/detail/${school.id}`" class="text-orange-700 text-xs hover:underline">
                      Detail
                    </RouterLink>
                  </td>
                </tr>

                <tr v-if="!loading && sekolah.length === 0">
                  <td colspan="5" class="px-4 py-6 text-center text-slate-500">Belum ada data sekolah</td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- PAGINATION -->
          <div class="flex justify-between items-center mt-4">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-3 py-1 text-xs border rounded disabled:opacity-40"
            >
              Previous
            </button>

            <span class="text-xs text-slate-500">Halaman {{ currentPage }} dari {{ totalPages }}</span>

            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 text-xs border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>

          <!-- INFO -->
          <p class="text-xs text-slate-500 mt-4">*Statistik sekolah dihitung berdasarkan akumulasi partisipasi dan hasil peserta.</p>
        </div>
        <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div class="bg-white w-full max-w-md rounded-xl p-6">
            <h2 class="text-lg font-semibold mb-4">Tambah Sekolah</h2>

            <input
              v-model="form.nama"
              type="text"
              placeholder="Nama Sekolah"
              class="w-full mb-3 px-4 py-2 border rounded-lg text-sm"
            />

            <input
              v-model="form.npsn"
              type="text"
              placeholder="NPSN"
              class="w-full mb-3 px-4 py-2 border rounded-lg text-sm"
            />

            <input
              v-model="form.jenjang"
              type="text"
              placeholder="Jenjang (contoh: SMA / SMK / MAN / dll)"
              class="w-full mb-3 px-4 py-2 border rounded-lg text-sm"
            />

            <select v-model="form.status" class="w-full mb-4 px-4 py-2 border rounded-lg text-sm">
              <option value="">Pilih Status</option>
              <option value="Negeri">Negeri</option>
              <option value="Swasta">Swasta</option>
            </select>

            <div class="flex justify-end gap-2">
              <button @click="showModal = false" class="px-4 py-2 text-sm border rounded-lg">Batal</button>

              <button @click="submitSekolah" class="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg">
                Simpan
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { RouterLink } from "vue-router"
import Sidebar from "../components/layout/Sidebar.vue"
import api from "@/services/api"

const sekolahRaw = ref([])
const loading = ref(false)

const searchQuery = ref("")
const filterStatus = ref("")
const filterPeserta = ref("")

const currentPage = ref(1)
const perPage = ref(20)

const showModal = ref(false)

const form = ref({
  nama: "",
  npsn: "",
  jenjang: "",
  status: ""
})

const submitSekolah = async () => {
  try {
    await api.post("/sekolah", form.value)
    showModal.value = false
    form.value = { nama: "", npsn: "", jenjang: "", status: "" }
    fetchSchools()
  } catch (err) {
    console.error("Gagal menambahkan sekolah:", err)
  }
}

const totalPages = computed(() => {
  return Math.ceil(filteredSekolah.value.length / perPage.value) || 1
})

const filteredSekolah = computed(() => {
  return sekolahRaw.value.filter((item) => {
    const matchSearch = item.nama.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchStatus = !filterStatus.value || item.status === filterStatus.value

    const matchPeserta =
      !filterPeserta.value ||
      (filterPeserta.value === "ada" && item.jumlah_peserta > 0) ||
      (filterPeserta.value === "kosong" && (!item.jumlah_peserta || item.jumlah_peserta === 0))

    return matchSearch && matchStatus && matchPeserta
  })
})

const sekolah = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredSekolah.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const fetchSchools = async () => {
  loading.value = true
  try {
    const res = await api.get("/sekolah")
    sekolahRaw.value = res.data.data || res.data
  } catch (err) {
    console.error("Gagal mengambil data sekolah:", err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSchools()
})
</script>
