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
            <p class="text-sm text-slate-500">Simulasi Penuh SNBT Batch 01</p>
          </div>

          <div class="flex gap-3">
            <a href="admin-tryout-detail.html" class="px-4 py-2 rounded-lg border text-sm hover:bg-slate-100">
              Preview
            </a>
            <a href="admin-tryout-soal.html" class="px-4 py-2 rounded-lg border text-sm hover:bg-slate-100">
              Kelola Soal
            </a>
          </div>
        </header>

        <!-- CONTENT -->
        <div class="px-6 py-6 w-full">
          <form class="space-y-6">
            <!-- INFORMASI UTAMA -->
            <section class="bg-white rounded-xl border p-6 grid md:grid-cols-2 gap-6">
              <div>
                <label class="text-sm text-slate-500">Nama Batch</label>
                <input type="text" value="Simulasi Penuh SNBT Batch 01" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label class="text-sm text-slate-500">Kategori</label>
                <select class="w-full mt-1 px-4 py-2 border rounded-lg">
                  <option selected>SNBT</option>
                  <option>Simulasi Penuh</option>
                  <option>Drilling Komponen</option>
                  <option>Diagnostik Batch</option>
                </select>
              </div>

              <div>
                <label class="text-sm text-slate-500">Komponen</label>
                <select class="w-full mt-1 px-4 py-2 border rounded-lg">
                  <option selected>Penalaran Matematika</option>
                  <option>TPS</option>
                  <option>Literasi Bahasa Indonesia</option>
                  <option>Literasi Bahasa Inggris</option>
                  <option>Pengetahuan Kuantitatif</option>
                </select>
              </div>

              <div>
                <label class="text-sm text-slate-500">Durasi (menit)</label>
                <input type="number" value="120" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>
            </section>

            <!-- JADWAL -->
            <section class="bg-white rounded-xl border p-6 grid md:grid-cols-2 gap-6">
              <div>
                <label class="text-sm text-slate-500">Tanggal Mulai</label>
                <input type="date" value="2026-01-15" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label class="text-sm text-slate-500">Tanggal Selesai</label>
                <input type="date" value="2026-01-15" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label class="text-sm text-slate-500">Waktu Mulai</label>
                <input type="time" value="08:00" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label class="text-sm text-slate-500">Waktu Selesai</label>
                <input type="time" value="10:00" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>
            </section>

            <!-- PENGATURAN -->
            <section class="bg-white rounded-xl border p-6 grid md:grid-cols-3 gap-6 text-sm">
              <label class="flex items-center gap-3">
                <input type="checkbox" class="w-4 h-4" checked />
                <span>Acak Urutan Soal</span>
              </label>

              <label class="flex items-center gap-3">
                <input type="checkbox" class="w-4 h-4" checked />
                <span>Acak Pilihan Jawaban</span>
              </label>

              <label class="flex items-center gap-3">
                <input type="checkbox" class="w-4 h-4" />
                <span>Tampilkan Pembahasan Setelah Selesai</span>
              </label>
            </section>

            <!-- STATUS -->
            <section class="bg-white rounded-xl border p-6 grid md:grid-cols-2 gap-6">
              <div>
                <label class="text-sm text-slate-500">Status Tryout</label>
                <select class="w-full mt-1 px-4 py-2 border rounded-lg">
                  <option selected>Draft</option>
                  <option>Aktif</option>
                  <option>Selesai</option>
                </select>
              </div>

              <div class="flex items-end">
                <p class="text-xs text-slate-500">*Batch hanya bisa diaktifkan jika paket soal sudah lengkap.</p>
              </div>
            </section>

            <section class="flex gap-4">
              <button
                type="submit"
                class="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-orange-700"
              >
                Simpan Perubahan
              </button>

              <a href="admin-tryout.html" class="px-6 py-3 rounded-lg border hover:bg-slate-100">Batal</a>
            </section>
          </form>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router"

import Sidebar from "../components/layout/Sidebar.vue"
</script>
