<template>
  <div class="flex min-h-screen bg-bgsoft font-poppins">
    <Sidebar />

    <main class="flex-1 px-6 py-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-lg font-semibold">Detail Paket Soal</h1>
        <button
          @click="router.push(`/banksoal/edit/${id}`)"
          class="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 shadow-sm transition flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
          </svg>
          Edit Soal
        </button>
      </div>

      <div class="bg-white border rounded-xl p-6 space-y-6 w-full shadow-sm">
        <div>
          <p class="text-sm text-gray-500 mb-1">Komponen</p>
          <p class="font-medium px-3 py-1 bg-slate-50 border rounded-md inline-block">{{ komponenNama }}</p>
        </div>

        <div>
          <p class="text-sm text-gray-500 mb-1">Tipe Soal</p>
          <div class="font-medium inline-block rounded-md px-3 py-1 text-sm border bg-slate-50">
            <span v-if="tipeSoal === 'pg'" class="text-amber-600 font-semibold">Pilihan Ganda</span>
            <span v-else-if="tipeSoal === 'isian'" class="text-emerald-600 font-semibold">Isian Singkat</span>
            <span v-else-if="tipeSoal === 'pg_kompleks'" class="text-orange-600 font-semibold">PG Kompleks</span>
            <span v-else-if="tipeSoal === 'pg_majemuk'" class="text-blue-600 font-semibold">PG Majemuk</span>
          </div>
        </div>

        <div>
          <p class="text-sm text-gray-500 mb-2">Pertanyaan</p>
          <div class="prose max-w-none bg-slate-50 p-4 rounded-lg border" v-html="pertanyaan"></div>
        </div>

        <div v-if="tipeSoal === 'isian'">
          <p class="text-sm text-gray-500 mb-2">Jawaban</p>
          <p class="font-medium px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg inline-block">{{ jawabanIsian }}</p>
        </div>

        <div v-if="tipeSoal === 'pg'">
          <p class="text-sm text-gray-500 mb-2">Opsi Jawaban</p>
          <div
            v-for="(opsi, i) in opsiJawaban"
            :key="i"
            class="flex items-start gap-3 p-4 border rounded-xl mb-3"
            :class="opsi.is_correct ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-white'"
          >
            <div class="w-8 h-8 flex items-center justify-center rounded-full font-semibold text-sm border" :class="opsi.is_correct ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-100 text-slate-600 border-slate-200'">{{ String.fromCharCode(65 + i) }}</div>
            <div class="flex-1 prose prose-sm max-w-none text-slate-800" :class="opsi.is_correct ? 'text-emerald-900 font-medium' : ''" v-html="opsi.text"></div>
            <div class="flex flex-col items-end gap-1">
               <span v-if="opsi.is_correct" class="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wide">Benar</span>
               <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium border">{{ opsi.poin }} poin</span>
            </div>
          </div>
        </div>

        <div v-if="tipeSoal === 'pg_majemuk'">
          <p class="text-sm text-gray-500 mb-2">Opsi Jawaban</p>
          <div
            v-for="(opsi, i) in opsiJawaban"
            :key="i"
            class="flex items-start gap-3 p-4 border rounded-xl mb-3"
            :class="opsi.is_correct ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-white'"
          >
            <div class="w-8 h-8 flex items-center justify-center rounded-full font-semibold text-sm border" :class="opsi.is_correct ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-100 text-slate-600 border-slate-200'">{{ String.fromCharCode(65 + i) }}</div>
            <div class="flex-1 prose prose-sm max-w-none text-slate-800" :class="opsi.is_correct ? 'text-emerald-900 font-medium' : ''" v-html="opsi.text"></div>
            <div class="flex flex-col items-end gap-1">
               <span v-if="opsi.is_correct" class="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wide">Benar</span>
               <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium border">{{ opsi.poin }} poin</span>
            </div>
          </div>
        </div>

        <div v-if="tipeSoal === 'pg_kompleks'">
          <p class="text-sm text-gray-500 mb-2">Pernyataan</p>
          <div
            v-for="(item, index) in pernyataanKompleks"
            :key="index"
            class="flex items-start gap-3 p-4 border rounded-xl mb-3 bg-white"
          >
            <span class="font-semibold text-slate-500">{{ index + 1 }}.</span>
            <div class="flex-1 prose prose-sm max-w-none text-slate-800" v-html="item.text"></div>
            <span
              class="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide"
              :class="item.jawaban ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
            >
              {{ item.jawaban ? "Benar" : "Salah" }}
            </span>
          </div>
        </div>

        <div v-if="pembahasan">
          <p class="text-sm text-gray-500 mb-2">Pembahasan</p>
          <div class="prose max-w-none bg-blue-50/50 p-4 rounded-lg border border-blue-100" v-html="pembahasan"></div>
        </div>

        <div class="pt-6 border-t flex gap-3">
          <button
            @click="router.push('/banksoal')"
            class="px-5 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm hover:bg-slate-200 font-medium transition"
          >
            ← Kembali
          </button>
          <button
            @click="router.push(`/banksoal/edit/${id}`)"
            class="px-5 py-2 rounded-lg bg-orange-600 text-white text-sm hover:bg-orange-700 font-medium transition shadow-sm"
          >
            Edit Soal
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
