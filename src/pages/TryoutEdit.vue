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
                <div class="w-full mt-1 px-4 py-2 border rounded-lg bg-orange-50 text-orange-700 border border-orange-200 font-medium">
                  UTBK/SNBT
                </div>
              </div>

              <div>
                <label class="text-sm text-slate-500">Subtes / Kategori Soal</label>
                <select class="w-full mt-1 px-4 py-2 border rounded-lg" v-model="form.mapel_id">
                  <option value="">Pilih Subtes</option>
                  <option v-for="mapel in mapels" :key="mapel.id" :value="mapel.id">
                    {{ mapel.nama }}
                  </option>
                </select>
              </div>

              <div>
                <label class="text-sm text-slate-500">Durasi (menit)</label>
                <input type="number" v-model="form.durasi_menit" class="w-full mt-1 px-4 py-2 border rounded-lg" />
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
  mapel_id: "",
  durasi_menit: "",
  mulai: "",
  selesai: "",
  ketentuan_khusus: "",
  pesan_selesai: ""
})

const mapels = ref([])

const fetchMapel = async () => {
  try {
    const res = await api.get("/mapel")
    mapels.value = res.data.data || res.data
  } catch (err) {
    console.error("Gagal mengambil data mapel:", err)
  }
}

const statusOptions = computed(() => [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Aktif" },
  { value: "finished", label: "Ditutup" }
])

onMounted(async () => {
  fetchMapel()
  try {
    const id = route.params.id
    const { data } = await api.get(`/tryout/${id}`)
    form.value = {
      paket: data.paket ?? "",
      mapel_id: data.mapel_id ?? "",
      durasi_menit: data.durasi_menit ?? "",
      mulai: data.mulai ?? "",
      selesai: data.selesai ?? "",
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
      mapel_id: Number(form.value.mapel_id),
      durasi_menit: Number(form.value.durasi_menit),
      mulai: form.value.mulai,
      selesai: form.value.selesai,
      status: form.value.status,
      ketentuan_khusus: form.value.ketentuan_khusus,
      pesan_selesai: form.value.pesan_selesai
    }

    const res = await api.put(`/tryout/${id}`, payload)
    alert(res.data.message || "Batch tryout berhasil diperbarui")
    router.push("/tryout")
  } catch (err) {
    console.error("Gagal memperbarui tryout:", err)
    // handle error, e.g. notify user
  }
}
</script>
