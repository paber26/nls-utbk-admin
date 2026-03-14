<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar />

      <main class="flex-1">
        <!-- Header -->
        <header class="bg-white border-b px-6 py-4">
          <h1 class="text-lg font-semibold text-slate-800">Tambah Soal</h1>
          <p class="text-sm text-slate-500">Tambahkan soal baru ke bank soal UTBK/SNBT</p>
        </header>

        <!-- Form -->
        <div class="px-6 py-6 w-full">
          <form class="bg-white border rounded-xl p-6 space-y-4 w-full" @submit.prevent="submitSoal">
            <div>
              <label class="block text-sm font-medium mb-1">Subtes / Kategori</label>
              <select v-model="mapelId" class="w-full px-4 py-2 border rounded-lg text-sm">
                <option value="">Pilih Subtes</option>

                <option v-for="mapel in mapelList" :key="mapel.id" :value="mapel.id">
                  {{ mapel.nama }} ({{ mapel.tingkat }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Tipe Soal</label>
              <select v-model="tipeSoal" class="w-full px-4 py-2 border rounded-lg text-sm">
                <option value="pg">Pilihan Ganda</option>
                <option value="isian">Isian</option>
                <option value="pg_kompleks">PG Kompleks (Benar / Salah)</option>
                <option value="pg_majemuk">PG Majemuk (Lebih dari 1 jawaban benar)</option>
              </select>
              <div class="mt-2">
                <span
                  v-if="tipeSoal === 'pg'"
                  class="px-3 py-1 text-xs rounded-full bg-amber-100 text-amber-700 font-medium"
                >
                  Pilihan Ganda
                </span>

                <span
                  v-if="tipeSoal === 'pg_majemuk'"
                  class="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-700 font-medium"
                >
                  PG Majemuk
                </span>

                <span
                  v-if="tipeSoal === 'pg_kompleks'"
                  class="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-700 font-medium"
                >
                  PG Kompleks
                </span>

                <span
                  v-if="tipeSoal === 'isian'"
                  class="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 font-medium"
                >
                  Isian
                </span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Pertanyaan</label>
              <ckeditor :editor="editor" v-model="pertanyaan" :config="editorConfig" />
            </div>

            <div v-if="tipeSoal === 'isian'" class="p-4 rounded-xl border bg-green-50 border-green-200">
              <label class="block text-sm font-medium mb-1 text-slate-800 font-semibold">Jawaban</label>
              <input
                v-model="jawabanIsian"
                type="text"
                class="w-full px-4 py-2 border rounded-lg text-sm"
                placeholder="Jawaban benar"
              />
            </div>

            <div v-if="tipeSoal === 'pg'" class="p-4 rounded-xl border bg-amber-50 border-amber-200">
              <label class="block text-sm font-medium mb-2 text-slate-800 font-semibold">Opsi Jawaban</label>

              <div v-for="(opsi, index) in opsiJawaban" :key="index" class="flex gap-2 mb-2">
                <input type="radio" name="jawaban_benar" :checked="opsi.is_correct" @change="setJawabanBenar(index)" />

                <div class="flex-1">
                  <ckeditor :editor="editor" v-model="opsi.text" :config="editorConfig" />
                </div>

                <input
                  v-model.number="opsi.poin"
                  type="number"
                  class="w-24 px-3 py-2 border rounded-lg text-sm"
                  placeholder="Poin"
                />

                <button
                  type="button"
                  @click="hapusOpsi(index)"
                  class="px-3 py-2 text-sm border rounded-lg text-red-500"
                  v-if="opsiJawaban.length > 2"
                >
                  Hapus
                </button>
              </div>

              <button type="button" @click="tambahOpsi" class="mt-2 px-4 py-2 border rounded-lg text-sm">
                ➕ Tambah Opsi
              </button>
            </div>

            <div v-if="tipeSoal === 'pg_majemuk'" class="p-4 rounded-xl border bg-orange-50 border-orange-200">
              <label class="block text-sm font-medium mb-2 text-slate-800 font-semibold">
                Opsi Jawaban (Bisa lebih dari satu benar)
              </label>

              <div v-for="(opsi, index) in opsiJawaban" :key="index" class="flex gap-2 mb-2">
                <input type="checkbox" v-model="opsi.is_correct" />

                <div class="flex-1">
                  <ckeditor :editor="editor" v-model="opsi.text" :config="editorConfig" />
                </div>

                <input
                  v-model.number="opsi.poin"
                  type="number"
                  class="w-24 px-3 py-2 border rounded-lg text-sm"
                  placeholder="Poin"
                />

                <button
                  type="button"
                  @click="hapusOpsi(index)"
                  class="px-3 py-2 text-sm border rounded-lg text-red-500"
                  v-if="opsiJawaban.length > 2"
                >
                  Hapus
                </button>
              </div>

              <button type="button" @click="tambahOpsi" class="mt-2 px-4 py-2 border rounded-lg text-sm">
                + Tambah Opsi
              </button>

              <p class="text-xs text-slate-600 mt-2">⚠️ Minimal 3 opsi dan minimal 2 jawaban benar harus dipilih.</p>
            </div>

            <div v-if="tipeSoal === 'pg_kompleks'" class="p-4 rounded-xl border bg-orange-50 border-orange-200">
              <label class="block text-sm font-medium mb-2 text-slate-800 font-semibold">Pernyataan</label>

              <div v-for="(item, index) in pernyataanKompleks" :key="index" class="flex items-center gap-3 mb-2">
                <span class="text-sm w-5">{{ index + 1 }}.</span>

                <div class="flex-1">
                  <ckeditor :editor="editor" v-model="item.text" :config="editorConfig" />
                </div>

                <select v-model="item.jawaban" class="px-3 py-2 border rounded-lg text-sm">
                  <option :value="true">Benar</option>
                  <option :value="false">Salah</option>
                </select>
              </div>

              <p class="text-xs text-slate-500 mt-2">Skor otomatis: 4 benar = 1 poin, 3 benar = 0.6, 2 benar = 0.2</p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Pembahasan</label>
              <ckeditor :editor="editor" v-model="pembahasan" :config="editorConfig" />
            </div>

            <div class="flex gap-3 pt-4">
              <RouterLink to="/banksoal" class="px-4 py-2 rounded-lg border text-sm">Batal</RouterLink>

              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 rounded-lg bg-orange-600 text-white text-sm hover:bg-orange-700 disabled:opacity-50"
              >
                {{ loading ? "Menyimpan..." : "Simpan Soal" }}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>

    <div v-if="showPopup" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 text-center">
        <h2 class="text-lg font-semibold text-slate-800 mb-3">Informasi</h2>
        <p class="text-sm text-slate-600 mb-6">{{ popupMessage }}</p>
        <button @click="closePopup" class="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
          Tutup
        </button>
      </div>
    </div>
  </body>
</template>

<script setup>
import Sidebar from "@/components/layout/Sidebar.vue"
import { ref, onMounted } from "vue"
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
  ImageResize,
  ImageResizeButtons
} from "ckeditor5"
import api from "@/services/api"
import { useRouter } from "vue-router"

const editor = ClassicEditor

// ===============================
// CKEditor Custom Upload Adapter
// ===============================

function MyUploadAdapter(loader) {
  this.loader = loader
}

MyUploadAdapter.prototype.upload = function () {
  return this.loader.file.then((file) => {
    const data = new FormData()
    data.append("upload", file)

    return api
      .post("/upload-image", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then((res) => {
        return {
          default: res.data.url
        }
      })
  })
}

MyUploadAdapter.prototype.abort = function () {}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader)
  }
}

const editorConfig = {
  licenseKey: "GPL",
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
    ImageResize,
    ImageResizeButtons
  ],
  extraPlugins: [MyCustomUploadAdapterPlugin],
  toolbar: ["undo", "redo", "|", "bold", "italic", "link", "|", "bulletedList", "numberedList", "|", "uploadImage"],
  image: {
    resizeOptions: [
      {
        name: "resizeImage:original",
        label: "Original",
        value: null
      },
      {
        name: "resizeImage:25",
        label: "25%",
        value: "25"
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
    ],
    toolbar: ["imageStyle:alignLeft", "imageStyle:alignCenter", "imageStyle:alignRight", "|", "resizeImage"],
    resizeUnit: "%"
  }
}

const router = useRouter()
const tipeSoal = ref("pg")
const jawabanIsian = ref("")
const opsiJawaban = ref([
  { text: "", is_correct: false, poin: 0 },
  { text: "", is_correct: false, poin: 0 }
])
const pernyataanKompleks = ref([
  { text: "", jawaban: true },
  { text: "", jawaban: true },
  { text: "", jawaban: true },
  { text: "", jawaban: true }
])
const draftSoal = ref([])

const tambahOpsi = () => {
  opsiJawaban.value.push({ text: "", is_correct: false, poin: 0 })
}

const hapusOpsi = (index) => {
  opsiJawaban.value.splice(index, 1)
}

const setJawabanBenar = (index) => {
  opsiJawaban.value.forEach((opsi, i) => {
    opsi.is_correct = i === index
  })
}

const mapelList = ref([])
const mapelId = ref("")
const pertanyaan = ref("")
const pembahasan = ref("")
const loading = ref(false)

const showPopup = ref(false)
const popupMessage = ref("")

const openPopup = (message) => {
  popupMessage.value = message
  showPopup.value = true
}

const closePopup = () => {
  showPopup.value = false
}

onMounted(async () => {
  try {
    const res = await api.get("/mapel")
    mapelList.value = res.data
  } catch (err) {
    console.error("Gagal load mapel", err)
  }

  // 🔑 load draft soal
  const existing = localStorage.getItem("draft_banksoal")
  draftSoal.value = existing ? JSON.parse(existing) : []

  // Auto-fill form with last draft if available
  if (draftSoal.value.length > 0) {
    const last = draftSoal.value[draftSoal.value.length - 1]

    mapelId.value = last.mapel_id || ""
    tipeSoal.value = last.tipe || "pg"
    pertanyaan.value = last.pertanyaan || ""
    pembahasan.value = last.pembahasan || ""

    if (last.tipe === "isian") {
      jawabanIsian.value = last.jawaban || ""
    } else if (last.tipe === "pg") {
      opsiJawaban.value = last.jawaban || []
    } else if (last.tipe === "pg_kompleks") {
      pernyataanKompleks.value = last.pernyataan || [
        { text: "", jawaban: true },
        { text: "", jawaban: true },
        { text: "", jawaban: true },
        { text: "", jawaban: true }
      ]
    }
  }
})

const submitSoal = async () => {
  if (!mapelId.value) {
    openPopup("Subtes wajib dipilih")
    return
  }

  if (!pertanyaan.value.trim()) {
    openPopup("Pertanyaan wajib diisi")
    return
  }

  // validasi khusus PG
  if (tipeSoal.value === "pg") {
    // 🔥 validasi teks opsi tidak boleh kosong
    const adaKosong = opsiJawaban.value.some((o) => !o.text || !o.text.trim())
    if (adaKosong) {
      openPopup("Semua opsi jawaban harus diisi")
      return
    }

    if (opsiJawaban.value.length < 2) {
      openPopup("Minimal 2 opsi jawaban")
      return
    }

    const adaBenar = opsiJawaban.value.some((o) => o.is_correct)
    if (!adaBenar) {
      openPopup("Pilih satu jawaban benar")
      return
    }
  }

  if (tipeSoal.value === "pg_majemuk") {
    // 🔥 validasi teks opsi tidak boleh kosong
    const adaKosong = opsiJawaban.value.some((o) => !o.text || !o.text.trim())
    if (adaKosong) {
      openPopup("Semua opsi jawaban PG Majemuk harus diisi")
      return
    }

    if (opsiJawaban.value.length < 3) {
      openPopup("PG Majemuk minimal memiliki 3 opsi jawaban")
      return
    }

    const jumlahBenar = opsiJawaban.value.filter((o) => o.is_correct).length

    if (jumlahBenar < 2) {
      openPopup("PG Majemuk minimal harus memiliki 2 jawaban benar")
      return
    }
  }

  if (tipeSoal.value === "pg_kompleks") {
    const kosong = pernyataanKompleks.value.some((p) => !p.text.trim())
    if (kosong) {
      openPopup("Semua pernyataan wajib diisi")
      return
    }
  }

  loading.value = true

  try {
    const payload = {
      mapel_id: mapelId.value,
      tipe: tipeSoal.value,
      pertanyaan: pertanyaan.value,
      pembahasan: pembahasan.value,
      jawaban_isian: tipeSoal.value === "isian" ? jawabanIsian.value : null,
      opsi_jawaban: tipeSoal.value === "pg" || tipeSoal.value === "pg_majemuk" ? opsiJawaban.value : [],
      pernyataan: tipeSoal.value === "pg_kompleks" ? pernyataanKompleks.value : []
    }

    const existing = localStorage.getItem("draft_banksoal")
    const drafts = existing ? JSON.parse(existing) : []

    draftSoal.value.push({
      ...payload,
      created_at: new Date().toISOString()
    })

    localStorage.setItem("draft_banksoal", JSON.stringify(draftSoal.value))

    // Kirim draft ke backend
    const res = await api.post("/banksoal", payload)

    if (res.data && res.data.success) {
      openPopup(res.data.message || "Soal berhasil disimpan")

      // Hapus draft setelah berhasil disimpan ke server
      localStorage.removeItem("draft_banksoal")
      draftSoal.value = []

      router.push("/banksoal")
    } else {
      openPopup("Soal tersimpan di localStorage, tapi gagal dikirim ke server")
    }
  } catch (err) {
    console.error(err)

    const msg = err.response?.data?.message || "Gagal menyimpan soal"

    openPopup(msg)
  }
}
</script>
