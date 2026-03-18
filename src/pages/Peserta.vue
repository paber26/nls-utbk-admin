<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- ================= MAIN ================= -->
      <main class="flex-1">
        <header class="bg-white border-b px-6 py-4">
          <h1 class="text-lg font-semibold text-slate-800">Manajemen Peserta</h1>
          <p class="text-sm text-slate-500">Daftar seluruh peserta yang terdaftar pada platform tryout UTBK/SNBT</p>
        </header>

        <!-- Content -->
        <div class="px-6 py-6">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <div class="text-sm text-slate-600">
              <span class="font-medium">Lengkap:</span>
              {{ countLengkap }}
              <span class="mx-2">•</span>
              <span class="font-medium">Belum Lengkap:</span>
              {{ countBelum }}
            </div>
            <button
              @click="showModal = true"
              class="px-5 py-2.5 bg-orange-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-orange-700 transition"
            >
              + Tambah Peserta
            </button>
          </div>
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

            <select
              v-model="perPage"
              @change="handlePerPageChange"
              class="px-4 py-2 border rounded-lg text-sm w-full md:w-40"
            >
              <option :value="10">10 / halaman</option>
              <option :value="20">20 / halaman</option>
              <option :value="50">50 / halaman</option>
              <option :value="100">100 / halaman</option>
              <option :value="200">200 / halaman</option>
            </select>
          </section>

          <!-- ================= TABLE ================= -->
          <section class="bg-white rounded-xl border overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-100">
                <tr>
                  <th class="px-4 py-3 text-center w-12">No</th>
                  <th class="px-4 py-3 text-left">Nama</th>
                  <th class="px-4 py-3 text-left">Email</th>
                  <th class="px-4 py-3 text-left">Sekolah</th>
                  <th class="px-4 py-3 text-center">Kelas</th>
                  <th class="px-4 py-3 text-left">WhatsApp</th>
                  <th class="px-4 py-3 text-center">Status</th>
                  <th class="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(peserta, index) in pesertaList" :key="peserta.id" class="border-t">
                  <td class="px-4 py-3 text-center text-slate-500">
                    {{ index + 1 }}
                  </td>
                  <td class="px-4 py-3 font-medium">
                    {{ peserta.nama_lengkap }}
                  </td>
                  <td class="px-4 py-3 text-slate-600">
                    {{ peserta.email }}
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
                    <RouterLink :to="`/peserta/detail/${peserta.id}`" class="text-orange-700 text-xs hover:underline">
                      Detail
                    </RouterLink>
                    <button
                      v-if="peserta.status_profil !== 'Lengkap'"
                      @click="deletePeserta(peserta.id)"
                      class="text-red-500 text-xs hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- ================= PAGINATION ================= -->
          <div class="flex justify-between items-center mt-4 text-sm text-slate-600">
            <span>
              Menampilkan {{ (currentPage - 1) * perPage + 1 }}– {{ Math.min(currentPage * perPage, total) }} dari
              {{ total }} peserta
            </span>

            <div class="flex gap-2">
              <button
                class="px-3 py-1 border rounded"
                :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
              >
                Prev
              </button>

              <button v-if="startPage > 1" class="px-3 py-1 border rounded" @click="changePage(1)">1</button>

              <span v-if="startPage > 2" class="px-2">...</span>

              <button
                v-for="page in visiblePages"
                :key="page"
                class="px-3 py-1 border rounded"
                :class="page === currentPage ? 'bg-orange-600 text-white border-orange-600' : ''"
                @click="changePage(page)"
              >
                {{ page }}
              </button>

              <span v-if="endPage < lastPage - 1" class="px-2">...</span>

              <button v-if="endPage < lastPage" class="px-3 py-1 border rounded" @click="changePage(lastPage)">
                {{ lastPage }}
              </button>

              <button
                class="px-3 py-1 border rounded"
                :disabled="currentPage === lastPage"
                @click="changePage(currentPage + 1)"
              >
                Next
              </button>
            </div>
          </div>

          <!-- ================= MODAL TAMBAH PESERTA ================= -->
          <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div class="bg-white w-[500px] rounded-xl p-6 relative">
              <button @click="closeModal" class="absolute top-3 right-3 text-slate-500">✕</button>
              <h2 class="text-lg font-semibold mb-4">Tambah Peserta</h2>

              <div class="space-y-3">
                <div class="relative">
                  <input
                    v-model="sekolahSearch"
                    type="text"
                    placeholder="Cari & pilih sekolah..."
                    class="w-full px-4 py-2 border rounded-lg text-sm"
                    @focus="showSekolahDropdown = true"
                  />

                  <div
                    v-if="showSekolahDropdown && filteredSekolah.length"
                    class="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white border rounded-lg shadow"
                  >
                    <div
                      v-for="s in filteredSekolah"
                      :key="s.id"
                      @click="selectSekolah(s)"
                      class="px-4 py-2 text-sm hover:bg-orange-50 cursor-pointer"
                    >
                      {{ s.nama }}
                    </div>
                  </div>
                </div>

                <input
                  v-model="form.nama_lengkap"
                  type="text"
                  placeholder="Nama Lengkap"
                  class="w-full px-4 py-2 border rounded-lg text-sm"
                />

                <select v-model="form.kelas" class="w-full px-4 py-2 border rounded-lg text-sm">
                  <option value="">Pilih Kelas</option>
                  <option value="X">X</option>
                  <option value="XI">XI</option>
                  <option value="XII">XII</option>
                </select>

                <input
                  v-model="form.email"
                  type="email"
                  placeholder="Alamat Email"
                  class="w-full px-4 py-2 border rounded-lg text-sm"
                />

                <input
                  v-model="form.whatsapp"
                  type="tel"
                  placeholder="No Whatsapp, Contoh: 08xxxx"
                  class="w-full px-4 py-2 border rounded-lg text-sm"
                  @input="form.whatsapp = form.whatsapp.replace(/[^0-9]/g, '')"
                />
              </div>

              <div class="flex justify-end gap-2 mt-6">
                <button @click="closeModal" class="px-4 py-2 border rounded text-sm">Batal</button>
                <button @click="submitPeserta" class="px-4 py-2 bg-orange-600 text-white rounded text-sm">
                  Simpan
                </button>
              </div>
            </div>
          </div>
          <div v-if="showPopup" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div class="bg-white w-[350px] rounded-xl p-6 text-center">
              <p class="text-sm text-slate-700 mb-4">{{ popupMessage }}</p>
              <button
                @click="showPopup = false"
                class="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700"
              >
                OK
              </button>
            </div>
          </div>
          <div v-if="showConfirmPopup" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div class="bg-white w-[350px] rounded-xl p-6 text-center">
              <p class="text-sm text-slate-700 mb-4">Apakah Anda yakin ingin menghapus peserta ini?</p>
              <div class="flex justify-center gap-2">
                <button @click="cancelDelete" class="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">
                  Batal
                </button>
                <button
                  @click="confirmDelete"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue"
import api from "@/services/api"

import Sidebar from "../components/layout/Sidebar.vue"

const pesertaList = ref([])

const searchQuery = ref("")
const filterSekolah = ref("")
const filterKelas = ref("")
const filterStatus = ref("")

const currentPage = ref(1)
const lastPage = ref(1)
const total = ref(0)
const perPage = ref(10)

const showModal = ref(false)
const showPopup = ref(false)
const popupMessage = ref("")

const showConfirmPopup = ref(false)
const pesertaIdToDelete = ref(null)

const sekolahOptions = ref([])

const sekolahSearch = ref("")
const showSekolahDropdown = ref(false)

const form = ref({
  sekolah_id: "",
  nama_lengkap: "",
  kelas: "",
  email: "",
  whatsapp: ""
})

const filteredSekolah = computed(() => {
  if (!sekolahSearch.value) return sekolahOptions.value
  return sekolahOptions.value.filter((s) => s.nama.toLowerCase().includes(sekolahSearch.value.toLowerCase()))
})

const countLengkap = ref(0)
const countBelum = ref(0)

const fetchStatusCounts = async () => {
  try {
    const [resLengkap, resBelum] = await Promise.all([
      api.get("/peserta", { params: { status: "Lengkap", per_page: 1 } }),
      api.get("/peserta", { params: { status: "Belum Lengkap", per_page: 1 } })
    ])

    countLengkap.value = resLengkap.data.total ?? 0
    countBelum.value = resBelum.data.total ?? 0
  } catch (err) {
    console.error("Gagal mengambil statistik status peserta:", err)
  }
}

const selectSekolah = (sekolah) => {
  form.value.sekolah_id = sekolah.id
  sekolahSearch.value = sekolah.nama
  showSekolahDropdown.value = false
}

watch([searchQuery, filterSekolah, filterKelas, filterStatus], () => {
  currentPage.value = 1
  fetchPeserta()
})

const fetchPeserta = async () => {
  try {
    const response = await api.get("/peserta", {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: searchQuery.value,
        sekolah: filterSekolah.value,
        kelas: filterKelas.value,
        status: filterStatus.value
      }
    })

    pesertaList.value = response.data.data
    currentPage.value = response.data.current_page
    lastPage.value = response.data.last_page
    total.value = response.data.total
  } catch (error) {
    console.error("Gagal mengambil data peserta:", error)
  }
}

const fetchSekolah = async () => {
  try {
    const res = await api.get("/sekolah", { params: { per_page: 1000 } })
    sekolahOptions.value = res.data.data ?? res.data
  } catch (err) {
    console.error("Gagal mengambil sekolah:", err)
  }
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    sekolah_id: "",
    nama_lengkap: "",
    kelas: "",
    email: "",
    whatsapp: ""
  }
  sekolahSearch.value = ""
  showSekolahDropdown.value = false
}

const submitPeserta = async () => {
  // ===== VALIDASI FRONTEND =====
  if (!form.value.sekolah_id) {
    popupMessage.value = "Sekolah wajib dipilih"
    showPopup.value = true
    return
  }

  if (!form.value.nama_lengkap) {
    popupMessage.value = "Nama lengkap wajib diisi"
    showPopup.value = true
    return
  }

  if (!form.value.kelas) {
    popupMessage.value = "Kelas wajib dipilih"
    showPopup.value = true
    return
  }

  if (!form.value.email) {
    popupMessage.value = "Email wajib diisi"
    showPopup.value = true
    return
  }

  // Validasi format email sederhana
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    popupMessage.value = "Format email tidak valid"
    showPopup.value = true
    return
  }

  if (!form.value.whatsapp) {
    popupMessage.value = "Nomor WhatsApp wajib diisi"
    showPopup.value = true
    return
  }

  // Validasi nomor Indonesia (harus mulai dengan 08 dan 10–15 digit)
  const waRegex = /^08[0-9]{8,13}$/
  if (!waRegex.test(form.value.whatsapp)) {
    popupMessage.value = "Nomor WhatsApp harus diawali 08 dan hanya berisi angka"
    showPopup.value = true
    return
  }

  try {
    await api.post("/peserta", form.value)

    popupMessage.value = "Peserta berhasil ditambahkan"
    showPopup.value = true

    closeModal()
    fetchPeserta()
    await fetchStatusCounts()
  } catch (err) {
    console.error("Gagal menambahkan peserta:", err)

    const response = err.response?.data

    // Jika email sudah pernah terdaftar
    if (response?.errors?.email) {
      popupMessage.value = "Peserta dengan email tersebut sudah terdaftar"
      showPopup.value = true
      return
    }

    popupMessage.value = "Gagal menambahkan peserta. Periksa kembali data yang diisi."
    showPopup.value = true
  }
}

const deletePeserta = (id) => {
  pesertaIdToDelete.value = id
  showConfirmPopup.value = true
}

const confirmDelete = async () => {
  try {
    await api.delete(`/peserta/${pesertaIdToDelete.value}`)
    popupMessage.value = "Peserta berhasil dihapus"
    showPopup.value = true
    fetchPeserta()
    await fetchStatusCounts()
  } catch (error) {
    console.error("Gagal menghapus peserta:", error)
    popupMessage.value = "Gagal menghapus peserta"
    showPopup.value = true
  } finally {
    showConfirmPopup.value = false
    pesertaIdToDelete.value = null
  }
}

const cancelDelete = () => {
  showConfirmPopup.value = false
  pesertaIdToDelete.value = null
}

// Jumlah halaman pagination yang ditampilkan di UI (misal: 5 tombol halaman)
const maxVisible = 5

const startPage = computed(() => {
  return Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
})

const endPage = computed(() => {
  return Math.min(lastPage.value, startPage.value + maxVisible - 1)
})

const visiblePages = computed(() => {
  const pages = []
  for (let i = startPage.value; i <= endPage.value; i++) {
    pages.push(i)
  }
  return pages
})

const changePage = (page) => {
  if (page < 1 || page > lastPage.value) return
  currentPage.value = page
  fetchPeserta()
}

const handlePerPageChange = () => {
  currentPage.value = 1
  fetchPeserta()
}

onMounted(() => {
  fetchPeserta()
  fetchSekolah()
  fetchStatusCounts()
})
</script>
