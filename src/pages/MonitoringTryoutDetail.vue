<template>
  <div class="flex min-h-screen bg-bgsoft font-poppins">
    <Sidebar />

    <main class="flex-1 px-6 py-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-lg font-semibold">Peserta per Batch Tryout</h1>
          <p class="text-sm text-slate-500">Menampilkan peserta yang sedang atau sudah menyelesaikan batch ini</p>
        </div>

        <div class="flex gap-2">
          <button
            @click="exportToExcel"
            class="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 shadow"
          >
            Export Excel
          </button>

          <button
            @click="forceFinishAll"
            class="bg-orange-700 text-white px-4 py-2 rounded-xl text-sm hover:bg-orange-800 shadow"
          >
            Akhiri Semua
          </button>
        </div>
      </div>

      <div class="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div class="flex flex-wrap gap-3 items-center">
          <div class="relative">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-4.35-4.35m2.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              v-model="searchName"
              type="text"
              placeholder="Cari nama peserta..."
              class="pl-9 pr-4 py-2 w-56 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
            />
          </div>

          <div class="relative">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 7h18M3 12h18M3 17h18" />
            </svg>
            <input
              v-model="searchSchool"
              type="text"
              placeholder="Cari sekolah..."
              class="pl-9 pr-4 py-2 w-56 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
            />
          </div>
        </div>
        <div class="flex items-center gap-2 text-sm ml-auto">
          <span>Tampilkan:</span>
          <select v-model="perPage" class="border rounded px-3 py-2 text-sm bg-white">
            <option :value="50">50</option>
            <option :value="100">100</option>
            <option :value="200">200</option>
          </select>
          <span>data</span>
        </div>

        <div class="flex flex-wrap gap-3 mt-3">
          <button
            @click="showOngoing = !showOngoing"
            class="px-4 py-2 rounded-lg text-sm font-medium transition"
            :class="showOngoing ? 'bg-amber-500 text-white shadow' : 'bg-slate-200 text-slate-700'"
          >
            {{ showOngoing ? "Sembunyikan" : "Tampilkan" }} Peserta Sedang Mengerjakan
          </button>

          <button
            @click="showFinished = !showFinished"
            class="px-4 py-2 rounded-lg text-sm font-medium transition"
            :class="showFinished ? 'bg-emerald-600 text-white shadow' : 'bg-slate-200 text-slate-700'"
          >
            {{ showFinished ? "Sembunyikan" : "Tampilkan" }} Peserta Sudah Selesai
          </button>
        </div>
      </div>

      <section v-if="showOngoing" class="bg-white rounded-xl border overflow-x-auto mb-8">
        <div class="px-4 py-3 border-b bg-amber-50">
          <h2 class="text-sm font-semibold text-amber-700">Peserta Sedang Mengerjakan</h2>
        </div>
        <table class="w-full text-sm">
          <thead class="bg-slate-100">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th @click="setSort('name')" class="px-4 py-3 text-left cursor-pointer select-none">
                <span class="flex items-center gap-1">
                  Nama
                  <span class="text-xs">
                    <span :class="sortKey === 'name' && sortDir === 'asc' ? 'text-black' : 'text-slate-300'">▲</span>
                    <span :class="sortKey === 'name' && sortDir === 'desc' ? 'text-black' : 'text-slate-300'">▼</span>
                  </span>
                </span>
              </th>
              <th @click="setSort('sekolah_nama')" class="px-4 py-3 text-left cursor-pointer select-none">
                <span class="flex items-center gap-1">
                  Sekolah
                  <span class="text-xs">
                    <span :class="sortKey === 'sekolah_nama' && sortDir === 'asc' ? 'text-black' : 'text-slate-300'">
                      ▲
                    </span>
                    <span :class="sortKey === 'sekolah_nama' && sortDir === 'desc' ? 'text-black' : 'text-slate-300'">
                      ▼
                    </span>
                  </span>
                </span>
              </th>
              <th class="px-4 py-3 text-center">Durasi</th>
              <th @click="setSort('jawaban_count')" class="px-4 py-3 text-center cursor-pointer select-none">
                <span class="flex items-center justify-center gap-1">
                  Jawaban
                  <span class="text-xs">
                    <span :class="sortKey === 'jawaban_count' && sortDir === 'asc' ? 'text-black' : 'text-slate-300'">
                      ▲
                    </span>
                    <span :class="sortKey === 'jawaban_count' && sortDir === 'desc' ? 'text-black' : 'text-slate-300'">
                      ▼
                    </span>
                  </span>
                </span>
              </th>
              <th class="px-4 py-3 text-center">Detail</th>
              <th class="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="px-4 py-6 text-center text-slate-400">Memuat data peserta...</td>
            </tr>
            <tr v-for="(item, index) in paginatedOngoing" :key="item.id" class="border-t">
              <td class="px-4 py-3">{{ index + 1 }}</td>
              <td class="px-4 py-3 font-medium">{{ item.name }}</td>
              <td class="px-4 py-3">{{ item.sekolah_nama ?? "-" }}</td>
              <td class="px-4 py-3 text-center text-xs">{{ calculateDuration(item.mulai, item.selesai) }}</td>
              <td class="px-4 py-3 text-center text-xs font-semibold">
                {{ item.jawaban_count ?? 0 }}
              </td>
              <td class="px-4 py-3 text-center">
                <button @click="openDetail(item)" class="text-xs bg-slate-200 px-3 py-1 rounded hover:bg-slate-300">
                  Lihat
                </button>
              </td>
              <td class="px-4 py-3 text-center">
                <button
                  @click="forceFinish(item)"
                  class="text-xs bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700"
                >
                  Akhiri
                </button>
              </td>
            </tr>
            <tr v-if="!loading && ongoingParticipants.length === 0">
              <td colspan="7" class="px-4 py-6 text-center text-slate-400">
                Tidak ada peserta yang sedang mengerjakan.
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-between items-center px-4 py-3 border-t text-sm">
          <div>Halaman {{ ongoingPage }} dari {{ totalOngoingPages }}</div>
          <div class="flex gap-2">
            <button
              @click="changeOngoingPage(ongoingPage - 1)"
              :disabled="ongoingPage === 1"
              class="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              @click="changeOngoingPage(ongoingPage + 1)"
              :disabled="ongoingPage === totalOngoingPages"
              class="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <section v-if="showFinished" class="bg-white rounded-xl border overflow-x-auto">
        <div class="px-4 py-3 border-b bg-emerald-50">
          <h2 class="text-sm font-semibold text-emerald-700">Peserta Sudah Selesai</h2>
        </div>
        <table class="w-full text-sm">
          <thead class="bg-slate-100">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th @click="setSort('name')" class="px-4 py-3 text-left cursor-pointer select-none">
                <span class="flex items-center gap-1">
                  Nama
                  <span class="text-xs">
                    <span :class="sortKey === 'name' && sortDir === 'asc' ? 'text-black' : 'text-slate-300'">▲</span>
                    <span :class="sortKey === 'name' && sortDir === 'desc' ? 'text-black' : 'text-slate-300'">▼</span>
                  </span>
                </span>
              </th>
              <th @click="setSort('sekolah_nama')" class="px-4 py-3 text-left cursor-pointer select-none">
                <span class="flex items-center gap-1">
                  Sekolah
                  <span class="text-xs">
                    <span :class="sortKey === 'sekolah_nama' && sortDir === 'asc' ? 'text-black' : 'text-slate-300'">
                      ▲
                    </span>
                    <span :class="sortKey === 'sekolah_nama' && sortDir === 'desc' ? 'text-black' : 'text-slate-300'">
                      ▼
                    </span>
                  </span>
                </span>
              </th>
              <th @click="setSort('nilai')" class="px-4 py-3 text-center cursor-pointer select-none">
                <span class="flex items-center justify-center gap-1">
                  Nilai
                  <span class="text-xs">
                    <span :class="sortKey === 'nilai' && sortDir === 'asc' ? 'text-black' : 'text-slate-300'">▲</span>
                    <span :class="sortKey === 'nilai' && sortDir === 'desc' ? 'text-black' : 'text-slate-300'">▼</span>
                  </span>
                </span>
              </th>
              <th class="px-4 py-3 text-center">Selesai</th>
              <th class="px-4 py-3 text-center">Durasi</th>
              <th @click="setSort('jawaban_count')" class="px-4 py-3 text-center cursor-pointer select-none">
                <span class="flex items-center justify-center gap-1">
                  Jawaban
                  <span class="text-xs">
                    <span :class="sortKey === 'jawaban_count' && sortDir === 'asc' ? 'text-black' : 'text-slate-300'">
                      ▲
                    </span>
                    <span :class="sortKey === 'jawaban_count' && sortDir === 'desc' ? 'text-black' : 'text-slate-300'">
                      ▼
                    </span>
                  </span>
                </span>
              </th>
              <th class="px-4 py-3 text-center">Detail</th>
              <th class="px-4 py-3 text-center">Hasil</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="9" class="px-4 py-6 text-center text-slate-400">Memuat data peserta...</td>
            </tr>
            <tr v-for="(item, index) in paginatedFinished" :key="item.id" class="border-t">
              <td class="px-4 py-3">{{ index + 1 }}</td>
              <td class="px-4 py-3 font-medium">{{ item.name }}</td>
              <td class="px-4 py-3">{{ item.sekolah_nama ?? "-" }}</td>
              <td class="px-4 py-3 text-center font-semibold">{{ item.nilai ?? "-" }}</td>
              <td class="px-4 py-3 text-center text-xs">{{ formatDate(item.selesai) }}</td>
              <td class="px-4 py-3 text-center text-xs">{{ calculateDuration(item.mulai, item.selesai) }}</td>
              <td class="px-4 py-3 text-center text-xs font-semibold">
                {{ item.jawaban_count ?? 0 }}
              </td>
              <td class="px-4 py-3 text-center">
                <button @click="openDetail(item)" class="text-xs bg-slate-200 px-3 py-1 rounded hover:bg-slate-300">
                  Lihat
                </button>
              </td>
              <td class="px-4 py-3 text-center">
                <RouterLink
                  :to="{
                    name: 'MonitoringTryoutHasil',
                    params: { tryoutId: route.params.id, participantId: item.id }
                  }"
                  class="text-xs bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700"
                >
                  Lihat Hasil
                </RouterLink>
              </td>
            </tr>
            <tr v-if="!loading && finishedParticipants.length === 0">
              <td colspan="9" class="px-4 py-6 text-center text-slate-400">
                Belum ada peserta yang menyelesaikan tryout.
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-between items-center px-4 py-3 border-t text-sm">
          <div>Halaman {{ finishedPage }} dari {{ totalFinishedPages }}</div>
          <div class="flex gap-2">
            <button
              @click="changeFinishedPage(finishedPage - 1)"
              :disabled="finishedPage === 1"
              class="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              @click="changeFinishedPage(finishedPage + 1)"
              :disabled="finishedPage === totalFinishedPages"
              class="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white w-[420px] rounded-xl p-6 relative">
          <button @click="showModal = false" class="absolute top-3 right-3 text-slate-500">✕</button>
          <h3 class="text-lg font-semibold mb-4">Detail Peserta</h3>

          <div class="space-y-2 text-sm">
            <div>
              <strong>Nama:</strong>
              {{ selectedParticipant?.name }}
            </div>
            <div>
              <strong>Email:</strong>
              {{ selectedParticipant?.email }}
            </div>
            <div>
              <strong>Sekolah:</strong>
              {{ selectedParticipant?.sekolah_nama }}
            </div>
            <div>
              <strong>WhatsApp:</strong>
              {{ selectedParticipant?.whatsapp ?? "-" }}
            </div>
            <div>
              <strong>Status:</strong>
              {{ selectedParticipant?.status }}
            </div>
            <div>
              <strong>Jumlah Jawaban Tersimpan:</strong>
              {{ selectedParticipant?.jawaban_count ?? 0 }}
            </div>
            <div v-if="selectedParticipant?.answered_numbers?.length">
              <strong>Nomor Soal Dijawab:</strong>
              <div class="flex flex-wrap gap-1 mt-1">
                <span
                  v-for="num in selectedParticipant.answered_numbers"
                  :key="num"
                  class="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded"
                >
                  {{ num }}
                </span>
              </div>
            </div>
            <div>
              <strong>Nilai:</strong>
              {{ selectedParticipant?.nilai ?? "-" }}
            </div>
            <div>
              <strong>Mulai:</strong>
              {{ formatDate(selectedParticipant?.mulai) }}
            </div>
            <div>
              <strong>Selesai:</strong>
              {{ formatDate(selectedParticipant?.selesai) }}
            </div>
            <div>
              <strong>Durasi:</strong>
              {{ calculateDuration(selectedParticipant?.mulai, selectedParticipant?.selesai) }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="showConfirmModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white w-[360px] rounded-xl p-6 text-center">
          <h3 class="text-lg font-semibold mb-4 text-orange-700">Konfirmasi</h3>
          <p class="text-sm text-slate-600 mb-6">
            Yakin ingin mengakhiri tryout peserta
            <strong>{{ confirmTarget?.name }}</strong>
            ?
          </p>
          <div class="flex justify-center gap-3">
            <button
              @click="showConfirmModal = false"
              class="px-4 py-2 text-sm rounded-lg bg-slate-200 hover:bg-slate-300"
            >
              Batal
            </button>
            <button
              @click="confirmForceFinish"
              class="px-4 py-2 text-sm rounded-lg bg-orange-700 text-white hover:bg-orange-800"
            >
              Ya, Akhiri
            </button>
          </div>
        </div>
      </div>

      <div v-if="showSuccessModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white w-[360px] rounded-xl p-6 text-center">
          <h3 class="text-lg font-semibold mb-4 text-emerald-600">Berhasil</h3>
          <p class="text-sm text-slate-600 mb-6">{{ successMessage }}</p>
          <button
            @click="showSuccessModal = false"
            class="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import api from "@/services/api"
import Sidebar from "@/components/layout/Sidebar.vue"
import * as XLSX from "xlsx"

const participants = ref([])

const ongoingPage = ref(1)
const finishedPage = ref(1)
const perPage = ref(50)
const searchName = ref("")
const searchSchool = ref("")
const sortKey = ref("")
const sortDir = ref("asc")

const setSort = (key) => {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc"
  } else {
    sortKey.value = key
    sortDir.value = "asc"
  }
}

const showOngoing = ref(true)
const showFinished = ref(true)

const showModal = ref(false)
const selectedParticipant = ref(null)

const showConfirmModal = ref(false)
const confirmTarget = ref(null)
const showSuccessModal = ref(false)
const successMessage = ref("")

const openDetail = (item) => {
  selectedParticipant.value = item
  showModal.value = true
}

const forceFinish = (item) => {
  confirmTarget.value = item
  showConfirmModal.value = true
}

const confirmForceFinish = async () => {
  if (!confirmTarget.value) return

  try {
    await api.post(`/monitoring-tryout/${confirmTarget.value.id}/force-finish`)

    confirmTarget.value.status = "submitted"
    confirmTarget.value.selesai = new Date().toISOString()

    showConfirmModal.value = false
    successMessage.value = "Pengerjaan peserta berhasil diakhiri."
    showSuccessModal.value = true
  } catch (error) {
    console.error("Gagal mengakhiri tryout:", error)
    showConfirmModal.value = false
  }
}

const forceFinishAll = async () => {
  const ongoing = participants.value.filter((p) => p.status === "ongoing")

  if (!ongoing.length) {
    successMessage.value = "Tidak ada peserta yang sedang mengerjakan."
    showSuccessModal.value = true
    return
  }

  const confirmAction = confirm(`Yakin ingin mengakhiri ${ongoing.length} peserta yang sedang mengerjakan?`)

  if (!confirmAction) return

  try {
    for (const p of ongoing) {
      await api.post(`/monitoring-tryout/${p.id}/force-finish`)
      p.status = "submitted"
      p.selesai = new Date().toISOString()
    }

    successMessage.value = "Semua peserta yang sedang mengerjakan berhasil diakhiri."
    showSuccessModal.value = true
  } catch (error) {
    console.error(error)
    successMessage.value = "Terjadi kesalahan saat mengakhiri peserta."
    showSuccessModal.value = true
  }
}

const calculateDuration = (start, end) => {
  if (!start) return "-"
  const startTime = new Date(start)
  const endTime = end ? new Date(end) : new Date()
  const diffMs = endTime - startTime
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (hours > 0) {
    return `${hours}j ${remainingMinutes}m`
  }
  return `${remainingMinutes}m`
}

const filteredParticipants = computed(() => {
  return participants.value.filter((p) => {
    const matchName = searchName.value ? p.name?.toLowerCase().includes(searchName.value.toLowerCase()) : true

    const matchSchool = searchSchool.value
      ? p.sekolah_nama?.toLowerCase().includes(searchSchool.value.toLowerCase())
      : true

    return matchName && matchSchool
  })
})

const sortedParticipants = computed(() => {
  if (!sortKey.value) return filteredParticipants.value

  return [...filteredParticipants.value].sort((a, b) => {
    const numericKeys = new Set(["nilai", "jawaban_count"])
    const A = a[sortKey.value]
    const B = b[sortKey.value]

    if (numericKeys.has(sortKey.value)) {
      const numA = Number(A ?? 0)
      const numB = Number(B ?? 0)
      return sortDir.value === "asc" ? numA - numB : numB - numA
    }

    const textA = String(A ?? "").toLowerCase()
    const textB = String(B ?? "").toLowerCase()

    if (textA < textB) return sortDir.value === "asc" ? -1 : 1
    if (textA > textB) return sortDir.value === "asc" ? 1 : -1
    return 0
  })
})

const ongoingParticipants = computed(() => sortedParticipants.value.filter((p) => p.status === "ongoing"))

const finishedParticipants = computed(() => sortedParticipants.value.filter((p) => p.status === "submitted"))

const paginatedOngoing = computed(() => {
  const start = (ongoingPage.value - 1) * perPage.value
  const end = start + perPage.value
  return ongoingParticipants.value.slice(start, end)
})

const paginatedFinished = computed(() => {
  const start = (finishedPage.value - 1) * perPage.value
  const end = start + perPage.value
  return finishedParticipants.value.slice(start, end)
})

const totalOngoingPages = computed(() => Math.ceil(ongoingParticipants.value.length / perPage.value) || 1)

const totalFinishedPages = computed(() => Math.ceil(finishedParticipants.value.length / perPage.value) || 1)

const changeOngoingPage = (page) => {
  if (page >= 1 && page <= totalOngoingPages.value) {
    ongoingPage.value = page
  }
}

const changeFinishedPage = (page) => {
  if (page >= 1 && page <= totalFinishedPages.value) {
    finishedPage.value = page
  }
}

const loading = ref(true)

import { RouterLink, useRoute } from "vue-router"
const route = useRoute()

const formatDate = (datetime) => {
  if (!datetime) return "-"
  const date = new Date(datetime)
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

onMounted(async () => {
  const tryoutId = route.params.id
  const res = await api.get(`/monitoring-tryout/${tryoutId}`)
  participants.value = res.data
  loading.value = false
})

const exportToExcel = () => {
  const formattedData = participants.value.map((p, index) => ({
    No: index + 1,
    Nama: p.name,
    Email: p.email ?? "-",
    Sekolah: p.sekolah_nama ?? "-",
    WhatsApp: p.whatsapp ?? "-",
    Status: p.status,
    Nilai: p.nilai ?? "-",
    Mulai: formatDate(p.mulai),
    Selesai: formatDate(p.selesai),
    Durasi: calculateDuration(p.mulai, p.selesai),
    "Jumlah Jawaban": p.jawaban_count ?? 0
  }))

  const worksheet = XLSX.utils.json_to_sheet(formattedData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Monitoring SNBT")

  XLSX.writeFile(workbook, "monitoring_tryout_snbt.xlsx")
}
</script>
