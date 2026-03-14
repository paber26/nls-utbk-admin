<template>
  <div class="flex min-h-screen bg-bgsoft font-poppins">
    <Sidebar />

    <main class="flex-1">
      <!-- Topbar -->
      <header class="bg-white border-b px-6 py-4">
        <h1 class="text-lg font-semibold text-slate-800">Leaderboard Peserta</h1>
        <p class="text-sm text-slate-500">Pantau pemeringkatan berdasarkan hasil tryout UTBK/SNBT</p>
      </header>

      <div class="px-6 py-8">
        <div v-if="loadingTryouts" class="text-center text-slate-500 py-20">Memuat daftar tryout...</div>

        <div v-else>
          <h2 class="text-md font-semibold mb-4">Pilih Batch Tryout</h2>
          <div class="flex items-center gap-3 mb-4">
            <span class="text-sm text-slate-600">Filter Status:</span>

            <select
              v-model="statusFilter"
              class="border rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none"
            >
              <option value="all">Semua</option>
              <option value="active">Sedang Berjalan</option>
              <option value="finished">Selesai</option>
            </select>
          </div>

          <div v-if="tryouts.length" class="bg-white border rounded-xl overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-100">
                <tr>
                  <th class="px-4 py-3 text-left">No</th>
                  <th class="px-4 py-3 text-left">Batch</th>
                  <th class="px-4 py-3 text-left">Mulai</th>
                  <th class="px-4 py-3 text-left">Selesai</th>
                  <th class="px-4 py-3 text-center">Status</th>
                  <th class="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in tryouts" :key="item.id" class="border-t hover:bg-slate-50 transition">
                  <td class="px-4 py-3">{{ index + 1 }}</td>
                  <td class="px-4 py-3 font-medium text-slate-800">
                    {{ item.paket }}
                  </td>
                  <td class="px-4 py-3">
                    {{ formatDate(item.mulai) }}
                  </td>
                  <td class="px-4 py-3">
                    {{ formatDate(item.selesai) }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span
                      class="text-xs px-3 py-1 rounded-full font-semibold"
                      :class="
                        item.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                      "
                    >
                      {{ item.status === "active" ? "Aktif" : "Selesai" }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <RouterLink
                      :to="{ name: 'PeringkatDetail', params: { id: item.id }, query: { paket: item.paket || '' } }"
                      class="text-xs px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition inline-block"
                    >
                      Lihat
                    </RouterLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="!tryouts.length" class="text-center text-slate-400 py-20">Belum ada batch tryout tersedia.</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import { RouterLink } from "vue-router"
import api from "@/services/api"
import Sidebar from "../components/layout/Sidebar.vue"

const tryouts = ref([])

const loadingTryouts = ref(true)

const statusFilter = ref("all")

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

const fetchTryouts = async () => {
  loadingTryouts.value = true
  try {
    let url = "/leaderboard/tryouts"

    if (statusFilter.value !== "all") {
      url += `?status=${statusFilter.value}`
    }

    const res = await api.get(url)
    tryouts.value = res.data
  } catch (error) {
    console.error("Gagal mengambil tryout:", error)
  } finally {
    loadingTryouts.value = false
  }
}

watch(statusFilter, () => {
  fetchTryouts()
})

onMounted(fetchTryouts)
</script>
