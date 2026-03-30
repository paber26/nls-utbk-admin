<template>
  <div class="flex min-h-screen bg-bgsoft font-poppins">
    <Sidebar />

    <main class="flex-1 px-6 py-6 space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-lg font-semibold">Kelola Paket Soal Tryout</h1>
          <p class="text-sm text-slate-500">Batch: {{ tryout?.paket || "-" }}</p>
        </div>

        <RouterLink :to="`/tryout/detail/${route.params.id}`" class="text-sm text-slate-600 hover:underline">
          ← Kembali ke Detail
        </RouterLink>
      </div>

      <section class="bg-white rounded-xl border p-6">
        <div class="flex justify-between items-center">
          <h2 class="font-medium">Tambahkan Soal</h2>
          <button
            @click="showBankModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            + Tambahkan Soal
          </button>
        </div>
      </section>

      <section v-if="ringkasanKomponen.length > 0" class="bg-white rounded-xl border p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-medium">Ringkasan Komponen Soal</h2>
          <button v-if="selectedKomponen" @click="resetFilter" class="text-xs text-blue-600 hover:underline font-medium">
            Reset Filter
          </button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            v-for="(ringkasan, idx) in ringkasanKomponen"
            :key="idx"
            type="button"
            @click="toggleFilterKomponen(ringkasan.filterKey)"
            :class="[
              'p-4 border rounded-xl flex flex-col items-center justify-center transition relative',
              isRingkasanSelected(ringkasan.filterKey)
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-slate-50 hover:bg-slate-100'
            ]"
          >
            <span
              :class="[
                'text-3xl font-bold mb-1',
                isRingkasanSelected(ringkasan.filterKey) ? 'text-white' : 'text-blue-600'
              ]"
            >
              {{ ringkasan.jumlah }}
            </span>
            <span
              :class="[
                'text-xs text-center font-medium',
                isRingkasanSelected(ringkasan.filterKey) ? 'text-blue-100' : 'text-slate-500'
              ]"
            >
              {{ ringkasan.nama }}
            </span>
            <span
              :class="[
                'text-[10px] mt-1 font-medium px-2 py-0.5 rounded-full border shadow-sm',
                isRingkasanSelected(ringkasan.filterKey)
                  ? 'bg-blue-500 border-blue-400 text-white'
                  : 'bg-white text-slate-400 border-slate-100'
              ]"
            >
              {{ ringkasan.durasi }} Menit
            </span>

            <span
              v-if="isRingkasanSelected(ringkasan.filterKey)"
              class="absolute top-2 right-2 text-[10px] bg-white text-blue-600 px-2 py-0.5 rounded-full font-bold shadow-sm"
            >
              ✓
            </span>
          </button>
        </div>
      </section>

      <section class="bg-white rounded-xl border p-6">
        <h2 class="font-medium mb-4">Soal di Dalam Batch</h2>

        <div v-if="loadingSoal" class="text-sm text-slate-400">Memuat paket soal...</div>

        <table v-else class="w-full text-sm border">
          <thead class="bg-slate-100">
            <tr>
              <th class="px-3 py-2 text-left">Urutan</th>
              <th class="px-3 py-2 text-left">Isi Soal</th>
              <th class="px-3 py-2 text-center">Komponen</th>
              <th class="px-3 py-2 text-center">Poin</th>
              <th class="px-3 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredSoalTryout.length === 0">
              <td colspan="5" class="px-3 py-4 text-center text-slate-400">{{ emptyStateText }}</td>
            </tr>

            <tr v-for="soal in filteredSoalTryout" :key="soal.id" class="border-t">
              <td class="px-3 py-2 flex items-center gap-1">
                <button
                  class="text-xs px-2 border rounded"
                  :disabled="!bisaNaik(soal.id)"
                  @click="naikkanUrutan(soal.id)"
                >
                  ↑
                </button>

                <button
                  class="text-xs px-2 border rounded"
                  :disabled="!bisaTurun(soal.id)"
                  @click="turunkanUrutan(soal.id)"
                >
                  ↓
                </button>

                <span class="ml-2">{{ getNomorUrut(soal.id) }}</span>
              </td>
              <td class="px-3 py-2">
                <p class="text-gray-800 leading-relaxed">{{ (soal.pertanyaan || "").substring(0, 100) }}...</p>
                <div v-if="soal.tipe === 'pg' && soal.opsi_jawaban && soal.opsi_jawaban.length" class="mt-4 space-y-2">
                  <div v-for="(opsi, i) in soal.opsi_jawaban" :key="i" class="flex items-start gap-3">
                    <span class="w-6 text-right font-medium text-gray-700">{{ String.fromCharCode(65 + i) }}.</span>
                    <div
                      class="flex-1 text-gray-800 leading-relaxed"
                      :class="opsi.is_correct ? 'text-emerald-600 font-medium' : ''"
                      v-html="opsi.text"
                    ></div>
                    <span class="text-xs text-gray-400 whitespace-nowrap">
                      {{ opsi.poin?.toFixed(2) || "0.00" }} poin
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-3 py-2 text-center text-xs text-slate-600">{{ soal.komponen_nama || "-" }}</td>

              <td class="px-3 py-2 text-center">
                <input
                  type="number"
                  min="0"
                  class="w-20 px-2 py-1 border rounded text-sm text-center"
                  v-model.number="soal.poin"
                  @change="updatePoin(soal)"
                />
              </td>

              <td class="px-3 py-2 text-center space-x-2">
                <button
                  class="text-xs px-3 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                  @click="lihatSoal(soal.id)"
                >
                  Lihat
                </button>
                <button class="text-xs text-red-500 hover:underline" @click="hapusSoal(soal.id)">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- MODAL BANK SOAL -->
      <div
        v-if="showBankModal"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
        @click="showBankModal = false"
      >
        <div class="bg-white w-full max-w-5xl max-h-[80vh] overflow-y-auto rounded-xl shadow-xl p-6" @click.stop>
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-semibold">Pilih Soal dari Bank Soal</h2>
            <button @click="showBankModal = false" class="text-slate-500 hover:text-black">✕</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <input
              v-model="filter.q"
              @input="loadBankSoal"
              type="text"
              placeholder="Cari soal atau kata kunci..."
              class="px-3 py-2 border rounded-lg text-sm"
            />

            <select v-model="filter.komponen_id" @change="loadBankSoal" class="px-3 py-2 border rounded-lg text-sm">
              <option value="">Semua Komponen</option>
              <option v-for="k in daftarKomponen" :key="k.id" :value="k.id">
                {{ k.nama_komponen }}
              </option>
            </select>
          </div>

          <div v-if="loadingBank" class="text-sm text-slate-400">Memuat bank soal...</div>

          <table v-else class="w-full text-sm border">
            <thead class="bg-slate-100">
              <tr>
                <th class="px-3 py-2 text-left">Komponen</th>
                <th class="px-3 py-2 text-left">Isi Soal</th>
                <th class="px-3 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="soal in bankSoal" :key="soal.id" class="border-t">
                <td class="px-3 py-2">
                  {{ soal.komponen_nama || "-" }}
                </td>
                <td class="px-3 py-2">{{ (soal.pertanyaan || "").substring(0, 120) }}...</td>
                <td class="px-3 py-2 text-center space-x-2">
                  <button
                    class="text-xs px-3 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                    @click="lihatSoal(soal.id)"
                  >
                    Lihat
                  </button>

                  <button
                    class="text-xs px-3 py-1 rounded"
                    :class="
                      sudahDipakai(soal.id)
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    "
                    :disabled="sudahDipakai(soal.id)"
                    @click="tambahSoal(soal.id)"
                  >
                    {{ sudahDipakai(soal.id) ? "Sudah" : "Tambah" }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL DETAIL SOAL -->
      <div
        v-if="showDetailModal"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
        @click="showDetailModal = false"
      >
        <div
          class="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6 relative"
          @click.stop
        >
          <div class="flex justify-between items-center mb-6 sticky top-0 bg-white pb-2 z-10 border-b">
            <h2 class="font-semibold text-lg">Detail Soal</h2>
            <button @click="showDetailModal = false" class="text-slate-500 hover:text-black">✕</button>
          </div>

          <div v-if="loadingDetail" class="text-center text-slate-500 py-10">Memuat detail soal...</div>

          <div v-else-if="detailSoal" class="space-y-6">
            <div>
              <p class="text-sm text-gray-500">Komponen</p>
              <p class="font-medium">{{ detailSoal.komponen_nama || detailSoal.komponen || "-" }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500">Tipe Soal</p>
              <p class="font-medium">
                <span v-if="detailSoal.tipe === 'pg'">Pilihan Ganda</span>
                <span v-else-if="detailSoal.tipe === 'isian'">Isian</span>
                <span v-else-if="detailSoal.tipe === 'pg_kompleks'">PG Kompleks</span>
                <span v-else-if="detailSoal.tipe === 'pg_majemuk'">PG Majemuk</span>
                <span v-else>{{ detailSoal.tipe }}</span>
              </p>
            </div>

            <div>
              <p class="text-sm text-gray-500 mb-2">Pertanyaan</p>
              <div class="prose prose-sm max-w-none leading-relaxed text-gray-800" v-html="detailSoal.pertanyaan"></div>
            </div>

            <div v-if="detailSoal.tipe === 'isian'">
              <p class="text-sm text-gray-500">Jawaban</p>
              <p class="font-medium">{{ detailSoal.jawaban }}</p>
            </div>

            <div v-if="detailSoal.tipe === 'pg'">
              <p class="text-sm text-gray-500 mb-3">Opsi Jawaban</p>
              <div class="space-y-3">
                <div
                  v-for="(opsi, i) in detailSoal.opsi_jawaban"
                  :key="i"
                  class="flex items-start gap-3 p-4 border rounded-xl text-sm leading-relaxed transition"
                  :class="opsi.is_correct ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'"
                >
                  <div class="flex items-start gap-3 w-full">
                    <span class="font-semibold w-6 text-right">{{ String.fromCharCode(65 + i) }}.</span>

                    <div class="flex-1 prose prose-sm max-w-none" v-html="opsi.text"></div>
                  </div>

                  <span class="text-xs text-gray-400 whitespace-nowrap">Poin: {{ opsi.poin }}</span>
                </div>
              </div>
            </div>

            <div v-if="detailSoal.tipe === 'pg_majemuk'">
              <p class="text-sm text-gray-500 mb-3">Opsi Jawaban</p>
              <div class="space-y-3">
                <div
                  v-for="(opsi, i) in detailSoal.opsi_jawaban"
                  :key="i"
                  class="flex items-start gap-3 p-4 border rounded-xl text-sm leading-relaxed transition"
                  :class="opsi.is_correct ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'"
                >
                  <div class="flex items-start gap-3 w-full">
                    <span class="font-semibold w-6 text-right">{{ String.fromCharCode(65 + i) }}.</span>

                    <div class="flex-1 prose prose-sm max-w-none" v-html="opsi.text"></div>
                  </div>

                  <div class="flex flex-col items-end whitespace-nowrap">
                    <span class="text-xs text-gray-400">Poin: {{ opsi.poin }}</span>
                    <span v-if="opsi.is_correct" class="text-xs text-emerald-600 font-medium">Jawaban Benar</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="detailSoal.tipe === 'pg_kompleks'">
              <p class="text-sm text-gray-500 mb-2">Pernyataan</p>
              <div
                v-for="(item, index) in detailSoal.pernyataan"
                :key="index"
                class="flex justify-between items-start p-3 border rounded-lg mb-2 text-sm"
              >
                <div class="flex gap-2">
                  <span class="font-semibold">{{ index + 1 }}.</span>
                  <div v-html="item.text"></div>
                </div>
                <span
                  class="text-xs px-2 py-1 rounded-full whitespace-nowrap"
                  :class="item.jawaban ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'"
                >
                  {{ item.jawaban ? "Benar" : "Salah" }}
                </span>
              </div>
            </div>

            <div v-if="detailSoal.pembahasan">
              <p class="text-sm text-gray-500 mb-2">Pembahasan</p>
              <div class="prose prose-sm max-w-none leading-relaxed text-gray-700" v-html="detailSoal.pembahasan"></div>
            </div>

            <div class="pt-4 flex justify-end gap-3">
              <a
                :href="`/banksoal/edit/${detailSoal.id}`"
                target="_blank"
                class="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 text-sm hover:bg-blue-200 border border-transparent font-medium"
              >
                Edit di Tab Baru ↗
              </a>
              <button
                @click="showDetailModal = false"
                class="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm hover:bg-slate-200 font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch } from "vue"
import { useRoute, RouterLink } from "vue-router"
import katex from "katex"
import renderMathInElement from "katex/contrib/auto-render"
import "katex/dist/katex.min.css"
import api from "@/services/api"
import Sidebar from "@/components/layout/Sidebar.vue"

const route = useRoute()

const tryout = ref(null)
const soalTryout = ref([])
const bankSoal = ref([])
const selectedKomponen = ref("")

const normalizeKomponenNama = (nama) => {
  return (nama || "Tidak Spesifik")
    .toString()
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
}

const getKomponenId = (item) => {
  const rawId = item?.komponen_id ?? item?.id_komponen ?? item?.komponen?.id ?? item?.komponen?.komponen_id ?? null
  if (rawId === null || rawId === undefined || rawId === "") return null
  return String(rawId).trim()
}

const getKomponenNama = (item) => {
  const rawNama = item?.komponen_nama ?? item?.nama_komponen ?? item?.komponen?.nama_komponen ?? item?.komponen ?? ""
  const nama = String(rawNama || "").trim()
  return nama || "Tidak Spesifik"
}

const komponenIdByNama = computed(() => {
  const map = {}
  ;(tryout.value?.komponen || []).forEach((komponen) => {
    const namaKey = normalizeKomponenNama(getKomponenNama(komponen))
    const id = getKomponenId(komponen) || (komponen?.id !== undefined && komponen?.id !== null ? String(komponen.id) : null)
    if (namaKey && id) map[namaKey] = id
  })
  return map
})

const getKomponenFilterKey = (item) => {
  const nama = getKomponenNama(item)
  const namaKey = normalizeKomponenNama(nama)
  const id = getKomponenId(item) || komponenIdByNama.value[namaKey]
  return id ? `id:${id}` : `nama:${namaKey}`
}

const sudahDipakai = (bankSoalId) => {
  return soalTryout.value.some((s) => s.banksoal_id === bankSoalId || s.id === bankSoalId)
}

const ringkasanKomponen = computed(() => {
  const ringkasan = {}
  soalTryout.value.forEach((soal) => {
    const nama = getKomponenNama(soal)
    const filterKey = getKomponenFilterKey(soal)
    if (!ringkasan[filterKey]) ringkasan[filterKey] = { nama, filterKey, jumlah: 0, durasi: 0 }
    ringkasan[filterKey].jumlah++
  })

  if (tryout.value && tryout.value.komponen) {
    tryout.value.komponen.forEach((k) => {
      const nama = getKomponenNama(k)
      const filterKey = getKomponenFilterKey(k)
      if (ringkasan[filterKey]) {
        ringkasan[filterKey].durasi = Number(k.durasi_menit) || 0
      } else {
        ringkasan[filterKey] = {
          nama,
          filterKey,
          jumlah: 0,
          durasi: Number(k.durasi_menit) || 0
        }
      }
    })
  }

  return Object.values(ringkasan)
})

const loadingSoal = ref(true)
const loadingBank = ref(true)
const showBankModal = ref(false)

const showDetailModal = ref(false)
const loadingDetail = ref(false)
const detailSoal = ref(null)

const filter = ref({
  q: "",
  komponen_id: ""
})

const daftarKomponen = ref([])

const loadTryout = async () => {
  const res = await api.get(`/tryout/${route.params.id}`)
  tryout.value = res.data
}

const loadKomponen = async () => {
  const res = await api.get("/komponen")
  daftarKomponen.value = res.data
}

const loadSoalTryout = async () => {
  loadingSoal.value = true
  try {
    const res = await api.get(`/tryout/${route.params.id}/soal`)
    soalTryout.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    soalTryout.value = []
    console.error(e)
  } finally {
    loadingSoal.value = false
  }
}

const loadBankSoal = async () => {
  loadingBank.value = true
  try {
    const res = await api.get("/banksoaltryout", {
      params: {
        q: filter.value.q,
        komponen_id: filter.value.komponen_id
      }
    })
    bankSoal.value = Array.isArray(res.data) ? res.data : []
    renderKatex()
  } catch (e) {
    bankSoal.value = []
    console.error(e)
  } finally {
    loadingBank.value = false
  }
}

const renderKatex = () => {
  nextTick(() => {
    const containers = document.querySelectorAll(".prose")
    containers.forEach(container => {
      try {
        renderMathInElement(container, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
          ],
          throwOnError: false
        })
      } catch(e) {
        console.error("KaTeX render error:", e)
      }
    })
  })
}

const lihatSoal = async (soalId) => {
  showDetailModal.value = true
  loadingDetail.value = true
  detailSoal.value = null

  try {
    const res = await api.get(`/banksoal/${soalId}`)
    detailSoal.value = res.data
  } catch (e) {
    console.error("Gagal memuat detail soal", e)
  } finally {
    loadingDetail.value = false
    renderKatex()
  }
}

const tambahSoal = async (soalId) => {
  await api.post(`/tryout/${route.params.id}/soal`, {
    banksoal_id: soalId
  })
  loadSoalTryout()
}

const hapusSoal = async (soalId) => {
  await api.delete(`/tryout/${route.params.id}/soal/${soalId}`)
  loadSoalTryout()
}

const getSoalIndexById = (soalId) => {
  return soalTryout.value.findIndex((soal) => soal.id === soalId)
}

const getNomorUrut = (soalId) => {
  const index = getSoalIndexById(soalId)
  return index > -1 ? index + 1 : "-"
}

const bisaNaik = (soalId) => {
  return getSoalIndexById(soalId) > 0
}

const bisaTurun = (soalId) => {
  const index = getSoalIndexById(soalId)
  return index > -1 && index < soalTryout.value.length - 1
}

const naikkanUrutan = (soalId) => {
  const index = getSoalIndexById(soalId)
  if (index <= 0) return
  const temp = soalTryout.value[index]
  soalTryout.value[index] = soalTryout.value[index - 1]
  soalTryout.value[index - 1] = temp
}

const turunkanUrutan = (soalId) => {
  const index = getSoalIndexById(soalId)
  if (index < 0 || index === soalTryout.value.length - 1) return
  const temp = soalTryout.value[index]
  soalTryout.value[index] = soalTryout.value[index + 1]
  soalTryout.value[index + 1] = temp
}

const updatePoin = async (soal) => {
  try {
    const tes = await api.put(`/tryout/${route.params.id}/soal/${soal.id}/poin`, {
      poin: soal.poin
    })
  } catch (e) {
    console.error("Gagal update poin", e)
  }
}

const isRingkasanSelected = (filterKey) => {
  return filterKey === selectedKomponen.value
}

const filteredSoalTryout = computed(() => {
  if (!selectedKomponen.value) return soalTryout.value
  return soalTryout.value.filter((s) => getKomponenFilterKey(s) === selectedKomponen.value)
})

const emptyStateText = computed(() => {
  if (!selectedKomponen.value) return "Belum ada soal pada batch ini"
  return "Tidak ada soal untuk komponen yang dipilih"
})

const toggleFilterKomponen = (filterKey) => {
  if (selectedKomponen.value === filterKey) {
    selectedKomponen.value = ""
  } else {
    selectedKomponen.value = filterKey
  }
}

const resetFilter = () => {
  selectedKomponen.value = ""
}

watch(ringkasanKomponen, (items) => {
  if (selectedKomponen.value && !items.some((item) => item.filterKey === selectedKomponen.value)) {
    selectedKomponen.value = ""
  }
})

onMounted(() => {
  loadTryout()
  loadSoalTryout()
  loadBankSoal()
  loadKomponen()
})
</script>
