<template>
  <div class="flex min-h-screen bg-bgsoft font-poppins">
    <Sidebar />

    <main class="flex-1 px-6 py-6">
      <h1 class="text-lg font-semibold mb-4">Edit Soal</h1>

      <form class="bg-white border rounded-xl p-6 space-y-4 w-full" @submit.prevent="submitEdit">
        <!-- Mapel -->
        <div>
          <label class="block text-sm font-medium mb-1">Mapel</label>
          <select v-model="mapelId" class="w-full px-4 py-2 border rounded-lg">
            <option value="">Pilih Mapel</option>
            <option v-for="m in mapelList" :key="m.id" :value="m.id">
              {{ m.nama }}
            </option>
          </select>
        </div>

        <!-- Tipe -->
        <div>
          <label class="block text-sm font-medium mb-1">Tipe Soal</label>
          <select v-model="tipeSoal" class="w-full px-4 py-2 border rounded-lg">
            <option value="pg">Pilihan Ganda</option>
            <option value="isian">Isian</option>
            <option value="pg_kompleks">PG Kompleks (Benar / Salah)</option>
            <option value="pg_majemuk">PG Majemuk (Lebih dari 1 jawaban benar)</option>
          </select>
        </div>

        <!-- Pertanyaan -->
        <div>
          <label class="block text-sm font-medium mb-1">Pertanyaan</label>
          <ckeditor :editor="editor" v-model="pertanyaan" :config="editorConfig" />
        </div>

        <!-- ISIAN -->
        <div v-if="tipeSoal === 'isian'" class="bg-green-50 border border-green-200 rounded-xl p-4">
          <div class="mb-3">
            <span class="inline-block px-3 py-1 text-xs font-semibold bg-green-600 text-white rounded-full">
              Tipe: Isian Singkat
            </span>
          </div>
          <label class="block text-sm font-medium mb-1">Jawaban</label>
          <input v-model="jawabanIsian" class="w-full px-4 py-2 border rounded-lg" />
        </div>

        <!-- PG and PG Majemuk -->
        <div
          v-if="tipeSoal === 'pg' || tipeSoal === 'pg_majemuk'"
          :class="[
            'rounded-xl p-4 border',
            tipeSoal === 'pg' ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200'
          ]"
        >
          <div class="mb-3">
            <span
              class="inline-block px-3 py-1 text-xs font-semibold text-white rounded-full"
              :class="tipeSoal === 'pg' ? 'bg-blue-600' : 'bg-purple-600'"
            >
              {{ tipeSoal === "pg" ? "Tipe: Pilihan Ganda" : "Tipe: Pilihan Ganda Majemuk" }}
            </span>
          </div>

          <label class="block text-sm font-medium mb-2">
            Opsi Jawaban
            <span v-if="tipeSoal === 'pg_majemuk'" class="text-xs text-indigo-600 ml-2">
              (Bisa lebih dari satu jawaban benar)
            </span>
          </label>

          <div v-for="(opsi, i) in opsiJawaban" :key="i" class="flex gap-2 mb-2">
            <!-- Radio for PG -->
            <template v-if="tipeSoal === 'pg'">
              <input type="radio" :checked="opsi.is_correct" @change="setJawabanBenar(i)" />
            </template>

            <!-- Checkbox for PG Majemuk -->
            <template v-else>
              <input type="checkbox" v-model="opsi.is_correct" />
            </template>

            <div class="flex-1">
              <ckeditor :editor="editor" v-model="opsi.text" :config="editorConfig" />
            </div>

            <button type="button" class="text-red-500 text-xs" @click="hapusOpsi(i)" v-if="opsiJawaban.length > 2">
              Hapus
            </button>

            <input v-model.number="opsi.poin" type="number" class="w-24 px-2 py-2 border rounded-lg" />
          </div>

          <button type="button" class="mt-2 px-4 py-2 border rounded-lg text-sm" @click="tambahOpsi">
            + Tambah Opsi
          </button>
        </div>

        <div v-if="tipeSoal === 'pg_kompleks'" class="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div class="mb-3">
            <span class="inline-block px-3 py-1 text-xs font-semibold bg-orange-600 text-white rounded-full">
              Tipe: PG Kompleks (Benar / Salah)
            </span>
          </div>
          <label class="block text-sm font-medium mb-2">Pernyataan</label>

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
        </div>

        <!-- Pembahasan -->
        <div>
          <label class="block text-sm font-medium mb-1">Pembahasan</label>
          <ckeditor :editor="editor" v-model="pembahasan" :config="editorConfig" />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ loading ? "Menyimpan..." : "Simpan Soal" }}
        </button>
      </form>
      <!-- Success Popup -->
      <div v-if="showSuccessPopup" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">Berhasil</h2>
          <p class="text-sm text-gray-600 mb-4">{{ successMessage }}</p>
          <button
            @click="closeSuccessPopup"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
          >
            OK
          </button>
        </div>
      </div>

      <!-- Error Popup -->
      <div v-if="showErrorPopup" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-lg p-6 w-96 text-center border border-red-200">
          <h2 class="text-lg font-semibold text-red-600 mb-2">Validasi Gagal</h2>
          <p class="text-sm text-gray-600 mb-4">{{ errorMessage }}</p>
          <button
            @click="showErrorPopup = false"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { Ckeditor } from "@ckeditor/ckeditor5-vue"
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  Image,
  ImageToolbar,
  ImageResize,
  ImageUpload
} from "ckeditor5"
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import api from "@/services/api"
import Sidebar from "@/components/layout/Sidebar.vue"

const route = useRoute()
const router = useRouter()
const id = route.params.id

const mapelList = ref([])
const mapelId = ref("")
const tipeSoal = ref("pg")
const pertanyaan = ref("")
const pembahasan = ref("")
const jawabanIsian = ref("")
const opsiJawaban = ref([])
const pernyataanKompleks = ref([
  { text: "", jawaban: true },
  { text: "", jawaban: true },
  { text: "", jawaban: true },
  { text: "", jawaban: true }
])
const loading = ref(false)

const showSuccessPopup = ref(false)
const successMessage = ref("")
const showErrorPopup = ref(false)
const errorMessage = ref("")

const editor = ClassicEditor

const editorConfig = {
  licenseKey: "GPL",
  plugins: [Essentials, Paragraph, Bold, Italic, Underline, Link, List, Image, ImageToolbar, ImageResize, ImageUpload],
  toolbar: [
    "undo",
    "redo",
    "|",
    "bold",
    "italic",
    "underline",
    "|",
    "link",
    "|",
    "bulletedList",
    "numberedList",
    "|",
    "imageUpload"
  ],
  image: {
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
    ],
    toolbar: ["resizeImage:original", "resizeImage:50", "resizeImage:75"]
  }
}

const setJawabanBenar = (index) => {
  opsiJawaban.value.forEach((o, i) => {
    o.is_correct = i === index
  })
}

const tambahOpsi = () => {
  opsiJawaban.value.push({
    text: "",
    poin: 0,
    is_correct: false
  })
}

const hapusOpsi = (index) => {
  const wasCorrect = opsiJawaban.value[index].is_correct
  opsiJawaban.value.splice(index, 1)

  if (wasCorrect && opsiJawaban.value.length > 0) {
    opsiJawaban.value[0].is_correct = true
  }
}

onMounted(async () => {
  // load mapel
  const mapelRes = await api.get("/mapel")
  mapelList.value = mapelRes.data

  // load soal
  const res = await api.get(`/banksoal/${id}`)
  const data = res.data

  mapelId.value = data.mapel_id
  tipeSoal.value = data.tipe
  pertanyaan.value = data.pertanyaan
  pembahasan.value = data.pembahasan

  if (data.tipe === "isian") {
    jawabanIsian.value = data.jawaban
    opsiJawaban.value = []
    pernyataanKompleks.value = []
  } else if (data.tipe === "pg" || data.tipe === "pg_majemuk") {
    opsiJawaban.value = data.opsi_jawaban ?? []
    pernyataanKompleks.value = []
  } else if (data.tipe === "pg_kompleks") {
    pernyataanKompleks.value = data.pernyataan ?? []
    opsiJawaban.value = []
  }
})

const submitEdit = async () => {
  // === VALIDASI ===
  if (!mapelId.value) {
    errorMessage.value = "Mapel wajib dipilih"
    showErrorPopup.value = true
    return
  }

  if (!pertanyaan.value || pertanyaan.value.trim() === "") {
    errorMessage.value = "Pertanyaan tidak boleh kosong"
    showErrorPopup.value = true
    return
  }

  if (tipeSoal.value === "isian") {
    if (!jawabanIsian.value || jawabanIsian.value.trim() === "") {
      errorMessage.value = "Jawaban isian tidak boleh kosong"
      showErrorPopup.value = true
      return
    }
  }

  if (tipeSoal.value === "pg" || tipeSoal.value === "pg_majemuk") {
    if (opsiJawaban.value.length < 2) {
      errorMessage.value = "Minimal harus ada 2 opsi jawaban"
      showErrorPopup.value = true
      return
    }

    const kosong = opsiJawaban.value.some((o) => !o.text || o.text.trim() === "")
    if (kosong) {
      errorMessage.value = "Semua opsi jawaban harus diisi"
      showErrorPopup.value = true
      return
    }

    const jumlahBenar = opsiJawaban.value.filter((o) => o.is_correct).length

    if (tipeSoal.value === "pg" && jumlahBenar !== 1) {
      errorMessage.value = "Pilihan ganda harus memiliki tepat 1 jawaban benar"
      showErrorPopup.value = true
      return
    }

    if (tipeSoal.value === "pg_majemuk" && jumlahBenar < 2) {
      errorMessage.value = "PG Majemuk minimal memiliki 2 jawaban benar"
      showErrorPopup.value = true
      return
    }
  }

  if (tipeSoal.value === "pg_kompleks") {
    if (!pernyataanKompleks.value.length) {
      errorMessage.value = "Minimal harus ada 1 pernyataan"
      showErrorPopup.value = true
      return
    }

    const kosong = pernyataanKompleks.value.some((p) => !p.text || p.text.trim() === "")
    if (kosong) {
      errorMessage.value = "Semua pernyataan harus diisi"
      showErrorPopup.value = true
      return
    }
  }

  // === KIRIM DATA ===
  loading.value = true

  const payload = {
    mapel_id: mapelId.value,
    tipe: tipeSoal.value,
    pertanyaan: pertanyaan.value,
    pembahasan: pembahasan.value,
    jawaban_isian: tipeSoal.value === "isian" ? jawabanIsian.value : null,
    opsi_jawaban: tipeSoal.value === "pg" || tipeSoal.value === "pg_majemuk" ? opsiJawaban.value : [],
    pernyataan: tipeSoal.value === "pg_kompleks" ? pernyataanKompleks.value : []
  }

  const res = await api.put(`/banksoal/${id}`, payload)

  loading.value = false
  successMessage.value = res.data.message || "Soal berhasil diperbarui"
  showSuccessPopup.value = true
}

const closeSuccessPopup = () => {
  showSuccessPopup.value = false
  router.push("/banksoal")
}
</script>
