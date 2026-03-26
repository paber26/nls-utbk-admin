<template>
  <div class="flex min-h-screen bg-bgsoft font-poppins">
    <Sidebar />

    <main class="flex-1 px-6 py-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-lg font-semibold">Manajemen Tryout</h1>
          <p class="text-sm text-slate-500">Kelola batch simulasi penuh, paket subtes, dan tryout diagnostik UTBK</p>
        </div>

        <RouterLink
          to="/tryout/tambah"
          class="px-5 py-2.5 bg-orange-600 text-white text-sm font-semibold rounded-xl shadow-md hover:bg-orange-700 transition"
        >
          + Buat Batch Tryout
        </RouterLink>
      </div>

      <div class="mb-4 flex flex-wrap items-center gap-3">
        <label class="text-sm font-medium">Komponen:</label>
        <select
          v-model="selectedKomponen"
          @change="fetchTryout"
          class="px-3 py-2 border rounded-xl text-sm bg-white"
        >
          <option value="">Semua Komponen</option>
          <option v-for="k in komponenList" :key="k.id" :value="k.id">
            {{ k.nama_komponen }}
          </option>
        </select>

        <input
          v-model="searchNama"
          type="text"
          placeholder="Cari nama batch tryout..."
          class="px-3 py-2 border rounded-xl text-sm w-64 bg-white"
        />
      </div>

      <section class="bg-white rounded-xl border overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-100">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th
                @click="setSort('paket')"
                class="px-4 py-3 text-left cursor-pointer select-none hover:bg-slate-200 transition"
              >
                <span class="inline-flex items-center gap-1">
                  Nama Batch
                  <span class="text-[10px] leading-none">
                    <span :class="sortKey === 'paket' && sortDir === 'asc' ? 'text-slate-800' : 'text-slate-400'">
                      ▲
                    </span>
                    <span :class="sortKey === 'paket' && sortDir === 'desc' ? 'text-slate-800' : 'text-slate-400'">
                      ▼
                    </span>
                  </span>
                </span>
              </th>
              <th
                @click="setSort('komponen_text')"
                class="px-4 py-3 text-left cursor-pointer select-none hover:bg-slate-200 transition"
              >
                <span class="inline-flex items-center gap-1">
                  Komponen
                  <span class="text-[10px] leading-none">
                    <span :class="sortKey === 'komponen_text' && sortDir === 'asc' ? 'text-slate-800' : 'text-slate-400'">
                      ▲
                    </span>
                    <span :class="sortKey === 'komponen_text' && sortDir === 'desc' ? 'text-slate-800' : 'text-slate-400'">
                      ▼
                    </span>
                  </span>
                </span>
              </th>
              <th class="px-4 py-3 text-center">Jumlah Soal</th>
              <th class="px-4 py-3 text-center">Periode</th>
              <th class="px-4 py-3 text-center">Status</th>
              <th class="px-4 py-3 text-center">PIC</th>
              <th class="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="px-4 py-6 text-center text-slate-400">Memuat data batch tryout...</td>
            </tr>

            <tr v-for="(item, index) in tryouts" :key="item.id" class="border-t">
              <td class="px-4 py-3">{{ index + 1 }}</td>
              <td class="px-4 py-3 font-medium">{{ item.paket }}</td>
              <td class="px-4 py-3">{{ item.komponen_text || '-' }}</td>
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
                    'bg-orange-100 text-orange-700': item.status === 'finished'
                  }"
                >
                  {{ item.status === "draft" ? "Draft" : item.status === "active" ? "Aktif" : "Ditutup" }}
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
const selectedKomponen = ref("")
const searchNama = ref("")
const komponenList = ref([])
const sortKey = ref("")
const sortDir = ref("asc")

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
        komponen_id: selectedKomponen.value || undefined
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

const setSort = (key) => {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc"
  } else {
    sortKey.value = key
    sortDir.value = "asc"
  }
  applySearch()
}

const applySort = (list) => {
  if (!sortKey.value) return list

  return [...list].sort((a, b) => {
    const A = (a?.[sortKey.value] ?? "").toString().toLowerCase()
    const B = (b?.[sortKey.value] ?? "").toString().toLowerCase()

    if (A < B) return sortDir.value === "asc" ? -1 : 1
    if (A > B) return sortDir.value === "asc" ? 1 : -1
    return 0
  })
}

const applySearch = () => {
  let filtered = [...allTryouts.value]
  const keyword = (searchNama.value || "").toString().toLowerCase().trim()

  if (keyword) {
    filtered = filtered.filter((t) => (t.paket || "").toLowerCase().includes(keyword))
  }

  tryouts.value = applySort(filtered)
}

watch(searchNama, () => {
  applySearch()
})

const fetchKomponen = async () => {
  const res = await api.get("/komponen")
  komponenList.value = res.data
}

onMounted(async () => {
  await fetchKomponen()
  await fetchTryout()
})
</script>
