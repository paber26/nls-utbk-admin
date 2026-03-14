<template>
  <div class="flex min-h-screen bg-bgsoft font-poppins">
    <Sidebar />

    <main class="flex-1 px-6 py-6">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 class="text-lg font-semibold">Hasil Pengerjaan Peserta</h1>
          <p class="text-sm text-slate-500">Detail jawaban peserta pada batch tryout UTBK</p>
          <p class="text-sm text-slate-700 mt-1">
            Batch:
            <span class="font-semibold">{{ tryoutName || "-" }}</span>
          </p>
        </div>
        <RouterLink
          :to="`/monitoring-tryout/${route.params.tryoutId}`"
          class="px-4 py-2 rounded-lg border bg-white text-sm hover:bg-slate-100"
        >
          Kembali
        </RouterLink>
      </div>

      <section class="bg-white rounded-xl border p-5 mb-6">
        <div v-if="loading" class="text-sm text-slate-500">Memuat data hasil...</div>

        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div class="rounded-lg border p-4 bg-slate-50">
              <p class="text-xs text-slate-500">Nama Peserta</p>
              <p class="font-semibold">{{ participant.name || participant.nama || "-" }}</p>
            </div>
            <div class="rounded-lg border p-4 bg-slate-50">
              <p class="text-xs text-slate-500">Jam Mulai</p>
              <p class="font-semibold">{{ formatDate(startedAt) }}</p>
            </div>
            <div class="rounded-lg border p-4 bg-slate-50">
              <p class="text-xs text-slate-500">Jam Selesai</p>
              <p class="font-semibold">{{ formatDate(endedAt) }}</p>
            </div>
            <div class="rounded-lg border p-4 bg-slate-50">
              <p class="text-xs text-slate-500">Lama Pengerjaan</p>
              <p class="font-semibold">{{ durationText }}</p>
            </div>
          </div>

          <div class="mt-4 rounded-lg border p-4 bg-white">
            <div class="flex flex-wrap items-center gap-2 mb-3 text-xs font-medium">
              <span class="px-2 py-1 rounded bg-emerald-100 text-emerald-700">Benar: {{ totalBenar }}</span>
              <span class="px-2 py-1 rounded bg-red-100 text-red-700">Salah: {{ totalSalah }}</span>
              <span class="px-2 py-1 rounded bg-slate-200 text-slate-700">Tidak Dijawab: {{ totalTidakDijawab }}</span>
            </div>

            <div v-if="nomorBerurutan.length" class="flex flex-wrap gap-2">
              <button
                v-for="item in nomorBerurutan"
                :key="`nomor-${item.nomor}`"
                type="button"
                class="px-2 py-1 text-xs rounded-md text-white"
                :class="item.colorClass"
                :title="item.label"
                @click="scrollToQuestion(item.nomor)"
              >
                {{ item.nomor }}
              </button>
            </div>
            <p v-else class="text-sm text-slate-500">-</p>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-xl border overflow-hidden">
        <div v-if="errorMessage" class="px-4 py-6 text-sm text-red-600">
          {{ errorMessage }}
        </div>

        <div v-else-if="!loading && answersWithDisplay.length === 0" class="px-4 py-6 text-sm text-slate-500">
          Data hasil belum tersedia.
        </div>

        <div v-else class="divide-y">
          <article
            v-for="item in answersWithDisplay"
            :id="`soal-${item.nomor}`"
            :key="item.localKey"
            class="p-5 scroll-mt-6"
          >
            <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 class="font-semibold">Soal {{ item.nomor }}</h2>
              <div class="flex items-center gap-2">
                <span
                  class="text-xs px-2 py-1 rounded font-semibold"
                  :class="
                    item.benar === true
                      ? 'bg-emerald-100 text-emerald-700'
                      : item.benar === false
                        ? 'bg-red-100 text-red-700'
                        : 'bg-slate-100 text-slate-600'
                  "
                >
                  {{ item.benar === true ? "Benar" : item.benar === false ? "Salah" : "Belum dinilai" }}
                </span>
                <span class="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700 font-semibold">
                  +{{ formatPoin(item.poin) }} poin
                </span>
              </div>
            </div>

            <div class="space-y-3 text-sm">
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-wide mb-1">Soal</p>
                <div class="prose prose-sm max-w-none" v-html="asText(item.soal)"></div>
              </div>
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-wide mb-1">Jawaban User</p>
                <div class="rounded-lg border p-3 bg-slate-50">
                  <div class="prose prose-sm max-w-none" v-html="asText(item.jawabanUser)"></div>
                </div>
              </div>
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-wide mb-1">Kunci Jawaban</p>
                <div class="rounded-lg border p-3 bg-emerald-50">
                  <div class="prose prose-sm max-w-none" v-html="asText(item.kunciJawaban)"></div>
                </div>
              </div>
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-wide mb-1">Pembahasan</p>
                <div class="rounded-lg border p-3 bg-amber-50">
                  <div class="prose prose-sm max-w-none" v-html="asText(item.pembahasan)"></div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>

    <button
      type="button"
      class="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-orange-600 text-white shadow-lg hover:bg-orange-700 flex items-center justify-center"
      @click="scrollToTop"
      aria-label="Scroll ke atas"
      title="Ke atas"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M10 3a1 1 0 01.707.293l5 5a1 1 0 11-1.414 1.414L11 6.414V16a1 1 0 11-2 0V6.414L5.707 9.707a1 1 0 01-1.414-1.414l5-5A1 1 0 0110 3z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from "vue"
import { RouterLink, useRoute } from "vue-router"
import api from "@/services/api"
import Sidebar from "@/components/layout/Sidebar.vue"
import katex from "katex"
import renderMathInElement from "katex/contrib/auto-render"
import "katex/dist/katex.min.css"

const route = useRoute()

const loading = ref(true)
const errorMessage = ref("")
const participant = ref({})
const answers = ref([])
const startedAt = ref("")
const endedAt = ref("")
const tryoutName = ref("")

const endpoint = computed(
  () => `/monitoring-tryout/${route.params.tryoutId}/peserta/${route.params.participantId}/hasil`
)

const toNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const asText = (value) => {
  if (value === undefined || value === null || value === "") return "-"
  return String(value)
}

const formatPoin = (value) => {
  if (Number.isInteger(value)) return value
  return value.toFixed(2).replace(/\.00$/, "")
}

const formatDate = (datetime) => {
  if (!datetime) return "-"
  const date = new Date(datetime)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

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

const durationText = computed(() => {
  if (!startedAt.value) return "-"
  const start = new Date(startedAt.value)
  const end = endedAt.value ? new Date(endedAt.value) : new Date()
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "-"

  const totalMinutes = Math.floor(Math.max(0, end - start) / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return hours > 0 ? `${hours}j ${minutes}m` : `${minutes}m`
})

const normalizeOptions = (item) => {
  const rawOptions = item?.opsi_jawaban ?? item?.opsi ?? item?.options ?? item?.choices ?? []
  if (!Array.isArray(rawOptions)) return []

  return rawOptions.map((opt, index) => ({
    key: String(opt?.kode ?? opt?.label ?? opt?.huruf ?? opt?.key ?? opt?.id ?? index + 1).trim(),
    text: String(opt?.text ?? opt?.opsi ?? opt?.jawaban ?? opt?.label_text ?? "").trim()
  }))
}

const parseAnswerValue = (value) => {
  if (Array.isArray(value)) return value
  if (value === null || value === undefined) return []

  const raw = String(value).trim()
  if (!raw) return []

  if (raw.startsWith("[") && raw.endsWith("]")) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    } catch {
      // ignore JSON parse failure and continue with text parsing
    }
  }

  if (raw.includes(",")) {
    return raw
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
  }

  return [raw]
}

const mapAnswerToOptionText = (value, options) => {
  const values = parseAnswerValue(value)
  if (!values.length) return null

  const optionMap = new Map(options.map((opt) => [opt.key.toLowerCase(), opt]))
  const mapped = values.map((val) => {
    const key = String(val).trim().toLowerCase()
    const found = optionMap.get(key)
    if (!found) return null
    if (found.text) return `${found.key}. ${found.text}`
    return found.key
  })

  if (mapped.every(Boolean)) {
    return mapped.join("<br>")
  }

  return null
}

const normalizeAnswer = (item, index) => ({
  opsiJawaban: normalizeOptions(item),
  localKey: `${item?.id ?? "ans"}-${index}`,
  nomor: item?.nomor ?? item?.no ?? item?.number ?? item?.soal_no ?? index + 1,
  soal: item?.soal ?? item?.question ?? item?.pertanyaan ?? "-",
  jawabanUserRaw: item?.jawaban_user ?? item?.user_answer ?? item?.jawaban ?? item?.answer ?? null,
  kunciJawabanRaw: item?.kunci_jawaban ?? item?.answer_key ?? item?.correct_answer ?? item?.kunci ?? "-",
  benar:
    typeof item?.is_correct === "boolean"
      ? item.is_correct
      : typeof item?.benar === "boolean"
        ? item.benar
        : typeof item?.correct === "boolean"
          ? item.correct
          : null,
  pembahasan: item?.pembahasan ?? item?.explanation ?? "-",
  poin: toNumber(item?.poin_diperoleh ?? item?.points_earned ?? item?.poin ?? item?.point),
  isAnswered:
    typeof item?.is_answered === "boolean"
      ? item.is_answered
      : typeof item?.dijawab === "boolean"
        ? item.dijawab
        : Boolean(String(item?.jawaban_user ?? item?.user_answer ?? item?.jawaban ?? item?.answer ?? "").trim())
})

const answersWithDisplay = computed(() =>
  answers.value.map((item) => {
    const userFromOptions = mapAnswerToOptionText(item.jawabanUserRaw, item.opsiJawaban)
    const keyFromOptions = mapAnswerToOptionText(item.kunciJawabanRaw, item.opsiJawaban)
    return {
      ...item,
      jawabanUser: userFromOptions ?? item.jawabanUserRaw,
      kunciJawaban: keyFromOptions ?? item.kunciJawabanRaw
    }
  })
)

const nomorBenar = computed(() =>
  answersWithDisplay.value.filter((item) => item.benar === true).map((item) => item.nomor)
)
const nomorSalah = computed(() =>
  answersWithDisplay.value.filter((item) => item.benar === false).map((item) => item.nomor)
)
const nomorTidakDijawab = computed(() =>
  answersWithDisplay.value
    .filter((item) => item.isAnswered === false || item.jawabanUserRaw === null)
    .map((item) => item.nomor)
)

const totalBenar = computed(() => nomorBenar.value.length)
const totalSalah = computed(() => nomorSalah.value.length)
const totalTidakDijawab = computed(() => nomorTidakDijawab.value.length)
const nomorBerurutan = computed(() => {
  return [...answersWithDisplay.value]
    .sort((a, b) => Number(a.nomor) - Number(b.nomor))
    .map((item) => {
      const tidakDijawab = item.isAnswered === false || item.jawabanUserRaw === null
      if (tidakDijawab) {
        return { nomor: item.nomor, label: "Tidak Dijawab", colorClass: "bg-slate-700 hover:bg-slate-800" }
      }
      if (item.benar === true) {
        return { nomor: item.nomor, label: "Benar", colorClass: "bg-emerald-600 hover:bg-emerald-700" }
      }
      if (item.benar === false) {
        return { nomor: item.nomor, label: "Salah", colorClass: "bg-red-600 hover:bg-red-700" }
      }
      return { nomor: item.nomor, label: "Belum Dinilai", colorClass: "bg-slate-500 hover:bg-slate-600" }
    })
})

const scrollToQuestion = (nomor) => {
  const target = document.getElementById(`soal-${nomor}`)
  if (!target) return
  target.scrollIntoView({ behavior: "smooth", block: "start" })
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

const mapPayload = (payload) => {
  const data = payload?.data ?? payload ?? {}
  participant.value = data.participant ?? data.peserta ?? data.user ?? {}
  tryoutName.value =
    data?.tryout?.paket ??
    data?.tryout?.nama ??
    data?.tryout_nama ??
    participant.value?.tryout_nama ??
    participant.value?.nama_tryout ??
    ""
  startedAt.value = participant.value.mulai ?? participant.value.started_at ?? data.mulai ?? data.started_at ?? ""
  endedAt.value = participant.value.selesai ?? participant.value.ended_at ?? data.selesai ?? data.ended_at ?? ""

  const rawAnswers = data.answers ?? data.jawaban ?? data.items ?? data.detail ?? data.results ?? []
  answers.value = (Array.isArray(rawAnswers) ? rawAnswers : []).map(normalizeAnswer)
}

const fetchResult = async () => {
  try {
    const res = await api.get(endpoint.value)
    mapPayload(res.data)
    renderKatex()
  } catch (error) {
    console.error("Gagal mengambil hasil pengerjaan user:", error)
    errorMessage.value = "Data hasil belum tersedia atau endpoint hasil belum terhubung."
  }
}

onMounted(async () => {
  await fetchResult()
  loading.value = false
})
</script>
