<template>
  <div class="bg-bgsoft font-poppins min-h-screen flex overflow-hidden">
    <Sidebar />

    <main class="flex-1 min-w-0 overflow-x-hidden">
      <!-- TOPBAR -->
      <header
        class="bg-white border-b px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 class="text-lg font-semibold">Detail Batch Tryout</h1>
          <p class="text-sm text-slate-500">Preview paket soal sebelum batch dibuka ke peserta</p>
        </div>

        <div class="flex gap-2 sm:gap-3 w-full md:w-auto">
          <RouterLink
            :to="`/tryout/kelola/${route.params.id}`"
            class="flex-1 md:flex-none text-center px-4 py-2 rounded-lg border text-sm hover:bg-slate-100"
          >
            Kelola Soal
          </RouterLink>

          <RouterLink
            :to="`/tryout/edit/${route.params.id}`"
            class="flex-1 md:flex-none text-center px-4 py-2 rounded-lg bg-orange-600 text-white text-sm hover:bg-orange-700"
          >
            Edit Batch
          </RouterLink>
        </div>
      </header>

      <div v-if="loading" class="px-6 py-6 text-slate-500">Memuat detail batch tryout...</div>

      <div v-else class="px-4 sm:px-6 py-6 max-w-full overflow-x-hidden">
        <section class="bg-white rounded-2xl border shadow-sm p-6 mb-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-base font-semibold text-slate-800">
                {{ tryout?.paket }}
              </h2>
            </div>

            <span
              class="px-3 py-1 text-xs rounded-full font-medium"
              :class="{
                'bg-slate-200 text-slate-700': tryout?.status === 'draft',
                'bg-emerald-100 text-emerald-700': tryout?.status === 'active',
                'bg-orange-100 text-orange-700': tryout?.status === 'finished'
              }"
            >
              {{ tryout?.status === "draft" ? "Draft" : tryout?.status === "active" ? "Aktif" : "Ditutup" }}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div class="bg-slate-50 rounded-xl p-4">
              <p class="text-slate-500 text-xs mb-1">Jumlah Soal</p>
              <p class="text-lg font-semibold text-slate-800">
                {{ soalList.length }}
              </p>
            </div>

            <div class="bg-slate-50 rounded-xl p-4">
              <p class="text-slate-500 text-xs mb-1">Total Poin</p>
              <p class="text-lg font-semibold text-slate-800">
                {{ totalPoin }}
              </p>
            </div>

            <div class="bg-slate-50 rounded-xl p-4">
              <p class="text-slate-500 text-xs mb-1">Durasi</p>
              <p class="text-lg font-semibold text-slate-800">{{ tryout?.durasi_menit }} menit</p>
            </div>

            <div class="bg-slate-50 rounded-xl p-4 md:col-span-2">
              <p class="text-slate-500 text-xs mb-1">Waktu Pelaksanaan</p>
              <p class="text-sm font-medium text-slate-700">
                {{ formatDateTime(tryout?.mulai) }} - {{ formatDateTime(tryout?.selesai) }}
              </p>
            </div>
          </div>
        </section>

        <!-- RINGKASAN KOMPONEN SOAL -->
        <section v-if="ringkasanKomponen.length > 0" class="bg-white rounded-xl border p-4 sm:p-6 mb-6">
          <div class="flex flex-row justify-between items-center mb-4">
            <h2 class="font-medium text-sm sm:text-base">Ringkasan Komponen Soal</h2>
            <button
              v-if="selectedKomponen"
              @click="resetFilter"
              class="text-xs text-blue-600 hover:underline font-medium"
            >
              Reset Filter
            </button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            <button
              v-for="(ringkasan, idx) in ringkasanKomponen"
              :key="idx"
              type="button"
              @click="toggleFilterKomponen(ringkasan.nama)"
              :class="[
                'p-3 sm:p-4 border rounded-xl flex flex-col items-center justify-center transition relative',
                isRingkasanSelected(ringkasan.nama)
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-slate-50 hover:bg-slate-100'
              ]"
            >
              <span
                :class="[
                  'text-2xl sm:text-3xl font-bold mb-1',
                  isRingkasanSelected(ringkasan.nama) ? 'text-white' : 'text-blue-600'
                ]"
              >
                {{ ringkasan.jumlah }}
              </span>
              <span
                :class="[
                  'text-[10px] sm:text-xs text-center font-medium line-clamp-2 leading-tight',
                  isRingkasanSelected(ringkasan.nama) ? 'text-blue-100' : 'text-slate-500'
                ]"
              >
                {{ ringkasan.nama }}
              </span>
              <span
                :class="[
                  'text-[9px] sm:text-[10px] mt-1.5 font-medium px-2 py-0.5 rounded-full border shadow-sm',
                  isRingkasanSelected(ringkasan.nama)
                    ? 'bg-blue-500 border-blue-400 text-white'
                    : 'bg-white text-slate-400 border-slate-100'
                ]"
              >
                {{ ringkasan.durasi }} Menit
              </span>

              <span
                v-if="isRingkasanSelected(ringkasan.nama)"
                class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 text-[9px] sm:text-[10px] bg-white text-blue-600 px-1.5 sm:px-2 py-0.5 rounded-full font-bold shadow-sm"
              >
                ✓
              </span>
            </button>
          </div>
        </section>

        <section v-if="tryout?.ketentuan_khusus" class="bg-white rounded-xl border p-6 mb-6">
          <h2 class="text-sm font-semibold mb-3 text-slate-700">Ketentuan Khusus</h2>
          <div class="text-sm leading-relaxed" v-html="tryout.ketentuan_khusus"></div>
        </section>

        <section v-if="tryout?.pesan_selesai" class="bg-white rounded-xl border p-6 mb-6">
          <h2 class="text-sm font-semibold mb-3 text-slate-700">Pesan Setelah Selesai</h2>
          <div class="text-sm leading-relaxed" v-html="tryout.pesan_selesai"></div>
        </section>

        <section class="space-y-4 sm:space-y-6">
          <div v-if="filteredSoalList.length === 0" class="text-center text-slate-400 py-10 bg-white border rounded-xl">
            {{ emptyStateText }}
          </div>

          <div
            v-for="item in filteredSoalList"
            :key="item.id"
            :data-soal="item.id"
            :class="[
              'rounded-xl border p-6 overflow-hidden break-words',
              item.tipe === 'pg' && 'bg-amber-50 border-amber-200',
              item.tipe === 'pg_majemuk' && 'bg-orange-50 border-orange-200',
              item.tipe === 'pg_kompleks' && 'bg-orange-50 border-orange-200',
              item.tipe === 'isian' && 'bg-emerald-50 border-emerald-200'
            ]"
          >
            <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
              <h3 class="font-semibold text-sm sm:text-base flex flex-wrap items-center gap-2">
                Soal {{ getNomorUrut(item.id) }}
                <span
                  class="text-[10px] sm:text-xs px-2 py-1 rounded-full font-medium"
                  :class="{
                    'bg-amber-100 text-amber-700': item.tipe === 'pg',
                    'bg-orange-100 text-orange-700': item.tipe === 'pg_kompleks',
                    'bg-orange-100 text-orange-700': item.tipe === 'pg_majemuk',
                    'bg-emerald-100 text-emerald-700': item.tipe === 'isian'
                  }"
                >
                  {{
                    item.tipe === "pg"
                      ? "Pilihan Ganda"
                      : item.tipe === "pg_kompleks"
                        ? "PG Kompleks"
                        : item.tipe === "pg_majemuk"
                          ? "PG Majemuk"
                          : "Isian Singkat"
                  }}
                </span>

                <span class="text-[10px] sm:text-xs px-2 py-1 text-slate-600 border rounded-full bg-white">
                  {{ item.komponen_nama || "-" }}
                </span>
              </h3>

              <RouterLink
                :to="`/banksoal/edit/${item.id}`"
                target="_blank"
                class="self-start sm:self-auto text-[10px] sm:text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition font-medium"
              >
                Edit Soal ↗
              </RouterLink>
            </div>

            <div
              class="mb-4 leading-relaxed text-sm sm:text-base prose prose-sm max-w-none text-slate-800"
              v-html="item.pertanyaan"
            ></div>

            <div
              v-if="item.tipe === 'pg_kompleks' && item.pernyataan && item.pernyataan.length"
              class="space-y-2 text-sm mb-4"
            >
              <div v-for="p in item.pernyataan" :key="p.urutan" class="flex items-start gap-2">
                <span class="font-medium">{{ p.urutan }}.</span>
                <span v-html="p.teks"></span>
                <span
                  class="ml-auto text-xs px-2 py-0.5 rounded"
                  :class="p.jawaban_benar ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'"
                >
                  {{ p.jawaban_benar ? "Benar" : "Salah" }}
                </span>
              </div>
            </div>

            <ul v-if="item.tipe === 'pg' || item.tipe === 'pg_majemuk'" class="space-y-3 text-sm">
              <li
                v-for="opsi in item.opsi"
                :key="opsi.id"
                class="flex gap-3 items-start p-3 rounded-lg border bg-white overflow-hidden"
                :class="opsi.is_correct ? 'border-emerald-300 bg-emerald-50' : ''"
              >
                <div class="flex gap-2 flex-1 min-w-0">
                  <span class="font-semibold mt-0.5" :class="opsi.is_correct ? 'text-emerald-700' : 'text-slate-700'">
                    {{ opsi.label }}.
                  </span>
                  <span
                    class="prose prose-sm max-w-none text-slate-800 break-words"
                    :class="opsi.is_correct ? 'text-emerald-800 font-medium' : ''"
                    v-html="opsi.teks"
                  ></span>
                </div>

                <div class="flex items-center gap-2 self-end sm:self-auto">
                  <span v-if="opsi.is_correct" class="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                    Benar
                  </span>
                  <span
                    class="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500 whitespace-nowrap"
                  >
                    {{ opsi.poin }} poin
                  </span>
                </div>
              </li>
            </ul>

            <div class="mb-2 text-sm">
              <span class="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded font-medium">
                Poin: {{ item.poin }}
              </span>
            </div>

            <div v-if="item.pembahasan" class="mt-4 p-4 bg-slate-50 rounded-lg text-sm">
              <p class="font-medium mb-1">Pembahasan:</p>
              <div v-html="item.pembahasan"></div>
            </div>
          </div>
        </section>
      </div>

      <!-- FLOATING ACTION BUTTONS -->
      <div class="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
        <!-- Button Daftar Soal -->
        <div class="relative">
          <button
            @click="showList = !showList"
            class="bg-orange-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-orange-700 text-sm"
          >
            Daftar Soal
          </button>

          <div v-if="showList" class="fixed inset-0 z-40" @click="showList = false">
            <div
              class="absolute right-6 bottom-20 w-72 max-h-80 overflow-y-auto bg-white border rounded-xl shadow-xl p-3"
              @click.stop
            >
              <div class="grid grid-cols-4 sm:grid-cols-6 gap-2">
                <button
                  v-for="item in filteredSoalList"
                  :key="item.id"
                  @click="scrollToSoal(item.id)"
                  class="text-xs py-2 rounded-lg border bg-slate-50 hover:bg-blue-600 hover:text-white transition font-medium"
                >
                  {{ getNomorUrut(item.id) }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Button Scroll to Top -->
        <button
          @click="scrollToTop"
          class="bg-yellow-400 text-white p-3 rounded-full shadow-lg hover:bg-yellow-500 ring-4 ring-yellow-200"
        >
          ↑
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from "vue"
import { RouterLink, useRoute } from "vue-router"
import api from "@/services/api"
import Sidebar from "@/components/layout/Sidebar.vue"
import katex from "katex"
import renderMathInElement from "katex/contrib/auto-render"
import "katex/dist/katex.min.css"

const route = useRoute()

const tryout = ref(null)
const soalList = ref([])

const ringkasanKomponen = computed(() => {
  const ringkasan = {}
  soalList.value.forEach((soal) => {
    const nama = soal.komponen_nama || "Tidak Spesifik"
    if (!ringkasan[nama]) ringkasan[nama] = { nama, jumlah: 0, durasi: 0 }
    ringkasan[nama].jumlah++
  })

  if (tryout.value && tryout.value.komponen) {
    tryout.value.komponen.forEach((k) => {
      if (ringkasan[k.nama_komponen]) {
        ringkasan[k.nama_komponen].durasi = k.durasi_menit
      } else {
        ringkasan[k.nama_komponen] = { nama: k.nama_komponen, jumlah: 0, durasi: k.durasi_menit }
      }
    })
  }

  return Object.values(ringkasan)
})

const totalPoin = computed(() => {
  return soalList.value.reduce((total, soal) => {
    return total + (Number(soal.poin) || 0)
  }, 0)
})

const selectedKomponen = ref("")

const normalizeKomponenNama = (nama) => {
  return (nama || "Tidak Spesifik").toString().trim().toLowerCase()
}

const isRingkasanSelected = (nama) => {
  return normalizeKomponenNama(nama) === selectedKomponen.value
}

const filteredSoalList = computed(() => {
  if (!selectedKomponen.value) return soalList.value
  return soalList.value.filter((s) => normalizeKomponenNama(s.komponen_nama) === selectedKomponen.value)
})

const emptyStateText = computed(() => {
  if (!selectedKomponen.value) return "Belum ada soal pada batch ini"
  return "Tidak ada soal untuk komponen yang dipilih"
})

const toggleFilterKomponen = (nama) => {
  const normalized = normalizeKomponenNama(nama)
  if (selectedKomponen.value === normalized) {
    selectedKomponen.value = ""
  } else {
    selectedKomponen.value = normalized
  }
}

const resetFilter = () => {
  selectedKomponen.value = ""
}

const getSoalIndexById = (soalId) => {
  return soalList.value.findIndex((soal) => soal.id === soalId)
}

const getNomorUrut = (soalId) => {
  const index = getSoalIndexById(soalId)
  return index > -1 ? index + 1 : "-"
}

const formatDateTime = (datetime) => {
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

const renderKatex = async () => {
  await nextTick()

  const container = document.querySelector("main")
  if (!container) return

  try {
    renderMathInElement(container, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false }
      ],
      throwOnError: false
    })
  } catch (e) {
    console.error("KaTeX render error:", e)
  }
}

const loading = ref(true)
const showList = ref(false)

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

const scrollToSoal = (soalId) => {
  const element = document.querySelector(`[data-soal="${soalId}"]`)
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  showList.value = false
}

onMounted(async () => {
  try {
    const [tryoutRes, soalRes] = await Promise.all([
      api.get(`/tryout/${route.params.id}`),
      api.get(`/tryout/${route.params.id}/soal-detail`)
    ])

    tryout.value = tryoutRes.data
    soalList.value = soalRes.data

    // tampilkan dulu kontennya
    loading.value = false

    // tunggu DOM benar-benar selesai render
    await nextTick()

    // baru render KaTeX
    await renderKatex()
  } catch (err) {
    console.error("Gagal mengambil detail tryout", err)
    loading.value = false
  }
})

watch(
  () => soalList.value,
  async () => {
    await nextTick()
    await renderKatex()
  },
  { deep: true }
)
</script>
