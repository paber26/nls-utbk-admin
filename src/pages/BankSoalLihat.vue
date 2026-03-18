<template>
  <div class="flex min-h-screen bg-bgsoft font-poppins">
    <Sidebar />

    <main class="flex-1 px-6 py-6">
      <h1 class="text-lg font-semibold mb-6">Detail Paket Soal</h1>

      <div class="bg-white border rounded-xl p-6 space-y-6 w-full">
        <div>
          <p class="text-sm text-gray-500">Komponen</p>
          <p class="font-medium">{{ komponenNama }}</p>
        </div>

        <div>
          <p class="text-sm text-gray-500">Tipe Soal</p>
          <p class="font-medium">
            <span v-if="tipeSoal === 'pg'">Pilihan Ganda</span>
            <span v-else-if="tipeSoal === 'isian'">Isian</span>
            <span v-else-if="tipeSoal === 'pg_kompleks'">PG Kompleks</span>
            <span v-else-if="tipeSoal === 'pg_majemuk'">PG Majemuk</span>
          </p>
        </div>

        <div>
          <p class="text-sm text-gray-500 mb-2">Pertanyaan</p>
          <div class="prose max-w-none" v-html="pertanyaan"></div>
        </div>

        <div v-if="tipeSoal === 'isian'">
          <p class="text-sm text-gray-500">Jawaban</p>
          <p class="font-medium">{{ jawabanIsian }}</p>
        </div>

        <div v-if="tipeSoal === 'pg'">
          <p class="text-sm text-gray-500 mb-2">Opsi Jawaban</p>
          <div
            v-for="(opsi, i) in opsiJawaban"
            :key="i"
            class="flex items-start gap-3 p-3 border rounded-lg mb-2"
            :class="opsi.is_correct ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'"
          >
            <span class="font-semibold">{{ String.fromCharCode(65 + i) }}.</span>
            <div class="flex-1" v-html="opsi.text"></div>
            <span class="text-xs text-gray-500">Poin: {{ opsi.poin }}</span>
          </div>
        </div>

        <div v-if="tipeSoal === 'pg_majemuk'">
          <p class="text-sm text-gray-500 mb-2">Opsi Jawaban</p>
          <div
            v-for="(opsi, i) in opsiJawaban"
            :key="i"
            class="flex items-start gap-3 p-3 border rounded-lg mb-2"
            :class="opsi.is_correct ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'"
          >
            <span class="font-semibold">{{ String.fromCharCode(65 + i) }}.</span>
            <div class="flex-1" v-html="opsi.text"></div>
            <div class="flex flex-col items-end">
              <span class="text-xs text-gray-500">Poin: {{ opsi.poin }}</span>
              <span v-if="opsi.is_correct" class="text-xs text-emerald-600 font-medium">Jawaban Benar</span>
            </div>
          </div>
        </div>

        <div v-if="tipeSoal === 'pg_kompleks'">
          <p class="text-sm text-gray-500 mb-2">Pernyataan</p>
          <div
            v-for="(item, index) in pernyataanKompleks"
            :key="index"
            class="flex justify-between items-start p-3 border rounded-lg mb-2"
          >
            <div class="flex gap-2">
              <span class="font-semibold">{{ index + 1 }}.</span>
              <div v-html="item.text"></div>
            </div>
            <span
              class="text-xs px-2 py-1 rounded-full"
              :class="item.jawaban ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'"
            >
              {{ item.jawaban ? "Benar" : "Salah" }}
            </span>
          </div>
        </div>

        <div>
          <p class="text-sm text-gray-500 mb-2">Pembahasan</p>
          <div class="prose max-w-none" v-html="pembahasan"></div>
        </div>

        <div class="pt-4">
          <button
            @click="router.push('/banksoal')"
            class="px-4 py-2 rounded-lg bg-orange-100 text-orange-700 text-sm hover:bg-orange-200"
          >
            Kembali
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import api from "@/services/api"
import Sidebar from "@/components/layout/Sidebar.vue"
import { nextTick } from "vue"
import katex from "katex"
import renderMathInElement from "katex/contrib/auto-render"
import "katex/dist/katex.min.css"

const route = useRoute()
const router = useRouter()
const id = route.params.id

const komponenNama = ref("")
const tipeSoal = ref("")
const pertanyaan = ref("")
const pembahasan = ref("")
const jawabanIsian = ref("")
const opsiJawaban = ref([])
const pernyataanKompleks = ref([])

const renderKatex = () => {
  nextTick(() => {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false }
      ],
      throwOnError: false
    })
  })
}

onMounted(async () => {
  const res = await api.get(`/banksoal/${id}`)
  const data = res.data

  komponenNama.value = data.komponen || data.komponen_nama || "-"
  tipeSoal.value = data.tipe
  pertanyaan.value = data.pertanyaan
  pembahasan.value = data.pembahasan

  if (data.tipe === "isian") {
    jawabanIsian.value = data.jawaban
  } else if (data.tipe === "pg" || data.tipe === "pg_majemuk") {
    opsiJawaban.value = data.opsi_jawaban ?? []
  } else if (data.tipe === "pg_kompleks") {
    pernyataanKompleks.value = data.pernyataan ?? []
  }
  renderKatex()
})
</script>
