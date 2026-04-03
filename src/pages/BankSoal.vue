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
            <p class="text-sm text-slate-500">Kelola bank soal berdasarkan komponen dan kategori tryout SNBT</p>
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
              v-model="selectedKomponen"
              @change="fetchBankSoal"
              class="px-4 py-2 border rounded-xl text-sm w-full md:w-64 bg-white"
            >
              <option value="">Semua Komponen</option>
              <option v-for="komponen in komponenList" :key="komponen" :value="komponen">
                {{ komponen }}
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
                  <th class="px-4 py-3 text-center">No.</th>
                  <th class="px-4 py-3 text-left">Komponen</th>
                  <th class="px-4 py-3 text-left">Soal</th>
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
                    Belum ada soal pada komponen ini. Coba ubah filter atau refresh data.
                  </td>
                </tr>

                <tr v-for="(item, index) in bankSoal" :key="item.id" class="border-t">
                  <td class="px-4 py-3 text-center">{{ (currentPage - 1) * perPage + index + 1 }}</td>
                  <td class="px-4 py-3">
                    {{ item.komponen || item.komponen_nama || "-" }}
                    <br />
                    <small class="text-slate-500">{{ item.pembuat }}</small>
                  </td>
                  <td class="px-4 py-3 font-medium min-w-96">
                    <div v-html="formatSoal(item.pertanyaan)"></div>
                  </td>
                  <td class="px-4 py-3 text-center">{{ item.jumlah_terpakai }}</td>
                  <td class="px-4 py-3 text-center space-x-2">
                    <button @click="bukaPreview(item.id)" class="text-orange-700 text-xs hover:underline font-medium">
                      Lihat
                    </button>
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
            *Setiap paket soal terhubung ke satu komponen dan dapat dipakai pada satu atau beberapa batch tryout.
          </p>
        </div>

        <!-- POPUP PREVIEW SOAL -->
        <div v-if="showPreview" class="fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity" @click="showPreview = false">
          <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden" @click.stop>
            <div class="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h3 class="font-semibold text-lg text-slate-800">Preview Soal</h3>
              <button @click="showPreview = false" class="text-slate-400 hover:text-red-500 transition border rounded-full p-1.5 bg-white hover:bg-red-50 shadow-sm">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div class="p-6 overflow-y-auto preview-container custom-scrollbar bg-white">
              <div v-if="previewLoading" class="py-16 text-center text-slate-500 flex flex-col items-center">
                 <svg class="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Memuat detail soal...
              </div>
              <div v-else-if="detailSoal" class="space-y-6">
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <span class="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] uppercase tracking-wider font-bold border">{{ detailSoal.komponen || detailSoal.komponen_nama || '-' }}</span>
                  <span class="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] uppercase tracking-wider font-bold border border-blue-100">
                    {{ detailSoal.tipe === 'pg' ? 'Pilihan Ganda' : detailSoal.tipe === 'isian' ? 'Isian Singkat' : detailSoal.tipe === 'pg_kompleks' ? 'PG Kompleks' : detailSoal.tipe === 'pg_majemuk' ? 'PG Majemuk' : detailSoal.tipe }}
                  </span>
                </div>
                
                <div>
                  <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Pertanyaan</h4>
                  <div class="prose prose-sm max-w-none text-slate-800 bg-slate-50 p-4 rounded-xl border" v-html="detailSoal.pertanyaan"></div>
                </div>

                <div v-if="detailSoal.tipe === 'isian'">
                  <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Jawaban</h4>
                  <p class="font-medium text-emerald-700 bg-emerald-50 px-4 py-3 rounded-lg border border-emerald-200 inline-block">{{ detailSoal.jawaban }}</p>
                </div>

                <div v-if="detailSoal.tipe === 'pg' || detailSoal.tipe === 'pg_majemuk'">
                  <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Opsi Jawaban</h4>
                  <div class="space-y-2">
                    <div v-for="(opsi, i) in detailSoal.opsi_jawaban" :key="i" class="flex items-start gap-3 p-3 rounded-xl border transition-colors" :class="opsi.is_correct ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-slate-200'">
                       <div class="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full text-sm font-semibold border" :class="opsi.is_correct ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' : 'bg-slate-100 border-slate-200 text-slate-600'">{{ String.fromCharCode(65 + i) }}</div>
                       <div class="flex-1 text-sm prose prose-sm max-w-none text-slate-800" :class="opsi.is_correct ? 'font-medium' : ''" v-html="opsi.text"></div>
                       <div class="flex flex-col items-end gap-1 mt-0.5">
                         <span v-if="opsi.is_correct" class="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wide">Benar</span>
                         <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium border">{{ opsi.poin }} poin</span>
                       </div>
                    </div>
                  </div>
                </div>

                <div v-if="detailSoal.tipe === 'pg_kompleks'">
                   <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Pernyataan</h4>
                   <div class="space-y-2">
                      <div v-for="(item, idx) in detailSoal.pernyataan" :key="idx" class="flex items-start gap-3 p-3 rounded-xl border bg-white border-slate-200">
                        <span class="font-bold text-slate-400 mt-0.5">{{ idx + 1 }}.</span>
                        <div class="flex-1 text-sm prose prose-sm max-w-none text-slate-800" v-html="item.text"></div>
                        <span class="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border" :class="item.jawaban ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'">{{ item.jawaban ? 'Benar' : 'Salah' }}</span>
                      </div>
                   </div>
                </div>

              </div>
            </div>

            <div class="p-4 border-t bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button @click="showPreview = false" class="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 shadow-sm rounded-lg hover:bg-slate-50 transition-colors">Tutup</button>
              <RouterLink v-if="detailSoal" :to="`/banksoal/lihat/${detailSoal.id}`" target="_blank" class="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-2 transition-colors">
                Lihat Detail Penuh →
              </RouterLink>
            </div>
          </div>
        </div>

      </main>
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue"
import katex from "katex"
import renderMathInElement from "katex/contrib/auto-render"
import "katex/dist/katex.min.css"
// import { api } from "@/services/api"
import api from "@/services/api"

import Sidebar from "../components/layout/Sidebar.vue"

const bankSoal = ref([])
const loading = ref(true)
const komponenList = ref([])

const selectedKomponen = ref("")
const selectedStatus = ref("")

const currentPage = ref(1)
const lastPage = ref(1)
const perPage = ref(50)

// --- State Preview Modal ---
const showPreview = ref(false)
const previewLoading = ref(false)
const detailSoal = ref(null)

const renderKatexForPreview = () => {
  nextTick(() => {
    const el = document.querySelector('.preview-container')
    if (el) {
      renderMathInElement(el, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ],
        throwOnError: false
      })
    }
  })
}

const bukaPreview = async (id) => {
  showPreview.value = true
  previewLoading.value = true
  detailSoal.value = null
  try {
    const res = await api.get(`/banksoal/${id}`)
    detailSoal.value = res.data
    renderKatexForPreview()
  } catch (error) {
    console.error("Gagal mengambil preview", error)
  } finally {
    previewLoading.value = false
  }
}
// ---------------------------

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
    if (selectedKomponen.value) params.komponen = selectedKomponen.value
    if (selectedStatus.value) params.status = selectedStatus.value

    params.page = currentPage.value
    params.per_page = perPage.value

    const res = await api.get("/banksoal", { params })
    console.log("Respon API Bank Soal:", res.data)

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

    // Extract unique komponen from the bank soal data
    const uniqueKomponen = [...new Set(bankSoal.value.map((item) => item.komponen).filter(Boolean))]
    komponenList.value = uniqueKomponen

    await nextTick()
  } catch (error) {
    console.error("Gagal mengambil bank soal:", error)
    bankSoal.value = []
  } finally {
    loading.value = false
  }
}

const fetchKomponen = async () => {
  // Komponen sekarang diambil dari API /banksoal
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
  fetchBankSoal()
})
</script>
