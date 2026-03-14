<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- MAIN -->
      <main class="flex-1">
        <!-- TOPBAR -->
        <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Detail Peserta</h1>
            <p class="text-sm text-slate-500">Informasi lengkap peserta tryout UTBK/SNBT</p>
          </div>

          <RouterLink to="/peserta" class="px-4 py-2 rounded-lg border text-sm hover:bg-slate-100">
            ← Kembali
          </RouterLink>
        </header>

        <!-- CONTENT -->
        <div class="px-6 py-6 w-full space-y-6">
          <!-- PROFIL PESERTA -->
          <section class="bg-white rounded-xl border p-6 text-sm">
            <div v-if="loading" class="text-center py-10 text-slate-500">Memuat data peserta...</div>

            <div v-else-if="peserta" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
              <div>
                <p class="text-slate-500">Nama</p>
                <p class="font-medium">{{ peserta?.nama_lengkap || peserta?.name || "-" }}</p>
              </div>
              <div>
                <p class="text-slate-500">Sekolah</p>
                <p class="font-medium">{{ peserta?.sekolah?.nama ? peserta.sekolah.nama : "-" }}</p>
              </div>
              <div>
                <p class="text-slate-500">Kelas</p>
                <p class="font-medium">{{ peserta?.kelas || "-" }}</p>
              </div>
              <div>
                <p class="text-slate-500">WhatsApp</p>
                <p class="font-medium">{{ peserta?.whatsapp || "-" }}</p>
              </div>
              <div>
                <p class="text-slate-500">Asal Daerah</p>
                <p class="font-medium">
                  {{ peserta?.provinsi ? peserta.provinsi + (peserta?.kota ? ", " + peserta.kota : "") : "-" }}
                </p>
              </div>
              <div>
                <p class="text-slate-500">Email</p>
                <p class="font-medium">{{ peserta?.email || "-" }}</p>
              </div>
              <div>
                <p class="text-slate-500">Terdaftar Pada</p>
                <p class="font-medium">{{ peserta?.created_at ? formatTanggal(peserta.created_at) : "-" }}</p>
              </div>
              <div>
                <p class="text-slate-500">Tryout Diikuti</p>
                <p class="font-medium">{{ peserta?.total_tryout ?? 0 }}</p>
              </div>
            </div>
          </section>

          <section
            :class="[
              'rounded-xl border p-6 text-sm transition-all duration-300',
              peserta?.is_event_registered ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'
            ]"
          >
            <h3 class="font-semibold mb-4" :class="peserta?.is_event_registered ? 'text-emerald-700' : 'text-rose-700'">
              Status Aktivasi Batch
            </h3>

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium" :class="peserta?.is_event_registered ? 'text-emerald-700' : 'text-rose-700'">
                  {{ peserta?.is_event_registered ? "Peserta Aktif pada Program UTBK" : "Peserta Belum Aktif pada Program UTBK" }}
                </p>
                <p class="text-xs text-slate-500">Mengontrol akses peserta ke batch/program aktif (kolom is_event_registered)</p>
              </div>

              <select
                @change="toggleEventStatus($event.target.value)"
                :value="peserta?.is_event_registered ? 1 : 0"
                :class="[
                  'px-4 py-2 text-xs rounded-lg border focus:outline-none focus:ring-2',
                  peserta?.is_event_registered
                    ? 'bg-emerald-100 border-emerald-400 focus:ring-emerald-400'
                    : 'bg-rose-100 border-rose-400 focus:ring-rose-400'
                ]"
              >
                <option :value="1">Aktif</option>
                <option :value="0">Nonaktif</option>
              </select>
            </div>
          </section>

          <section class="bg-white rounded-xl border p-6 text-sm">
            <h3 class="font-semibold text-slate-800 mb-4">Ubah Password Peserta</h3>

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-slate-700">Admin dapat mengatur password baru untuk peserta</p>
                <p class="text-xs text-slate-500">Password akan langsung diperbarui dan di-hash oleh sistem.</p>
              </div>

              <button
                @click="confirmResetPassword"
                class="px-4 py-2 text-xs rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition"
              >
                Ubah Password
              </button>
            </div>
          </section>

          <section class="bg-white rounded-xl border p-6 space-y-6 text-sm">
            <div>
              <h3 class="font-semibold text-slate-800 mb-4">Riwayat Tryout Peserta</h3>

              <div v-if="peserta?.tryouts?.length" class="overflow-x-auto">
                <table class="w-full text-sm border rounded-lg overflow-hidden">
                  <thead class="bg-slate-100">
                    <tr>
                      <th class="px-4 py-3 text-left">No</th>
                      <th class="px-4 py-3 text-left">Nama Tryout</th>
                      <th class="px-4 py-3 text-center">Status</th>
                      <th class="px-4 py-3 text-center">Nilai</th>
                      <th class="px-4 py-3 text-center">Tanggal Selesai</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in peserta.tryouts"
                      :key="item.id"
                      class="border-t hover:bg-slate-50 transition"
                    >
                      <td class="px-4 py-3">{{ index + 1 }}</td>
                      <td class="px-4 py-3 font-medium text-slate-700">
                        {{ item.nama }}
                      </td>
                      <td class="px-4 py-3 text-center">
                        <span
                          class="text-xs px-3 py-1 rounded-full font-medium"
                          :class="
                            item.status === 'submitted'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          "
                        >
                          {{ item.status }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-center font-semibold">
                        {{ item.nilai ?? "-" }}
                      </td>
                      <td class="px-4 py-3 text-center text-xs text-slate-600">
                        {{ formatTanggal(item.selesai) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-else class="text-slate-500 text-sm">Peserta belum memiliki riwayat batch tryout.</div>
            </div>
          </section>

          <p class="text-xs text-slate-500">*Data ditampilkan berdasarkan seluruh batch tryout yang telah diselesaikan peserta.</p>
        </div>
        <div v-if="showResetConfirm" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div class="bg-white rounded-xl shadow-lg px-6 py-6 w-[360px]">
            <h3 class="text-sm font-semibold text-slate-800 mb-4 text-center">Ubah Password Peserta</h3>

            <input
              v-model="newPassword"
              type="password"
              placeholder="Masukkan password baru"
              class="w-full px-3 py-2 text-sm border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />

            <div class="flex justify-end gap-3">
              <button @click="showResetConfirm = false" class="px-4 py-2 text-xs rounded-lg border hover:bg-slate-100">
                Batal
              </button>
              <button
                @click="updatePassword"
                class="px-4 py-2 text-xs rounded-lg bg-orange-600 text-white hover:bg-orange-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
        <div v-if="showSuccessPopup" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div class="bg-white rounded-xl shadow-lg px-6 py-5 text-center w-[320px]">
            <p class="text-sm font-semibold text-emerald-600 mb-2">Berhasil</p>
            <p class="text-xs text-slate-600">{{ successMessage }}</p>
          </div>
        </div>
        <div v-if="showErrorPopup" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div class="bg-white rounded-xl shadow-lg px-6 py-5 text-center w-[320px]">
            <p class="text-sm font-semibold text-rose-600 mb-2">Gagal</p>
            <p class="text-xs text-slate-600">{{ errorMessage }}</p>
          </div>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { RouterLink, useRoute } from "vue-router"
import { ref, onMounted } from "vue"
import api from "@/services/api"

import Sidebar from "../components/layout/Sidebar.vue"

const route = useRoute()
const peserta = ref(null)
const loading = ref(true)
const showSuccessPopup = ref(false)
const successMessage = ref("")
const showErrorPopup = ref(false)
const errorMessage = ref("")
const showResetConfirm = ref(false)
const newPassword = ref("")

const formatTanggal = (datetime) => {
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

const fetchDetailPeserta = async () => {
  try {
    const { data } = await api.get(`/peserta/detail/${route.params.id}`)
    peserta.value = {
      ...data,
      tryouts: [] // siapkan array kosong dulu
    }
  } catch (error) {
    console.error("Gagal mengambil detail peserta", error)
  }
}

const fetchRiwayatTryout = async () => {
  try {
    const { data } = await api.get(`/peserta/${route.params.id}/riwayat`)

    if (!peserta.value) return

    peserta.value.tryouts = data.riwayat.map((item) => ({
      id: item.attempt_id,
      nama: item.nama_tryout,
      status: item.status,
      nilai: item.nilai,
      selesai: item.selesai
    }))
  } catch (error) {
    console.error("Gagal mengambil riwayat tryout", error)
  }
}

const toggleEventStatus = async (value) => {
  try {
    const { data } = await api.patch(`/peserta/toggle-event/${route.params.id}`, { is_event_registered: Number(value) })

    peserta.value.is_event_registered = data.is_event_registered
    successMessage.value = "Status aktivasi peserta berhasil diperbarui."
    showSuccessPopup.value = true
    setTimeout(() => {
      showSuccessPopup.value = false
    }, 2000)
  } catch (error) {
    console.error("Gagal mengubah status event", error)
  }
}

const confirmResetPassword = () => {
  showResetConfirm.value = true
}

const updatePassword = async () => {
  if (!newPassword.value) {
    errorMessage.value = "Gagal memperbarui password: password baru harus diisi."
    showErrorPopup.value = true
    setTimeout(() => {
      showErrorPopup.value = false
    }, 2000)
    return
  }

  try {
    await api.post(`/peserta/${route.params.id}/update-password`, {
      password: newPassword.value
    })

    newPassword.value = ""
    showResetConfirm.value = false
    successMessage.value = "Password peserta berhasil diperbarui."
    showSuccessPopup.value = true

    setTimeout(() => {
      showSuccessPopup.value = false
    }, 2000)
  } catch (error) {
    console.error("Gagal mengubah password", error)

    errorMessage.value = error?.response?.data?.message || "Terjadi kesalahan saat memperbarui password"

    showErrorPopup.value = true
    setTimeout(() => {
      showErrorPopup.value = false
    }, 2500)
  }
}

onMounted(async () => {
  loading.value = true
  await fetchDetailPeserta()
  await fetchRiwayatTryout()
  loading.value = false
})
</script>
