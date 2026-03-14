<template>
  <div class="flex min-h-screen bg-bgsoft font-poppins">
    <Sidebar />

    <main class="flex-1 px-6 py-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-lg font-semibold">Tryout</h1>
          <p class="text-sm text-slate-500">Daftar tryout yang tersedia</p>
        </div>

        <RouterLink
          to="/tryout/tambah"
          class="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
        >
          + Tambah Tryout
        </RouterLink>
      </div>

      <!-- Filter Mapel -->
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <label class="text-sm font-medium">Mapel:</label>
        <select v-model="selectedMapel" @change="fetchTryout" class="px-3 py-2 border rounded-lg text-sm">
          <option value="">Semua</option>
          <option v-for="m in mapelList" :key="m.id" :value="m.id">
            {{ m.nama }}
          </option>
        </select>

        <input
          v-model="searchNama"
          type="text"
          placeholder="Cari nama tryout..."
          class="px-3 py-2 border rounded-lg text-sm w-64"
        />
      </div>

      <!-- Table -->
      <section class="bg-white rounded-xl border overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-100">
            <tr>
              <th class="px-4 py-3 text-left">Nama Paket</th>
              <th class="px-4 py-3 text-left">Mapel</th>
              <th class="px-4 py-3 text-center">Jumlah Soal</th>
              <th class="px-4 py-3 text-center">Periode</th>
              <th class="px-4 py-3 text-center">Status</th>
              <th class="px-4 py-3 text-center">Pembuat</th>
              <th class="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="px-4 py-6 text-center text-slate-400">Memuat data...</td>
            </tr>

            <tr v-for="item in tryouts" :key="item.id" class="border-t">
              <td class="px-4 py-3 font-medium">{{ item.paket }}</td>
              <td class="px-4 py-3">{{ item.mapel }}</td>
              <td class="px-4 py-3 text-center font-medium">
                {{ item.total_soal ?? 0 }}
              </td>

              <td class="px-4 py-3 text-center text-xs text-slate-600">
                <div class="flex flex-col leading-tight">
                  <span>{{ formatDate(item.mulai) }}</span>
                  <span class="text-slate-400">s/d</span>
                  <span>{{ formatDate(item.selesai) }}</span>
                </div>
              </td>

              <td class="px-4 py-3 text-center">
                <span
                  class="px-2 py-1 text-xs rounded font-medium"
                  :class="{
                    'bg-slate-200 text-slate-700': item.status === 'draft',
                    'bg-emerald-100 text-emerald-700': item.status === 'active',
                    'bg-blue-100 text-blue-700': item.status === 'finished'
                  }"
                >
                  {{ item.status === "draft" ? "Draft" : item.status === "active" ? "Aktif" : "Selesai" }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">{{ item.pembuat }}</td>
              <td class="px-4 py-3 text-center space-x-2">
                <RouterLink :to="`/tryout/detail/${item.id}`" class="text-xs text-primary hover:underline">
                  Detail
                </RouterLink>
                <RouterLink :to="`/tryout/edit/${item.id}`" class="text-xs text-slate-600 hover:underline">
                  Edit
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import { RouterLink } from "vue-router"
import api from "@/services/api"
import Sidebar from "@/components/layout/Sidebar.vue"

const tryouts = ref([])
const allTryouts = ref([])
const loading = ref(true)
const selectedMapel = ref("")
const searchNama = ref("")
const mapelList = ref([])

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

const fetchTryout = async () => {
  loading.value = true
  try {
    const res = await api.get("/tryout", {
      params: {
        mapel_id: selectedMapel.value || undefined
      }
    })

    allTryouts.value = res.data
    applySearch()
  } catch (error) {
    console.error("Gagal mengambil data tryout:", error)
  } finally {
    loading.value = false
  }
}

const applySearch = () => {
  if (!searchNama.value) {
    tryouts.value = allTryouts.value
    return
  }

  const keyword = (searchNama.value || "").toString().toLowerCase().trim()

  tryouts.value = allTryouts.value.filter((t) => (t.paket || "").toLowerCase().includes(keyword))
}

watch(searchNama, () => {
  applySearch()
})

const fetchMapel = async () => {
  const res = await api.get("/mapel")
  mapelList.value = res.data
}

onMounted(async () => {
  await fetchMapel()
  await fetchTryout()
})
</script>
