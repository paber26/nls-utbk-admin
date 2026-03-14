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
              <h3 class="font-semibold text-slate-800">Daftar Pengguna</h3>
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
                  <tr v-for="user in users" :key="user.id" class="border-t">
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
      </main>
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted } from "vue"
import Sidebar from "../components/layout/Sidebar.vue"
import api from "@/services/api"

const users = ref([])

onMounted(async () => {
  const res = await api.get("/users")
  users.value = res.data
})

const updateRole = async (user) => {
  await api.put(`/users/${user.id}/role`, {
    role: user.role
  })
}
</script>
