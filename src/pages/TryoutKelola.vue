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
        <h2 class="font-medium mb-4">Soal di Dalam Batch</h2>

        <div v-if="loadingSoal" class="text-sm text-slate-400">Memuat paket soal...</div>

        <table v-else class="w-full text-sm border">
          <thead class="bg-slate-100">
            <tr>
              <th class="px-3 py-2 text-left">Urutan</th>
              <th class="px-3 py-2 text-left">Isi Soal</th>
              <th class="px-3 py-2 text-center">Poin</th>
              <th class="px-3 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="soalTryout.length === 0">
              <td colspan="4" class="px-3 py-4 text-center text-slate-400">Belum ada soal pada batch ini</td>
            </tr>

            <tr v-for="(soal, index) in soalTryout" :key="soal.id" class="border-t">
              <td class="px-3 py-2 flex items-center gap-1">
                <button class="text-xs px-2 border rounded" :disabled="index === 0" @click="naikkanUrutan(index)">
                  ↑
                </button>

                <button
                  class="text-xs px-2 border rounded"
                  :disabled="index === soalTryout.length - 1"
                  @click="turunkanUrutan(index)"
                >
                  ↓
                </button>

                <span class="ml-2">{{ index + 1 }}</span>
              </td>
              <td class="px-3 py-2">{{ (soal.pertanyaan || "").substring(0, 100) }}...</td>

              <td class="px-3 py-2 text-center">
                <input
                  type="number"
                  min="0"
                  class="w-20 px-2 py-1 border rounded text-sm text-center"
                  v-model.number="soal.poin"
                  @change="updatePoin(soal)"
                />
              </td>

              <td class="px-3 py-2 text-center">
                <button class="text-xs text-red-500 hover:underline" @click="hapusSoal(soal.id)">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="bg-white rounded-xl border p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <input
            v-model="filter.q"
            @input="loadBankSoal"
            type="text"
            placeholder="Cari soal atau kata kunci..."
            class="px-3 py-2 border rounded-lg text-sm"
          />

          <select v-model="filter.mapel_id" @change="loadBankSoal" class="px-3 py-2 border rounded-lg text-sm">
            <option value="">Semua Subtes</option>
            <option v-for="m in daftarMapel" :key="m.id" :value="m.id">
              {{ m.nama }}
            </option>
          </select>
        </div>

        <h2 class="font-medium mb-4">Tambahkan Soal dari Bank Soal</h2>

        <div v-if="loadingBank" class="text-sm text-slate-400">Memuat bank soal...</div>

        <table v-else class="w-full text-sm border">
          <thead class="bg-slate-100">
            <tr>
              <th class="px-3 py-2 text-left">Subtes</th>
              <th class="px-3 py-2 text-left">Isi Soal</th>
              <th class="px-3 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="soal in bankSoal" :key="soal.id" class="border-t">
              <td class="px-3 py-2">
                {{ soal.mapel_nama || "-" }}
              </td>
              <td class="px-3 py-2">{{ (soal.pertanyaan || "").substring(0, 100) }}...</td>
              <td class="px-3 py-2 text-center">
                <button
                  class="text-xs"
                  :class="sudahDipakai(soal.id) ? 'text-slate-400 cursor-not-allowed' : 'text-primary hover:underline'"
                  :disabled="sudahDipakai(soal.id)"
                  @click="tambahSoal(soal.id)"
                >
                  {{ sudahDipakai(soal.id) ? "Sudah ditambahkan" : "Tambahkan" }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, RouterLink } from "vue-router"
import api from "@/services/api"
import Sidebar from "@/components/layout/Sidebar.vue"

const route = useRoute()

const tryout = ref(null)
const soalTryout = ref([])
const bankSoal = ref([])

const sudahDipakai = (bankSoalId) => {
  return soalTryout.value.some((s) => s.banksoal_id === bankSoalId || s.id === bankSoalId)
}

const loadingSoal = ref(true)
const loadingBank = ref(true)

const filter = ref({
  q: "",
  mapel_id: ""
})

const daftarMapel = ref([])

const loadTryout = async () => {
  const res = await api.get(`/tryout/${route.params.id}`)
  tryout.value = res.data
}

const loadMapel = async () => {
  const res = await api.get("/mapel")
  daftarMapel.value = res.data
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
        mapel_id: filter.value.mapel_id
      }
    })
    bankSoal.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    bankSoal.value = []
    console.error(e)
  } finally {
    loadingBank.value = false
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

const naikkanUrutan = (index) => {
  if (index === 0) return
  const temp = soalTryout.value[index]
  soalTryout.value[index] = soalTryout.value[index - 1]
  soalTryout.value[index - 1] = temp
}

const turunkanUrutan = (index) => {
  if (index === soalTryout.value.length - 1) return
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

onMounted(() => {
  loadTryout()
  loadSoalTryout()
  loadBankSoal()
  loadMapel()
})
</script>
