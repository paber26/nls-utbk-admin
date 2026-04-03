<template>
  <div class="bg-[linear-gradient(145deg,#F3F4F4_0%,#dce8eb_45%,#d9e7e8_100%)] font-poppins min-h-screen flex items-center justify-center px-6">
    <div class="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#d9e7e8] p-8 text-center">
      <div class="mb-6">
        <img src="/nls-logo-300.png" alt="Next Level Study" class="w-24 mx-auto mb-4" />
        <p class="text-xs uppercase tracking-[0.3em] text-[#1D546D]/70">Admin Panel</p>
        <h1 class="text-2xl font-bold text-slate-800 mt-2">Login Admin SNBT</h1>
        <p class="text-sm text-slate-500 mt-2">Masuk untuk mengelola batch tryout, paket soal, peserta, dan leaderboard.</p>
      </div>

      <button
        @click="loginWithGoogle"
        class="flex items-center justify-center gap-3 w-full border border-[#d9e7e8] rounded-xl py-3 hover:bg-[#F3F4F4] transition cursor-pointer"
      >
        <svg class="w-5 h-5" viewBox="0 0 48 48">
          <path
            fill="#EA4335"
            d="M24 9.5c3.14 0 5.95 1.08 8.16 2.85l6.09-6.09C34.6 2.66 29.67 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.33 5.69C11.57 13.32 17.29 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.1 24.55c0-1.64-.15-3.21-.42-4.73H24v9.02h12.41c-.54 2.9-2.17 5.36-4.61 7.02l7.06 5.49C43.02 37.14 46.1 31.36 46.1 24.55z"
          />
          <path
            fill="#FBBC05"
            d="M9.89 28.91c-.48-1.44-.76-2.98-.76-4.57s.27-3.13.76-4.57l-7.33-5.69C.93 17.15 0 20.46 0 24.34c0 3.88.93 7.19 2.56 10.26l7.33-5.69z"
          />
          <path
            fill="#34A853"
            d="M24 48c5.67 0 10.6-1.87 14.14-5.09l-7.06-5.49c-1.96 1.32-4.47 2.1-7.08 2.1-6.71 0-12.43-3.82-14.11-9.41l-7.33 5.69C6.51 42.62 14.62 48 24 48z"
          />
        </svg>

        <span class="font-medium text-slate-700">Masuk dengan Google Workspace</span>
      </button>

      <p class="text-xs text-slate-400 mt-6 leading-relaxed">
        Dengan masuk, Anda menyetujui
        <a href="#" class="text-primary hover:underline">Syarat & Ketentuan</a>
        dan
        <a href="#" class="text-primary hover:underline">Kebijakan Privasi</a>
        .
      </p>
    </div>
  </div>
</template>

<script setup>
const loginWithGoogle = () => {
  window.location.href = import.meta.env.VITE_API_URL + "/auth/google"
}
</script>
