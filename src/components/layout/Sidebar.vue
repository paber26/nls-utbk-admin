<template>
  <aside class="w-72 bg-sidebar text-slate-200 flex flex-col">
    <div class="px-6 py-5 border-b border-white/10">
      <p class="text-xs uppercase tracking-[0.32em] text-[#9fc1c3]/70">Next Level Study</p>
      <p class="text-lg font-semibold text-white mt-1">Admin SNBT</p>
      <p class="text-xs text-[#9fc1c3]/70 mt-1">Control panel batch tryout SNBT</p>
    </div>

    <div class="px-6 py-4 border-b border-white/10" v-if="user">
      <p class="text-xs text-[#9fc1c3]/70">{{ user.role === "admin" ? "Administrator" : "Operator Panel" }}</p>
      <p class="font-medium text-white">{{ user.name }}</p>
      <p class="text-xs text-[#9fc1c3]/70">
        {{ user.sekolah_nama || "Panel pusat Next Level Study" }}
        <span v-if="user.kelas">• Kelas {{ user.kelas }}</span>
      </p>
    </div>

    <nav class="flex-1 px-3 py-4 space-y-1 text-sm">
      <RouterLink
        to="/"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
        :class="isActive('/') ? 'bg-sideover text-white' : 'hover:bg-sideover text-slate-300'"
      >
        📊
        <span>Dashboard</span>
      </RouterLink>

      <RouterLink
        to="/peserta"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
        :class="isSectionActive('/peserta') ? 'bg-sideover text-white' : 'hover:bg-sideover text-slate-300'"
      >
        👨‍🎓
        <span>Peserta SNBT</span>
      </RouterLink>

      <RouterLink
        to="/tryout"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
        :class="isSectionActive('/tryout') ? 'bg-sideover text-white' : 'hover:bg-sideover text-slate-300'"
      >
        📝
        <span>Batch Tryout</span>
      </RouterLink>

      <RouterLink
        to="/monitoring-tryout"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
        :class="isSectionActive('/monitoring-tryout') ? 'bg-sideover text-white' : 'hover:bg-sideover text-slate-300'"
      >
        📈
        <span>Monitoring & Hasil</span>
      </RouterLink>

      <RouterLink
        to="/banksoal"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
        :class="isSectionActive('/banksoal') ? 'bg-sideover text-white' : 'hover:bg-sideover text-slate-300'"
      >
        📚
        <span>Paket Soal</span>
      </RouterLink>

      <RouterLink
        to="/peringkat"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
        :class="isSectionActive('/peringkat') ? 'bg-sideover text-white' : 'hover:bg-sideover text-slate-300'"
      >
        🏆
        <span>Leaderboard</span>
      </RouterLink>

      <RouterLink
        to="/sekolah"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
        :class="isSectionActive('/sekolah') ? 'bg-sideover text-white' : 'hover:bg-sideover text-slate-300'"
      >
        🏫
        <span>Sekolah</span>
      </RouterLink>

      <RouterLink
        to="/kelolaadmin"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition"
        :class="isSectionActive('/kelolaadmin') ? 'bg-sideover text-white' : 'hover:bg-sideover text-slate-300'"
      >
        🛠️
        <span>Tim Admin</span>
      </RouterLink>
    </nav>

    <div class="px-3 py-4 border-t border-white/10">
      <button
        type="button"
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 transition"
      >
        🚪
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from "vue-router"
import { ref, onMounted } from "vue"

const route = useRoute()

const user = ref(null)

const isActive = (path) => route.path === path
const isSectionActive = (prefix) => route.path.startsWith(prefix)

onMounted(() => {
  const data = localStorage.getItem("dataapi")
  if (data) {
    user.value = JSON.parse(data)
  }
})

const handleLogout = () => {
  localStorage.removeItem("auth_token")
  localStorage.removeItem("dataapi")
  localStorage.removeItem("datalengkap")
  localStorage.removeItem("loggedIn")
  localStorage.removeItem("draft_banksoal")

  window.location.href = "/login"
}
</script>
