<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- ================= MAIN ================= -->
      <main class="flex-1">
        <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Kelola Tim Admin</h1>
            <p class="text-sm text-slate-500">Atur role peserta dan admin untuk operasional panel UTBK</p>
          </div>

          <div class="text-right text-sm">
            <p class="font-medium text-slate-800">Admin</p>
            <p class="text-slate-500">Super Administrator</p>
          </div>
        </header>

        <!-- Content -->
        <div class="px-6 py-8">
          <section class="bg-white rounded-xl border p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="font-semibold text-slate-800">Daftar Admin</h3>
              <button
                @click="showAddModal = true"
                class="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700"
              >
                Tambah Admin
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-slate-100">
                  <tr>
                    <th class="px-4 py-3 text-left">Nama</th>
                    <th class="px-4 py-3 text-left">Email</th>
                    <th class="px-4 py-3 text-center">Role</th>
                    <th class="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in admins" :key="user.id" class="border-t">
                    <td class="px-4 py-3 font-medium">{{ user.name }}</td>
                    <td class="px-4 py-3">{{ user.email }}</td>
                    <td class="px-4 py-3 text-center">
                      <span
                        class="px-2 py-1 text-xs rounded"
                        :class="user.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'"
                      >
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <select v-model="user.role" @change="updateRole(user)" class="px-2 py-1 border rounded text-xs">
                        <option value="peserta">Peserta</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <!-- Add Admin Modal -->
        <div v-if="showAddModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div class="bg-white w-[480px] rounded-xl p-6 relative">
            <button @click="closeAddModal" class="absolute top-3 right-3 text-slate-500">✕</button>
            <h2 class="text-lg font-semibold mb-4">Tambah Admin</h2>

            <div class="space-y-3">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari nama atau email (minimal 3 karakter)"
                class="w-full px-4 py-2 border rounded-lg text-sm"
              />

              <div v-if="searchQuery.length < 3" class="text-xs text-slate-500">
                Ketik minimal 3 karakter untuk mencari.
              </div>

              <div v-if="searchLoading" class="text-xs text-slate-500">Mencari...</div>

              <div v-if="searchResults.length" class="max-h-64 overflow-y-auto border rounded-lg">
                <div
                  v-for="result in searchResults"
                  :key="result.id"
                  class="flex items-center justify-between px-4 py-2 hover:bg-orange-50"
                >
                  <div>
                    <div class="text-sm font-medium">{{ result.name }}</div>
                    <div class="text-xs text-slate-600">{{ result.email }}</div>
                  </div>
                  <button
                    @click="addAdmin(result)"
                    class="px-3 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700"
                  >
                    Jadikan Admin
                  </button>
                </div>
              </div>

              <div
                v-if="searchQuery.length >= 3 && !searchLoading && !searchResults.length"
                class="text-xs text-slate-500"
              >
                Tidak ditemukan.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import Sidebar from "../components/layout/Sidebar.vue"
import api from "@/services/api"

const admins = ref([])
const showAddModal = ref(false)
const searchQuery = ref("")
const searchResults = ref([])
const searchLoading = ref(false)
let searchTimeout = null

const fetchAdmins = async () => {
  try {
    const res = await api.get("/users")
    admins.value = (res.data ?? []).filter((u) => u.role === "admin")
  } catch (err) {
    console.error("Gagal mengambil admin:", err)
  }
}

onMounted(() => {
  fetchAdmins()
})

const updateRole = async (user) => {
  await api.put(`/users/${user.id}/role`, { role: user.role })
  if (user.role !== "admin") {
    admins.value = admins.value.filter((u) => u.id !== user.id)
  }
}

const closeAddModal = () => {
  showAddModal.value = false
  searchQuery.value = ""
  searchResults.value = []
  searchLoading.value = false
  if (searchTimeout) clearTimeout(searchTimeout)
}

watch(searchQuery, (val) => {
  searchResults.value = []
  if (val.length < 3) return
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(searchUsers, 250)
})

const searchUsers = async () => {
  const query = searchQuery.value.trim()
  if (query.length < 3) return
  searchLoading.value = true
  try {
    const res = await api.get("/users", { params: { search: query } })
    searchResults.value = (res.data ?? []).filter((u) => u.role !== "admin")
  } catch (err) {
    console.error("Gagal mencari pengguna:", err)
    searchResults.value = []
  } finally {
    searchLoading.value = false
  }
}

const addAdmin = async (user) => {
  try {
    await api.put(`/users/${user.id}/role`, { role: "admin" })
    await fetchAdmins()
    closeAddModal()
  } catch (err) {
    console.error("Gagal menjadikan admin:", err)
  }
}
</script>
