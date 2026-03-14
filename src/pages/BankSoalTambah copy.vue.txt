<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar />

      <main class="flex-1">
        <!-- Header -->
        <header class="bg-white border-b px-6 py-4">
          <h1 class="text-lg font-semibold text-slate-800">Tambah Soal</h1>
          <p class="text-sm text-slate-500">Tambahkan soal baru ke bank soal</p>
        </header>

        <!-- Form -->
        <div class="px-6 py-6 w-full">
          <form class="bg-white border rounded-xl p-6 space-y-4 w-full" @submit.prevent="submitSoal">
            <!-- Mapel -->
            <div>
              <label class="block text-sm font-medium mb-1">Mapel</label>
              <select v-model="mapelId" class="w-full px-4 py-2 border rounded-lg text-sm">
                <option value="">Pilih Mapel</option>

                <option v-for="mapel in mapelList" :key="mapel.id" :value="mapel.id">
                  {{ mapel.nama }} ({{ mapel.tingkat }})
                </option>
              </select>
            </div>

            <!-- Tipe -->
            <div>
              <label class="block text-sm font-medium mb-1">Tipe Soal</label>
              <select v-model="tipeSoal" class="w-full px-4 py-2 border rounded-lg text-sm">
                <option value="pg">Pilihan Ganda</option>
                <option value="isian">Isian</option>
                <option value="pg_kompleks">PG Kompleks (Benar / Salah)</option>
              </select>
            </div>

            <!-- Pertanyaan -->
            <div>
              <label class="block text-sm font-medium mb-1">Pertanyaan</label>
              <ckeditor :editor="editor" v-model="pertanyaan" :config="editorConfig" />
            </div>

            <div v-if="tipeSoal === 'isian'">
              <label class="block text-sm font-medium mb-1">Jawaban</label>
              <input
                v-model="jawabanIsian"
                type="text"
                class="w-full px-4 py-2 border rounded-lg text-sm"
                placeholder="Jawaban benar"
              />
            </div>

            <div v-if="tipeSoal === 'pg'">
              <label class="block text-sm font-medium mb-2">Opsi Jawaban</label>

              <div v-for="(opsi, index) in opsiJawaban" :key="index" class="flex gap-2 mb-2">
                <input type="radio" name="jawaban_benar" :checked="opsi.is_correct" @change="setJawabanBenar(index)" />

                <input
                  v-model="opsi.text"
                  type="text"
                  class="flex-1 px-4 py-2 border rounded-lg text-sm"
                  :placeholder="`Opsi ${index + 1}`"
                />

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

            <div v-if="tipeSoal === 'pg_kompleks'">
              <label class="block text-sm font-medium mb-2">Pernyataan</label>

              <div v-for="(item, index) in pernyataanKompleks" :key="index" class="flex items-center gap-3 mb-2">
                <span class="text-sm w-5">{{ index + 1 }}.</span>

                <input
                  v-model="item.text"
                  type="text"
                  class="flex-1 px-4 py-2 border rounded-lg text-sm"
                  placeholder="Tulis pernyataan"
                />

                <select v-model="item.jawaban" class="px-3 py-2 border rounded-lg text-sm">
                  <option :value="true">Benar</option>
                  <option :value="false">Salah</option>
                </select>
              </div>

              <p class="text-xs text-slate-500 mt-2">Skor otomatis: 4 benar = 1 poin, 3 benar = 0.6, 2 benar = 0.2</p>
            </div>

            <!-- Pembahasan -->
            <div>
              <label class="block text-sm font-medium mb-1">Pembahasan</label>
              <ckeditor :editor="editor" v-model="pembahasan" :config="editorConfig" />
            </div>

            <!-- Action -->
            <div class="flex gap-3 pt-4">
              <RouterLink to="/banksoal" class="px-4 py-2 rounded-lg border text-sm">Batal</RouterLink>

              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {{ loading ? "Menyimpan..." : "Simpan Soal" }}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import Sidebar from "@/components/layout/Sidebar.vue"
import { ref, onMounted } from "vue"
// import { ClassicEditor } from "@ckeditor/ckeditor5-build-classic"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import api from "@/services/api"
import { useRouter } from "vue-router"

const editor = ClassicEditor

const editorConfig = {
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "link",
    "bulletedList",
    "numberedList",
    "|",
    "uploadImage",
    "blockQuote",
    "undo",
    "redo"
  ],
  image: {
    toolbar: ["imageTextAlternative", "imageStyle:alignLeft", "imageStyle:alignCenter", "imageStyle:alignRight"]
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
    alert("Mapel wajib dipilih")
    return
  }

  if (!pertanyaan.value.trim()) {
    alert("Pertanyaan wajib diisi")
    return
  }

  // validasi khusus PG
  if (tipeSoal.value === "pg") {
    if (opsiJawaban.value.length < 2) {
      alert("Minimal 2 opsi jawaban")
      return
    }

    const adaBenar = opsiJawaban.value.some((o) => o.is_correct)
    if (!adaBenar) {
      alert("Pilih satu jawaban benar")
      return
    }
  }

  if (tipeSoal.value === "pg_kompleks") {
    const kosong = pernyataanKompleks.value.some((p) => !p.text.trim())
    if (kosong) {
      alert("Semua pernyataan wajib diisi")
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
      opsi_jawaban: tipeSoal.value === "pg" ? opsiJawaban.value : [],
      pernyataan: tipeSoal.value === "pg_kompleks" ? pernyataanKompleks.value : []
    }

    const existing = localStorage.getItem("draft_banksoal")
    const drafts = existing ? JSON.parse(existing) : []
    console.log("Drafts Sebelumnya:", drafts)

    draftSoal.value.push({
      ...payload,
      created_at: new Date().toISOString()
    })

    localStorage.setItem("draft_banksoal", JSON.stringify(draftSoal.value))

    // Kirim draft ke backend
    console.log("Mengirim soal ke API:", payload)
    const res = await api.post("/banksoal", payload)
    console.log("isi res adalah", res)

    if (res.data && res.data.success) {
      alert(res.data.message || "Soal berhasil disimpan")
      router.push("/banksoal") // ⬅️ Vue Router navigation
    } else {
      alert("Soal tersimpan di localStorage, tapi gagal dikirim ke server")
    }
  } catch (err) {
    console.error(err)

    const msg = err.response?.data?.message || "Gagal menyimpan soal"

    alert(err)
  }
}
</script>
