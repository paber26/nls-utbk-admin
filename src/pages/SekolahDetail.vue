<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- MAIN -->
      <main class="flex-1">
        <!-- TOPBAR -->
        <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Detail Sekolah</h1>
            <p class="text-sm text-slate-500">{{ sekolah.nama }}</p>
          </div>

          <RouterLink to="/sekolah" class="px-4 py-2 rounded-lg border text-sm hover:bg-slate-100">
            ← Kembali
          </RouterLink>
        </header>

        <!-- CONTENT -->
        <div class="px-6 py-6 w-full space-y-6">
          <section class="bg-white rounded-xl border p-6 grid md:grid-cols-5 gap-6 text-sm">
            <div>
              <p class="text-slate-500">Nama Sekolah</p>
              <p class="font-medium">{{ sekolah.nama }}</p>
            </div>
            <div>
              <p class="text-slate-500">NPSN</p>
              <p class="font-medium">{{ sekolah.npsn }}</p>
            </div>
            <div>
              <p class="text-slate-500">Jenjang</p>
              <p class="font-medium">{{ sekolah.jenjang }}</p>
            </div>
            <div>
              <p class="text-slate-500">Status</p>
              <p class="font-medium">{{ sekolah.status }}</p>
            </div>
            <div>
              <p class="text-slate-500">Jumlah Peserta</p>
              <p class="font-medium text-orange-700">{{ sekolah.jumlah_peserta || 0 }}</p>
            </div>
          </section>

          <section class="bg-white rounded-xl border overflow-x-auto">
            <div class="p-4 border-b">
              <h3 class="font-semibold text-slate-800">Daftar Peserta UTBK</h3>
            </div>

            <table class="w-full text-sm">
              <thead class="bg-slate-100">
                <tr>
                  <th class="px-4 py-3 text-left">Nama</th>
                  <th class="px-4 py-3 text-center">Email</th>
                  <th class="px-4 py-3 text-center">WhatsApp</th>
                  <th class="px-4 py-3 text-center">Kelas</th>
                </tr>
              </thead>

              <tbody>
                <tr v-if="loading">
                  <td colspan="4" class="px-4 py-6 text-center text-slate-500">Memuat data peserta...</td>
                </tr>

                <tr v-for="user in peserta" :key="user.id" class="border-t">
                  <td class="px-4 py-3 font-medium">{{ user.name }}</td>
                  <td class="px-4 py-3 text-center">{{ user.email }}</td>
                  <td class="px-4 py-3 text-center">{{ user.whatsapp || "-" }}</td>
                  <td class="px-4 py-3 text-center">{{ user.kelas || "-" }}</td>
                </tr>

                <tr v-if="!loading && peserta.length === 0">
                  <td colspan="4" class="px-4 py-6 text-center text-slate-500">Belum ada peserta di sekolah ini</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import Sidebar from "../components/layout/Sidebar.vue"
import api from "@/services/api"

const route = useRoute()
const sekolah = ref({})
const peserta = ref([])
const loading = ref(false)

const fetchDetail = async () => {
  loading.value = true
  try {
    const res = await api.get(`/sekolah/${route.params.id}`)
    sekolah.value = res.data.data
  } catch (err) {
    console.error("Gagal mengambil detail sekolah:", err)
  } finally {
    loading.value = false
  }
}

const fetchPeserta = async () => {
  try {
    const res = await api.get(`/sekolah/${route.params.id}/peserta`)
    peserta.value = res.data.data.data || []
  } catch (err) {
    console.error("Gagal mengambil peserta sekolah:", err)
  }
}

onMounted(() => {
  fetchDetail()
  fetchPeserta()
})
</script>
