<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- MAIN -->
      <main class="flex-1">
        <!-- TOPBAR -->
        <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Buat Batch Tryout</h1>
            <p class="text-sm text-slate-500">Konfigurasi awal simulasi SNBT sebelum paket soal ditambahkan</p>
          </div>

          <RouterLink to="/tryout" class="px-4 py-2 rounded-lg border text-sm hover:bg-slate-100">← Kembali</RouterLink>
        </header>

        <!-- CONTENT -->
        <div class="px-6 py-6 w-full">
          <form class="space-y-6" @submit.prevent="submitTryout">
            <section class="bg-white rounded-xl border p-6 grid md:grid-cols-2 gap-6">
              <div>
                <label class="text-sm text-slate-500">Nama Batch</label>
                <input
                  type="text"
                  class="w-full mt-1 px-4 py-2 border rounded-lg"
                  placeholder="Contoh: Simulasi Penuh SNBT Batch 01"
                  v-model="form.paket"
                />
                <p v-if="errors.paket" class="text-xs text-red-500 mt-1">
                  {{ errors.paket }}
                </p>
              </div>

              <div>
                <label class="text-sm text-slate-500">Kategori</label>
                <div class="w-full mt-1 px-4 py-2 border rounded-lg bg-orange-50 text-orange-700 border border-orange-200">
                  SNBT
                </div>
              </div>

              <div class="md:col-span-2">
                <label class="text-sm text-slate-500 mb-2 block">
                  Komponen <span class="text-xs text-slate-400 font-normal ml-1">(Pilih sesuai urutan pengerjaan)</span>
                </label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    v-for="komponen in komponenList"
                    :key="komponen.id"
                    class="flex items-start gap-3 border p-3 rounded-lg transition-colors"
                    :class="form.komponen_id.includes(komponen.id) ? 'border-orange-500 bg-orange-50' : 'bg-white border-slate-200 hover:bg-slate-50'"
                  >
                    <input
                      type="checkbox"
                      :id="'komponen-' + komponen.id"
                      :value="komponen.id"
                      v-model="form.komponen_id"
                      class="mt-1 w-4 h-4 text-orange-600 rounded focus:ring-orange-500 cursor-pointer"
                    />
                    <label :for="'komponen-' + komponen.id" class="text-sm text-slate-700 cursor-pointer flex-1">
                      <span class="font-medium block mb-1">{{ komponen.komponen_nama || komponen.nama_komponen }}</span>
                      <span class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded inline-block">{{ komponen.mata_uji }}</span>
                    </label>
                    <div v-if="form.komponen_id.includes(komponen.id)" class="ml-2 flex flex-col justify-end items-end gap-1">
                      <div class="w-6 h-6 shrink-0 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold self-end">
                        {{ form.komponen_id.indexOf(komponen.id) + 1 }}
                      </div>
                      <input
                        type="number"
                        v-model="form.durasiPerKomponen[komponen.id]"
                        placeholder="Menit"
                        class="w-16 px-2 py-1 text-xs border rounded border-slate-300 text-center"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>
                <p v-if="errors.komponen_id" class="text-xs text-red-500 mt-1">
                  {{ errors.komponen_id }}
                </p>
                <p class="text-xs text-slate-500 mt-2">
                  * Angka di atas menunjukkan urutan pengerjaan komponen saat tryout berlangsung.
                </p>
              </div>

              <div>
                <label class="text-sm text-slate-500">Durasi (menit)</label>
                <input
                  type="number"
                  class="w-full mt-1 px-4 py-2 border rounded-lg bg-slate-50 cursor-not-allowed"
                  :value="totalDurasi"
                  readonly
                />
                <p v-if="errors.durasi_menit" class="text-xs text-red-500 mt-1">
                  {{ errors.durasi_menit }}
                </p>
              </div>
            </section>

            <section class="bg-white rounded-xl border p-6 grid md:grid-cols-2 gap-6">
              <div>
                <label class="text-sm text-slate-500">Tanggal Mulai</label>
                <input type="date" class="w-full mt-1 px-4 py-2 border rounded-lg" v-model="form.mulai" />
                <p v-if="errors.mulai" class="text-xs text-red-500 mt-1">
                  {{ errors.mulai }}
                </p>
              </div>

              <div>
                <label class="text-sm text-slate-500">Tanggal Selesai</label>
                <input type="date" class="w-full mt-1 px-4 py-2 border rounded-lg" v-model="form.selesai" />
                <p v-if="errors.selesai" class="text-xs text-red-500 mt-1">
                  {{ errors.selesai }}
                </p>
              </div>

              <div>
                <label class="text-sm text-slate-500">Waktu Mulai</label>
                <input type="time" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label class="text-sm text-slate-500">Waktu Selesai</label>
                <input type="time" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>
            </section>

            <section class="flex gap-4 justify-end">
              <button
                type="submit"
                class="px-6 py-3 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700"
              >
                Simpan & Lanjutkan
              </button>
            </section>
          </form>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"
import api from "@/services/api"
import Sidebar from "../components/layout/Sidebar.vue"

const router = useRouter()

const form = ref({
  paket: "",
  komponen_id: [],
  durasiPerKomponen: {},
  durasi_menit: "",
  mulai: "",
  selesai: "",
  is_active: 0
})

const errors = ref({})

const komponenList = ref([])

const totalDurasi = computed(() => {
  return form.value.komponen_id.reduce((sum, id) => {
    return sum + (Number(form.value.durasiPerKomponen[id]) || 0)
  }, 0)
})

const fetchKomponen = async () => {
  try {
    const res = await api.get("/komponen")
    komponenList.value = res.data.data || res.data
  } catch (err) {
    console.error("Gagal mengambil data komponen:", err)
  }
}

const loadDraftOrApi = () => {
  const draft = localStorage.getItem("draft_tryout")
  if (draft) {
    try {
      const parsed = JSON.parse(draft)
      form.value = {
        ...form.value,
        ...parsed
      }
    } catch (e) {
      // console.error("Gagal memuat draft tryout:", e)
    }
  }
}

onMounted(() => {
  loadDraftOrApi()
  fetchKomponen()
})

const validateForm = () => {
  errors.value = {}

  if (!form.value.paket || form.value.paket.length < 3) {
    errors.value.paket = "Nama batch minimal 3 karakter"
  }

  if (!form.value.komponen_id || form.value.komponen_id.length === 0) {
    errors.value.komponen_id = "Minimal satu komponen wajib dipilih"
  }

  if (!totalDurasi.value || totalDurasi.value <= 0) {
    errors.value.durasi_menit = "Durasi harus lebih dari 0 menit"
  }

  if (!form.value.mulai) {
    errors.value.mulai = "Tanggal mulai wajib diisi"
  }

  if (!form.value.selesai) {
    errors.value.selesai = "Tanggal selesai wajib diisi"
  }

  if (form.value.mulai && form.value.selesai && new Date(form.value.mulai) > new Date(form.value.selesai)) {
    errors.value.selesai = "Tanggal selesai harus setelah tanggal mulai"
  }

  return Object.keys(errors.value).length === 0
}

const submitTryout = async () => {
  if (!validateForm()) {
    return
  }
  try {
    // simpan draft terakhir ke localStorage
    localStorage.setItem("draft_tryout_last", JSON.stringify(form.value))
    // simpan draft ke localStorage
    // const existing = localStorage.getItem("draft_tryout")
    // const drafts = existing ? JSON.parse(existing) : []

    // drafts.push({
    //   ...form.value,
    //   created_at: new Date().toISOString()
    // })

    const payload = {
      ...form.value,
      durasi_menit: totalDurasi.value,
      komponen: form.value.komponen_id.map(id => ({
        id,
        durasi_menit: Number(form.value.durasiPerKomponen[id]) || 0
      }))
    }
    delete payload.komponen_id
    delete payload.durasiPerKomponen

    localStorage.setItem("draft_tryout", JSON.stringify(form.value))

    // kirim ke backend
    const res = await api.post("/tryout", payload)


    if (res.data?.success) {
      alert(res.data.message)
      localStorage.removeItem("draft_tryout")
      router.push("/tryout")
    } else {
      alert("Batch tryout tersimpan di draft, tapi gagal dikirim ke server")
    }
  } catch (err) {
    alert(err.response?.data?.message || "Gagal menyimpan batch tryout")
  }
}
</script>
