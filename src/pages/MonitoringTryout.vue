<template>
  <div class="flex min-h-screen bg-bgsoft font-poppins">
    <Sidebar />

    <main class="flex-1 px-6 py-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-lg font-semibold">Monitoring Batch Tryout</h1>
          <p class="text-sm text-slate-500">Pantau periode, progres pengerjaan, dan pembukaan pembahasan peserta</p>
        </div>
      </div>

      <div class="mb-2 text-xs text-slate-500">Gunakan filter dan klik header tabel untuk mengurutkan batch tryout.</div>
      <div class="flex flex-wrap gap-3 mb-4 items-center">
        <input
          v-model="searchName"
          type="text"
          placeholder="Cari nama batch tryout..."
          class="border rounded-xl px-3 py-2 text-sm w-56 bg-white"
        />
        <select v-model="filterStatus" class="border rounded-xl px-3 py-2 text-sm bg-white">
          <option value="">Semua Batch</option>
          <option value="ongoing">Masih Ada Peserta Mengerjakan</option>
          <option value="finished">Semua Sudah Selesai</option>
        </select>
      </div>

      <!-- Table -->
      <section class="bg-white rounded-xl border overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-100">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th @click="setSort('paket')" class="px-4 py-3 text-left cursor-pointer select-none hover:bg-slate-200">
                <span class="inline-flex items-center gap-1">
                  Nama Batch
                  <span class="text-[10px] leading-none">
                    <span :class="sortKey === 'paket' && sortOrder === 'asc' ? 'text-slate-800' : 'text-slate-400'">
                      ▲
                    </span>
                    <span :class="sortKey === 'paket' && sortOrder === 'desc' ? 'text-slate-800' : 'text-slate-400'">
                      ▼
                    </span>
                  </span>
                </span>
              </th>
              <th class="px-4 py-3 text-center">Periode</th>
              <th
                @click="setSort('sedang_mengerjakan')"
                class="px-4 py-3 text-center cursor-pointer select-none hover:bg-slate-200"
              >
                <span class="inline-flex items-center gap-1">
                  Sedang Mengerjakan
                  <span class="text-[10px] leading-none">
                    <span
                      :class="
                        sortKey === 'sedang_mengerjakan' && sortOrder === 'asc' ? 'text-slate-800' : 'text-slate-400'
                      "
                    >
                      ▲
                    </span>
                    <span
                      :class="
                        sortKey === 'sedang_mengerjakan' && sortOrder === 'desc' ? 'text-slate-800' : 'text-slate-400'
                      "
                    >
                      ▼
                    </span>
                  </span>
                </span>
              </th>
              <th
                @click="setSort('sudah_selesai')"
                class="px-4 py-3 text-center cursor-pointer select-none hover:bg-slate-200"
              >
                <span class="inline-flex items-center gap-1">
                  Sudah Selesai
                  <span class="text-[10px] leading-none">
                    <span
                      :class="sortKey === 'sudah_selesai' && sortOrder === 'asc' ? 'text-slate-800' : 'text-slate-400'"
                    >
                      ▲
                    </span>
                    <span
                      :class="sortKey === 'sudah_selesai' && sortOrder === 'desc' ? 'text-slate-800' : 'text-slate-400'"
                    >
                      ▼
                    </span>
                  </span>
                </span>
              </th>
              <th
                @click="setSort('total_peserta')"
                class="px-4 py-3 text-center cursor-pointer select-none hover:bg-slate-200"
              >
                <span class="inline-flex items-center gap-1">
                  Total Peserta
                  <span class="text-[10px] leading-none">
                    <span
                      :class="sortKey === 'total_peserta' && sortOrder === 'asc' ? 'text-slate-800' : 'text-slate-400'"
                    >
                      ▲
                    </span>
                    <span
                      :class="sortKey === 'total_peserta' && sortOrder === 'desc' ? 'text-slate-800' : 'text-slate-400'"
                    >
                      ▼
                    </span>
                  </span>
                </span>
              </th>
              <th class="px-4 py-3 text-center">Status</th>
              <th class="px-4 py-3 text-center">Akses Pembahasan</th>
              <th class="px-4 py-3 text-center">Detail</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="9" class="px-4 py-6 text-center text-slate-400">Memuat data monitoring...</td>
            </tr>

            <tr v-for="(item, index) in filteredTryouts" :key="item.id" class="border-t">
              <td class="px-4 py-3">{{ index + 1 }}</td>
              <td class="px-4 py-3 font-medium">{{ item.paket }}</td>

              <td class="px-4 py-3 text-center text-xs text-slate-600">
                <div class="flex flex-col leading-tight">
                  <span>{{ formatDate(item.mulai) }}</span>
                  <span class="text-slate-400">s/d</span>
                  <span>{{ formatDate(item.selesai) }}</span>
                </div>
              </td>

              <td class="px-4 py-3 text-center text-amber-600 font-semibold">
                {{ item.sedang_mengerjakan ?? 0 }}
              </td>

              <td class="px-4 py-3 text-center text-emerald-600 font-semibold">
                {{ item.sudah_selesai ?? 0 }}
              </td>

              <td class="px-4 py-3 text-center font-semibold">
                {{ item.total_peserta ?? 0 }}
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

              <td class="px-4 py-3 text-center">
                <button
                  type="button"
                  class="text-xs px-3 py-2 rounded-lg font-medium transition disabled:opacity-60"
                  :class="
                    item.show_pembahasan
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  "
                  :disabled="Boolean(item.togglingPembahasan)"
                  @click="togglePembahasanUser(item)"
                >
                  {{
                    item.togglingPembahasan
                      ? "Memproses..."
                      : item.show_pembahasan
                        ? "Sembunyikan"
                        : "Buka Pembahasan"
                  }}
                </button>
              </td>

              <td class="px-4 py-3 text-center">
                <RouterLink
                  :to="`/monitoring-tryout/${item.id}`"
                  class="text-primary text-xs font-medium hover:underline"
                >
                  Lihat Peserta
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
import { ref, onMounted, computed } from "vue"
import { RouterLink } from "vue-router"
import api from "@/services/api"
import Sidebar from "@/components/layout/Sidebar.vue"

const tryouts = ref([])
const loading = ref(true)
const pembahasanVisibilityEndpoint = (tryoutId) => `/monitoring-tryout/${tryoutId}/pembahasan-visibility`

const sortKey = ref("")
const sortOrder = ref("desc")
const filterStatus = ref("")
const searchName = ref("")

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

const setSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc"
  } else {
    sortKey.value = key
    sortOrder.value = key === "paket" ? "asc" : "desc"
  }
}

const filteredTryouts = computed(() => {
  let data = [...tryouts.value]

  if (searchName.value) {
    data = data.filter((t) => (t.paket ?? "").toLowerCase().includes(searchName.value.toLowerCase()))
  }

  if (filterStatus.value === "ongoing") {
    data = data.filter((t) => (t.sedang_mengerjakan ?? 0) > 0)
  }

  if (filterStatus.value === "finished") {
    data = data.filter((t) => (t.sedang_mengerjakan ?? 0) === 0 && (t.sudah_selesai ?? 0) > 0)
  }

  if (sortKey.value) {
    data.sort((a, b) => {
      const aVal = a[sortKey.value]
      const bVal = b[sortKey.value]

      if (typeof aVal === "string" || typeof bVal === "string") {
        const A = String(aVal ?? "").toLowerCase()
        const B = String(bVal ?? "").toLowerCase()
        if (A < B) return sortOrder.value === "asc" ? -1 : 1
        if (A > B) return sortOrder.value === "asc" ? 1 : -1
        return 0
      }

      const A = Number(aVal ?? 0)
      const B = Number(bVal ?? 0)
      return sortOrder.value === "asc" ? A - B : B - A
    })
  }

  return data
})

const normalizeTryout = (item) => ({
  ...item,
  show_pembahasan: Boolean(item?.show_pembahasan),
  togglingPembahasan: false
})

const togglePembahasanUser = async (item) => {
  const nextValue = !item.show_pembahasan
  item.togglingPembahasan = true

  try {
    await api.patch(pembahasanVisibilityEndpoint(item.id), {
      show_pembahasan: nextValue
    })
    item.show_pembahasan = nextValue
  } catch (error) {
    console.error("Gagal mengubah visibilitas pembahasan user:", error)
  } finally {
    item.togglingPembahasan = false
  }
}

onMounted(async () => {
  const res = await api.get("/monitoring-tryout")
  tryouts.value = Array.isArray(res.data) ? res.data.map(normalizeTryout) : []
  loading.value = false
})
</script>
