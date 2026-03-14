<template>
  <div class="min-h-screen flex items-center justify-center bg-[linear-gradient(145deg,#F3F4F4_0%,#dce8eb_45%,#d9e7e8_100%)] px-6">
    <div class="bg-white shadow-xl rounded-3xl border border-[#d9e7e8] p-10 text-center w-full max-w-md">
      <div class="flex justify-center mb-6">
        <div class="w-12 h-12 border-4 border-[#1D546D] border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h2 class="text-xl font-semibold text-slate-800 mb-2">Sedang Menyiapkan Panel</h2>
      <p class="text-slate-500 text-sm">Mohon tunggu sebentar, akun admin UTBK Anda sedang diverifikasi.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const token = params.get("token")

  if (token) {
    localStorage.setItem("auth_token", token)

    // minimal loading 1 detik agar animasi terlihat
    setTimeout(() => {
      router.replace("/")
    }, 1000)
  } else {
    setTimeout(() => {
      router.replace("/login")
    }, 1000)
  }
})
</script>
