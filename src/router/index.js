import { createRouter, createWebHistory } from "vue-router"

import Home from "../pages/Home.vue"
import OAuthCallback from "../pages/autentifikasi/OAuthCallback.vue"

import About from "../pages/About.vue"
import Dashboard from "../pages/Dashboard.vue"
import Peserta from "../pages/Peserta.vue"
import PesertaDetail from "../pages/PesertaDetail.vue"
import BankSoal from "../pages/BankSoal.vue"
import BankSoalTambah from "../pages/BankSoalTambah.vue"
import BankSoalEdit from "../pages/BankSoalEdit.vue"
import BankSoalLihat from "../pages/BankSoalLihat.vue"

import Sekolah from "../pages/Sekolah.vue"
import Sekolahdetail from "../pages/SekolahDetail.vue"

import Tryout from "../pages/Tryout.vue"
import TryoutEdit from "../pages/TryoutEdit.vue"
import TryoutKelola from "../pages/TryoutKelola.vue"

import TryoutDetail from "../pages/TryoutDetail.vue"
import TryoutDetailEdit from "../pages/TryoutDetailEdit.vue"
import TryoutTambah from "../pages/TryoutTambah.vue"

import MonitoringTryout from "../pages/MonitoringTryout.vue"
import MonitoringTryoutDetail from "../pages/MonitoringTryoutDetail.vue"
import MonitoringTryoutHasil from "../pages/MonitoringTryoutHasil.vue"

import Peringkat from "../pages/Peringkat.vue"
import PeringkatDetail from "../pages/PeringkatDetail.vue"
import Persiapan from "../pages/TryoutPersiapan.vue"
import TryoutHasil from "../pages/TryoutHasil.vue"

import KelolaAdmin from "../pages/KelolaAdmin.vue"

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard
  },
  {
    path: "/peserta",
    name: "Peserta",
    component: Peserta
  },
  {
    path: "/peserta/detail/:id",
    name: "PesertaDetail",
    component: PesertaDetail
  },
  {
    path: "/tryout",
    name: "Tryout",
    component: Tryout
  },
  {
    path: "/tryout/edit/:id",
    name: "TryoutEdit",
    component: TryoutEdit
  },
  {
    path: "/tryout/kelola/:id",
    name: "TryoutKelola",
    component: TryoutKelola
  },
  {
    path: "/tryout/detail/:id",
    name: "TryoutDetail",
    component: TryoutDetail
  },
  {
    path: "/tryout/detailedit",
    name: "TryoutDetailEdit",
    component: TryoutDetailEdit
  },
  {
    path: "/tryout/tambah",
    name: "TryoutTambah",
    component: TryoutTambah
  },
  {
    path: "/monitoring-tryout",
    name: "MonitoringTryout",
    component: MonitoringTryout
  },
  {
    path: "/monitoring-tryout/:id",
    name: "MonitoringTryoutDetail",
    component: MonitoringTryoutDetail
  },
  {
    path: "/monitoring-tryout/:tryoutId/hasil/:participantId",
    name: "MonitoringTryoutHasil",
    component: MonitoringTryoutHasil
  },
  {
    path: "/banksoal",
    name: "BankSoal",
    component: BankSoal,
    alias: ["/paket-soal"]
  },
  {
    path: "/banksoal/tambah",
    name: "BankSoalTambah",
    component: BankSoalTambah
  },
  {
    path: "/banksoal/edit/:id",
    name: "BankSoalEdit",
    component: BankSoalEdit
  },
  {
    path: "/banksoal/lihat/:id",
    name: "BankSoalLihat",
    component: BankSoalLihat
  },
  {
    path: "/peringkat",
    name: "Peringkat",
    component: Peringkat,
    alias: ["/leaderboard"]
  },
  {
    path: "/peringkat/:id",
    name: "PeringkatDetail",
    component: PeringkatDetail
  },
  {
    path: "/sekolah",
    name: "Sekolah",
    component: Sekolah
  },
  {
    path: "/sekolah/detail/:id",
    name: "Sekolahdetail",
    component: Sekolahdetail
  },

  {
    path: "/tryout/persiapan",
    name: "Persiapan",
    component: Persiapan
  },
  {
    path: "/tryout/hasil/:id",
    name: "TryoutHasil",
    component: TryoutHasil
  },
  {
    path: "/about",
    name: "About",
    component: About
  },
  {
    path: "/kelolaadmin",
    name: "KelolaAdmin",
    component: KelolaAdmin
  },
  {
    path: "/oauth/callback",
    name: "oauth-callback",
    component: OAuthCallback
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
