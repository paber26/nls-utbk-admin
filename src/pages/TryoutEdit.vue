<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- MAIN -->
      <main class="flex-1">
        <!-- TOPBAR -->
        <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Edit Batch Tryout</h1>
            <p class="text-sm text-slate-500">{{ form.paket }}</p>
          </div>

          <div class="flex gap-3">
            <RouterLink
              :to="`/tryout/detail/${route.params.id}`"
              class="px-4 py-2 rounded-lg border text-sm hover:bg-slate-100"
            >
              Preview
            </RouterLink>
            <RouterLink
              :to="`/tryout/kelola/${route.params.id}`"
              class="px-4 py-2 rounded-lg border text-sm hover:bg-slate-100"
            >
              Kelola Soal
            </RouterLink>
          </div>
        </header>

        <!-- CONTENT -->
        <div class="px-6 py-6 w-full">
          <form class="space-y-6" @submit.prevent="handleSubmit">
            <!-- INFORMASI UTAMA -->
            <section class="bg-white rounded-xl border p-6 grid md:grid-cols-2 gap-6">
              <div>
                <label class="text-sm text-slate-500">Nama Batch</label>
                <input type="text" v-model="form.paket" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label class="text-sm text-slate-500">Kategori</label>
                <div
                  class="w-full mt-1 px-4 py-2 border rounded-lg bg-orange-50 text-orange-700 border border-orange-200 font-medium"
                >
                  SNBT
                </div>
              </div>

              <div class="md:col-span-2">
                <label class="text-sm text-slate-500 mb-2 block">
                  Komponen
                  <span class="text-xs text-slate-400 font-normal ml-1">(Pilih sesuai urutan pengerjaan)</span>
                </label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    v-for="komponen in komponenList"
                    :key="komponen.id"
                    class="flex items-start gap-3 border p-3 rounded-lg transition-colors"
                    :class="
                      form.komponen_id.includes(komponen.id)
                        ? 'border-orange-500 bg-orange-50'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    "
                  >
                    <input
                      type="checkbox"
                      :id="'komponen-' + komponen.id"
                      :value="komponen.id"
                      v-model="form.komponen_id"
                      class="mt-1 w-4 h-4 text-orange-600 rounded focus:ring-orange-500 cursor-pointer"
                    />
                    <label :for="'komponen-' + komponen.id" class="text-sm text-slate-700 cursor-pointer flex-1">
                      <span class="font-medium block mb-1">
                        {{ komponen.komponen_nama || komponen.nama_komponen || komponen.nama }}
                      </span>
                      <span class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded inline-block">
                        {{ komponen.mata_uji || komponen.tingkat }}
                      </span>
                    </label>
                    <div
                      v-if="form.komponen_id.includes(komponen.id)"
                      class="ml-2 flex flex-col justify-end items-end gap-1"
                    >
                      <div
                        class="w-6 h-6 shrink-0 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold self-end"
                      >
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
                <p class="text-xs text-slate-500 mt-2">
                  * Angka di atas menunjukkan urutan pengerjaan komponen saat tryout berlangsung.
                </p>
              </div>

              <div>
                <label class="text-sm text-slate-500">Durasi (menit)</label>
                <input
                  type="number"
                  :value="totalDurasi"
                  class="w-full mt-1 px-4 py-2 border rounded-lg bg-slate-50 cursor-not-allowed"
                  readonly
                />
              </div>

              <div>
                <label class="text-sm text-slate-500">Waktu Mulai</label>
                <input type="datetime-local" v-model="form.mulai" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label class="text-sm text-slate-500">Waktu Selesai</label>
                <input type="datetime-local" v-model="form.selesai" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>
            </section>

            <!-- KETENTUAN KHUSUS -->
            <section class="bg-white rounded-xl border p-6">
              <label class="text-sm text-slate-500">Ketentuan Khusus (ditampilkan sebelum simulasi dimulai)</label>
              <ckeditor :editor="editor" v-model="form.ketentuan_khusus" :config="editorConfig" class="mt-2" />
            </section>

            <!-- PESAN SETELAH SELESAI -->
            <section class="bg-white rounded-xl border p-6">
              <label class="text-sm text-slate-500">
                Pesan Setelah Selesai (ditampilkan setelah peserta submit simulasi)
              </label>
              <ckeditor :editor="editor" v-model="form.pesan_selesai" :config="editorConfig" class="mt-2" />
            </section>

            <!-- STATUS -->
            <section class="bg-white rounded-xl border p-6 grid gap-2">
              <label class="text-sm text-slate-500">Status Batch</label>
              <select v-model="form.status" class="w-full px-4 py-2 border rounded-lg">
                <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </section>

            <!-- ACTION -->
            <section class="flex gap-4">
              <button
                type="submit"
                class="px-6 py-3 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700"
              >
                Simpan Perubahan
              </button>

              <RouterLink to="/tryout" class="px-6 py-3 rounded-lg border hover:bg-slate-100">Batal</RouterLink>
            </section>
          </form>
        </div>

        <!-- SUCCESS POPUP -->
        <div v-if="showSuccessPopup" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
            <div class="text-emerald-600 text-3xl mb-2">✓</div>
            <h3 class="font-semibold text-slate-800 mb-2">Berhasil</h3>
            <p class="text-sm text-slate-600 mb-4">
              {{ showSuccessPopup }}
            </p>
            <button
              @click="
                () => {
                  showSuccessPopup = ''
                  router.push('/tryout')
                }
              "
              class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              OK
            </button>
          </div>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRoute, useRouter, RouterLink, RouterView } from "vue-router"
import Sidebar from "../components/layout/Sidebar.vue"
import api from "../services/api"
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  Link,
  List,
  Image,
  ImageToolbar,
  ImageStyle,
  ImageUpload,
  ImageResize
} from "ckeditor5"

const route = useRoute()
const router = useRouter()

const editor = ClassicEditor

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return {
      upload: async () => {
        const file = await loader.file
        const data = new FormData()
        data.append("upload", file)

        const response = await api.post("/upload-image", data)

        return {
          default: response.data.url
        }
      }
    }
  }
}

const editorConfig = {
  licenseKey: "GPL",
  extraPlugins: [MyCustomUploadAdapterPlugin],
  plugins: [
    Essentials,
    Bold,
    Italic,
    Paragraph,
    Mention,
    Undo,
    Link,
    List,
    Image,
    ImageToolbar,
    ImageStyle,
    ImageUpload,
    ImageResize
  ],
  toolbar: ["undo", "redo", "|", "bold", "italic", "link", "bulletedList", "numberedList", "|", "uploadImage"],
  image: {
    toolbar: ["imageStyle:alignLeft", "imageStyle:alignCenter", "imageStyle:alignRight", "|", "resizeImage"],
    resizeOptions: [
      {
        name: "resizeImage:original",
        label: "Original",
        value: null
      },
      {
        name: "resizeImage:50",
        label: "50%",
        value: "50"
      },
      {
        name: "resizeImage:75",
        label: "75%",
        value: "75"
      }
    ]
  }
}

const form = ref({
  paket: "",
  komponen_id: [],
  durasiPerKomponen: {},
  durasi_menit: "",
  mulai: "",
  selesai: "",
  ketentuan_khusus: "",
  pesan_selesai: ""
})

const showSuccessPopup = ref("")

const komponenList = ref([])

const fetchKomponen = async () => {
  try {
    const res = await api.get("/komponen")
    komponenList.value = res.data.data || res.data
  } catch (err) {
    console.error("Gagal mengambil data komponen:", err)
  }
}

const totalDurasi = computed(() => {
  return form.value.komponen_id.reduce((sum, id) => {
    return sum + (Number(form.value.durasiPerKomponen[id]) || 0)
  }, 0)
})

const statusOptions = computed(() => [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Aktif" },
  { value: "finished", label: "Ditutup" }
])

onMounted(async () => {
  fetchKomponen()
  try {
    const id = route.params.id
    const { data } = await api.get(`/tryout/${id}`)

    // Format date for datetime-local input
    const formatDateTime = (dt) => (dt ? new Date(dt).toISOString().slice(0, 16) : "")

    form.value = {
      paket: data.paket ?? "",
      komponen_id: data.komponen ? data.komponen.map((k) => k.id) : [],
      durasiPerKomponen: data.komponen
        ? data.komponen.reduce((acc, k) => {
            acc[k.id] = k.durasi_menit
            return acc
          }, {})
        : {},
      durasi_menit: data.durasi_menit ?? "",
      mulai: formatDateTime(data.mulai),
      selesai: formatDateTime(data.selesai),
      status: data.status ?? "",
      ketentuan_khusus: data.ketentuan_khusus ?? "",
      pesan_selesai: data.pesan_selesai ?? ""
    }
  } catch (err) {
    // handle error, e.g. notify user
  }
})

const handleSubmit = async () => {
  try {
    const id = route.params.id
    const payload = {
      paket: form.value.paket,
      komponen: form.value.komponen_id.map((id) => ({
        id,
        durasi_menit: Number(form.value.durasiPerKomponen[id]) || 0
      })),
      durasi_menit: totalDurasi.value,
      mulai: form.value.mulai,
      selesai: form.value.selesai,
      status: form.value.status,
      ketentuan_khusus: form.value.ketentuan_khusus,
      pesan_selesai: form.value.pesan_selesai
    }

    const res = await api.put(`/tryout/${id}`, payload)
    showSuccessPopup.value = res.data.message || "Batch tryout berhasil diperbarui"
  } catch (err) {
    console.error("Gagal memperbarui tryout:", err)
    // handle error, e.g. notify user
  }
}
</script>
