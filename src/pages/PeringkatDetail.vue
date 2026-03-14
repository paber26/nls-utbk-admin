<template>
  <div class="flex min-h-screen bg-bgsoft font-poppins">
    <Sidebar />

    <main class="flex-1">
      <header class="bg-white border-b px-6 py-4">
        <h1 class="text-lg font-semibold text-slate-800">Detail Peringkat</h1>
        <p class="text-sm text-slate-500">Leaderboard berdasarkan hasil batch tryout</p>
      </header>

      <div class="px-6 py-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-md font-semibold">Leaderboard Peserta - {{ tryoutTitle }}</h2>
          <RouterLink to="/peringkat" class="text-sm px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200">
            Kembali
          </RouterLink>
        </div>

        <div v-if="loading" class="text-center text-slate-500 py-20">Memuat peringkat...</div>

        <div v-else>
          <div v-if="ranking.length" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              v-for="(item, index) in ranking.slice(0, 3)"
              :key="item.user_id"
              class="bg-white border rounded-xl p-6 text-center shadow-sm"
            >
              <div class="text-3xl mb-2">
                <span v-if="index === 0">🥇</span>
                <span v-else-if="index === 1">🥈</span>
                <span v-else>🥉</span>
              </div>

              <h3 class="font-semibold text-slate-800">{{ item.name }}</h3>
              <p class="text-xs text-slate-500">{{ item.sekolah_nama || "-" }}</p>

              <div class="mt-3 text-lg font-bold text-orange-700">
                {{ item.nilai }}
              </div>
            </div>
          </div>

          <div v-if="ranking.length" class="bg-white border rounded-xl overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-100">
                <tr>
                  <th class="px-4 py-3 text-left">Rank</th>
                  <th class="px-4 py-3 text-left">Nama</th>
                  <th class="px-4 py-3 text-left">Sekolah</th>
                  <th class="px-4 py-3 text-center">Nilai</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in ranking" :key="item.user_id" class="border-t hover:bg-slate-50">
                  <td class="px-4 py-3 font-semibold">{{ item.peringkat }}</td>
                  <td class="px-4 py-3">{{ item.name }}</td>
                  <td class="px-4 py-3">{{ item.sekolah_nama || "-" }}</td>
                  <td class="px-4 py-3 text-center font-bold text-orange-700">{{ item.nilai }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="!ranking.length" class="text-center text-slate-400 py-20">
            Belum ada peserta yang menyelesaikan batch tryout ini.
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { RouterLink, useRoute } from "vue-router"
import api from "@/services/api"
import Sidebar from "@/components/layout/Sidebar.vue"

const route = useRoute()

const ranking = ref([])
const loading = ref(true)

const tryoutTitle = computed(() => {
  const paket = route.query?.paket
  if (typeof paket === "string" && paket.trim()) return paket
  return `Batch Tryout #${route.params.id}`
})

const fetchRanking = async () => {
  loading.value = true
  try {
    const res = await api.get(`/leaderboard/${route.params.id}`)
    ranking.value = Array.isArray(res.data) ? res.data : []
  } catch (error) {
    console.error("Gagal mengambil leaderboard:", error)
    ranking.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchRanking)
</script>
