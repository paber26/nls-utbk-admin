<template>
  <div class="bg-bgsoft font-poppins min-h-screen flex">
    <Sidebar />

    <main class="flex-1">
      <!-- TOPBAR -->
      <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-lg font-semibold">Detail Batch Tryout</h1>
          <p class="text-sm text-slate-500">Preview paket soal sebelum batch dibuka ke peserta</p>
        </div>

        <div class="flex gap-3">
          <RouterLink
            :to="`/tryout/kelola/${route.params.id}`"
            class="px-4 py-2 rounded-lg border text-sm hover:bg-slate-100"
          >
            Kelola Soal
          </RouterLink>

          <RouterLink
            :to="`/tryout/edit/${route.params.id}`"
            class="px-4 py-2 rounded-lg bg-orange-600 text-white text-sm hover:bg-orange-700"
          >
            Edit Batch
          </RouterLink>
        </div>
      </header>

      <div v-if="loading" class="px-6 py-6 text-slate-500">Memuat detail batch tryout...</div>

      <div v-else class="px-6 py-6">
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

          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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
        <section v-if="ringkasanKomponen.length > 0" class="bg-white rounded-xl border p-6 mb-6">
          <h2 class="font-medium mb-4">Ringkasan Komponen Soal</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="(ringkasan, idx) in ringkasanKomponen"
              :key="idx"
              class="p-4 border rounded-xl flex flex-col items-center justify-center bg-slate-50 relative"
            >
              <span class="text-3xl font-bold text-blue-600 mb-1">{{ ringkasan.jumlah }}</span>
              <span class="text-xs text-slate-500 text-center font-medium">{{ ringkasan.nama }}</span>
            </div>
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

        <section class="space-y-6">
          <div
            v-for="(item, index) in soalList"
            :key="item.id"
            :data-soal="index"
            :class="[
              'rounded-xl border p-6',
              item.tipe === 'pg' && 'bg-amber-50 border-amber-200',
              item.tipe === 'pg_majemuk' && 'bg-orange-50 border-orange-200',
              item.tipe === 'pg_kompleks' && 'bg-orange-50 border-orange-200',
              item.tipe === 'isian' && 'bg-emerald-50 border-emerald-200'
            ]"
          >
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-semibold">
                Soal {{ index + 1 }}
                <span
                  class="text-xs px-2 py-1 rounded-full font-medium"
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
                
                <span class="ml-2 text-xs px-2 py-1 text-slate-600 border rounded-full">
                  {{ item.komponen_nama || '-' }}
                </span>
              </h3>

              <RouterLink
                :to="`/banksoal/edit/${item.id}`"
                class="text-xs px-3 py-1 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition"
              >
                Edit Paket Soal
              </RouterLink>
            </div>

            <div class="mb-4 leading-relaxed" v-html="item.pertanyaan"></div>

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

            <ul v-if="item.tipe === 'pg' || item.tipe === 'pg_majemuk'" class="space-y-2 text-sm">
              <li
                v-for="opsi in item.opsi"
                :key="opsi.id"
                class="flex justify-between items-center"
                :class="opsi.is_correct ? 'font-semibold text-emerald-600' : ''"
              >
                <span v-html="`${opsi.label}. ${opsi.teks}`"></span>

                <span class="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">{{ opsi.poin }} poin</span>
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
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="(item, index) in soalList"
                  :key="item.id"
                  @click="scrollToSoal(index)"
                  class="text-xs py-2 rounded-lg border bg-slate-50 hover:bg-blue-600 hover:text-white transition"
                >
                  {{ index + 1 }}
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
    if (!ringkasan[nama]) ringkasan[nama] = 0
    ringkasan[nama]++
  })
  
  return Object.entries(ringkasan).map(([nama, jumlah]) => ({ nama, jumlah }))
})

const totalPoin = computed(() => {
  return soalList.value.reduce((total, soal) => {
    return total + (Number(soal.poin) || 0)
  }, 0)
})

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

const scrollToSoal = (index) => {
  const elements = document.querySelectorAll("[data-soal]")
  if (elements[index]) {
    elements[index].scrollIntoView({ behavior: "smooth", block: "start" })
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
