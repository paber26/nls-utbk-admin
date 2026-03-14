<template>
  <div class="bg-bgsoft font-poppins min-h-screen">
    <div class="flex min-h-screen">
      <Sidebar />

      <main class="flex-1">
        <header class="bg-white border-b px-6 py-4">
          <h1 class="text-lg font-semibold text-slate-800">Dashboard Admin</h1>
          <p class="text-sm text-slate-500">Ringkasan operasional platform tryout UTBK/SNBT</p>
        </header>

        <div class="px-6 py-6 space-y-6">
          <section class="rounded-3xl overflow-hidden bg-[linear-gradient(135deg,#061E29_0%,#1D546D_65%,#5F9598_100%)] text-white relative">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(95,149,152,0.22),_transparent_34%)]"></div>
            <div class="relative px-8 py-8 md:px-10 md:py-10 grid lg:grid-cols-[1.5fr_1fr] gap-8 items-center">
              <div>
                <p class="text-sm uppercase tracking-[0.3em] text-[#c8dbdc]">Next Level Study UTBK</p>
                <h2 class="mt-3 text-3xl md:text-4xl font-bold leading-tight">
                  Kendalikan batch tryout, paket soal, dan analisis peserta dari satu panel admin.
                </h2>
                <p class="mt-4 max-w-2xl text-slate-300 leading-relaxed">
                  Fokus pada simulasi penuh, distribusi subtes, dan pemeringkatan peserta supaya operasional SNBT tetap
                  rapi dari persiapan hingga evaluasi hasil.
                </p>

                <div class="mt-6 flex flex-wrap gap-3">
                  <RouterLink
                    to="/tryout/tambah"
                    class="px-5 py-3 rounded-xl bg-white text-[#061E29] font-semibold hover:bg-[#d9e7e8] transition"
                  >
                    Buat Batch Tryout
                  </RouterLink>
                  <RouterLink
                    to="/monitoring-tryout"
                    class="px-5 py-3 rounded-xl border border-white/15 text-white hover:bg-white/10 transition"
                  >
                    Pantau Pengerjaan
                  </RouterLink>
                </div>
              </div>

              <div class="grid gap-4">
                <div class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <p class="text-sm text-white/80">Subtes prioritas</p>
                  <p class="mt-2 text-2xl font-bold">TPS • Literasi • PM</p>
                  <p class="mt-2 text-sm text-white/65">
                    Gunakan data dashboard untuk melihat batch dan partisipasi paling aktif.
                  </p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p class="text-sm text-white/80">Batch aktif</p>
                    <p class="mt-2 text-2xl font-bold">{{ totalTryoutAktif }}</p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p class="text-sm text-white/80">Partisipasi</p>
                    <p class="mt-2 text-2xl font-bold">{{ totalPartisipasi }}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section v-if="loading" class="bg-white rounded-xl border p-8 text-center text-slate-500">
            Memuat ringkasan panel admin...
          </section>

          <section v-else class="space-y-6">
            <div
              v-if="errorMessage"
              class="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 text-sm"
            >
              {{ errorMessage }}
            </div>

            <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <article class="bg-white rounded-2xl border p-5">
                <p class="text-xs uppercase tracking-wide text-slate-500">Total Batch Tryout</p>
                <p class="text-2xl font-bold text-slate-800 mt-1">{{ totalTryout }}</p>
              </article>

              <article class="bg-white rounded-2xl border p-5">
                <p class="text-xs uppercase tracking-wide text-slate-500">Batch Aktif</p>
                <p class="text-2xl font-bold text-emerald-700 mt-1">{{ totalTryoutAktif }}</p>
              </article>

              <article class="bg-white rounded-2xl border p-5">
                <p class="text-xs uppercase tracking-wide text-slate-500">Total Peserta</p>
                <p class="text-2xl font-bold text-orange-700 mt-1">{{ totalPeserta }}</p>
              </article>

              <article class="bg-white rounded-2xl border p-5">
                <p class="text-xs uppercase tracking-wide text-slate-500">Sekolah Terhubung</p>
                <p class="text-2xl font-bold text-emerald-800 mt-1">{{ totalSekolah }}</p>
              </article>
            </section>

            <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <article class="bg-white rounded-2xl border p-5 lg:col-span-2">
                <h2 class="text-sm font-semibold text-slate-800 mb-3">Monitoring Aktivitas Peserta</h2>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div class="rounded-xl border p-4 bg-amber-50 border-amber-200">
                    <p class="text-xs text-slate-500">Sedang Mengerjakan</p>
                    <p class="text-xl font-bold text-amber-700">{{ totalSedangMengerjakan }}</p>
                  </div>
                  <div class="rounded-xl border p-4 bg-emerald-50 border-emerald-200">
                    <p class="text-xs text-slate-500">Sudah Selesai</p>
                    <p class="text-xl font-bold text-emerald-700">{{ totalSudahSelesai }}</p>
                  </div>
                  <div class="rounded-xl border p-4 bg-orange-50 border-orange-200">
                    <p class="text-xs text-slate-500">Total Partisipasi</p>
                    <p class="text-xl font-bold text-slate-700">{{ totalPartisipasi }}</p>
                  </div>
                </div>
              </article>

              <article class="bg-white rounded-2xl border p-5">
                <h2 class="text-sm font-semibold text-slate-800 mb-3">Aksi Cepat</h2>
                <div class="space-y-2">
                  <RouterLink
                    to="/tryout"
                    class="block text-sm px-3 py-2 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100"
                  >
                    Kelola Batch Tryout
                  </RouterLink>
                  <RouterLink
                    to="/monitoring-tryout"
                    class="block text-sm px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  >
                    Monitoring Peserta
                  </RouterLink>
                  <RouterLink
                    to="/banksoal"
                    class="block text-sm px-3 py-2 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100"
                  >
                    Kelola Paket Soal
                  </RouterLink>
                  <RouterLink
                    to="/peserta"
                    class="block text-sm px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
                  >
                    Kelola Peserta SNBT
                  </RouterLink>
                </div>
              </article>
            </section>

            <section class="bg-white rounded-xl border overflow-x-auto">
              <div class="px-4 py-3 border-b">
                <h2 class="text-sm font-semibold text-slate-800">Batch Tryout Terbaru</h2>
              </div>
              <table class="w-full text-sm">
                <thead class="bg-slate-100">
                  <tr>
                    <th class="px-4 py-3 text-left">No</th>
                    <th class="px-4 py-3 text-left">Batch</th>
                    <th class="px-4 py-3 text-left">Subtes / Kategori</th>
                    <th class="px-4 py-3 text-center">Mulai</th>
                    <th class="px-4 py-3 text-center">Selesai</th>
                    <th class="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="recentTryouts.length === 0">
                    <td colspan="6" class="px-4 py-6 text-center text-slate-400">Belum ada batch tryout.</td>
                  </tr>
                  <tr v-for="(item, index) in recentTryouts" :key="item.id" class="border-t">
                    <td class="px-4 py-3">{{ index + 1 }}</td>
                    <td class="px-4 py-3 font-medium">{{ item.paket || "-" }}</td>
                    <td class="px-4 py-3">{{ getSubtestLabel(item) }}</td>
                    <td class="px-4 py-3 text-center">{{ formatDate(item.mulai) }}</td>
                    <td class="px-4 py-3 text-center">{{ formatDate(item.selesai) }}</td>
                    <td class="px-4 py-3 text-center">
                      <span
                        class="px-2 py-1 text-xs rounded font-medium"
                        :class="{
                          'bg-slate-200 text-slate-700': item.status === 'draft',
                          'bg-emerald-100 text-emerald-700': item.status === 'active',
                          'bg-orange-100 text-orange-700': item.status === 'finished'
                        }"
                      >
                        {{ item.status === "draft" ? "Draft" : item.status === "active" ? "Aktif" : "Ditutup" }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { RouterLink } from "vue-router"
import api from "@/services/api"
import Sidebar from "../components/layout/Sidebar.vue"

const loading = ref(true)
const errorMessage = ref("")

const tryouts = ref([])
const monitoringTryouts = ref([])
const totalPeserta = ref(0)
const totalSekolah = ref(0)

const formatDate = (datetime) => {
  if (!datetime) return "-"
  const date = new Date(datetime)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

const toArray = (data) => (Array.isArray(data) ? data : [])
const getSubtestLabel = (item) => item?.mapel || item?.mapel_nama || item?.subtes || item?.kategori || "-"

const totalTryout = computed(() => tryouts.value.length)
const totalTryoutAktif = computed(() => tryouts.value.filter((item) => item.status === "active").length)

const totalSedangMengerjakan = computed(() =>
  monitoringTryouts.value.reduce((sum, item) => sum + Number(item.sedang_mengerjakan ?? 0), 0)
)
const totalSudahSelesai = computed(() =>
  monitoringTryouts.value.reduce((sum, item) => sum + Number(item.sudah_selesai ?? 0), 0)
)
const totalPartisipasi = computed(() =>
  monitoringTryouts.value.reduce((sum, item) => sum + Number(item.total_peserta ?? 0), 0)
)

const recentTryouts = computed(() => {
  return [...tryouts.value]
    .sort((a, b) => new Date(b.mulai || 0) - new Date(a.mulai || 0))
    .slice(0, 6)
})

onMounted(async () => {
  loading.value = true
  errorMessage.value = ""

  try {
    const [tryoutRes, monitoringRes, pesertaRes, sekolahRes] = await Promise.all([
      api.get("/tryout"),
      api.get("/monitoring-tryout"),
      api.get("/peserta", { params: { page: 1, per_page: 1 } }),
      api.get("/sekolah")
    ])

    tryouts.value = toArray(tryoutRes.data)
    monitoringTryouts.value = toArray(monitoringRes.data)

    totalPeserta.value = Number(pesertaRes?.data?.total ?? 0)

    const sekolahData = sekolahRes?.data?.data ?? sekolahRes?.data ?? []
    totalSekolah.value = Array.isArray(sekolahData) ? sekolahData.length : Number(sekolahRes?.data?.total ?? 0)
  } catch (error) {
    console.error("Gagal memuat dashboard:", error)
    errorMessage.value = "Sebagian data dashboard gagal dimuat. Coba refresh halaman."
  } finally {
    loading.value = false
  }
})
</script>
