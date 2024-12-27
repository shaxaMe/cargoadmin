<template>
   <div class="w-full">
    <nav
      class="w-full bg-white px-6 py-1 flex justify-end max-md:items-center max-md:justify-end  min-h-10"
    >
      <div class="flex items-center gap-5 max-lg:gap-4">
        <div class="flex items-center">
          <button
            id="dropdownLocaleButton"
            data-dropdown-auto-close="true"
            data-dropdown-toggle="dropdownLocale"
            class="relative inline-flex items-center text-sm font-medium text-center focus:outline-none dark:hover:text-white dark:text-gray-400"
            type="button"
          >
          <div class="w-8 h-6 rounded-md overflow-hidden">
            <img  :src="currentLocale" class="w-full h-full object-cover" alt="locale">
          </div>
          </button>

          <!-- Dropdown menu -->
          <div
            id="dropdownLocale"
            class="z-20 hidden w-fit py-2 bg-white rounded-lg dropdown-locale"
            aria-labelledby="dropdownLocaleButton"
          >
          <div @click="setLocal('ru')" class="flex items-center justify-start gap-2 cursor-pointer hover:bg-gray-200 trans-custom py-1 px-2 "> 
           <div  class="w-8 h-6 rounded-md overflow-hidden">
            <img class="w-full h-full object-cover" src="../assets/images/flags/ru.png" alt="">
           </div>
            <span>Russian</span>
          </div>
          <div @click="setLocal('uz')" class="flex items-center my-3 justify-start gap-2 cursor-pointer hover:bg-gray-200 trans-custom py-1 px-2 "> 
            <div class="w-8 h-6 rounded-md overflow-hidden">
              <img  class="w-full h-full object-cover" src="../assets/images/flags/uz.png" alt="">
            </div>
            <span>Uzbek</span>
          </div>
          <div @click="setLocal('en')" class="flex items-center justify-start gap-2 cursor-pointer hover:bg-gray-200 trans-custom py-1 px-2 "> 
            <div class="w-8 h-6 rounded-md overflow-hidden">
              <img  class="w-full h-full object-cover" src="../assets/images/flags/en.png" alt="">
            </div>
            <span>English</span>
          </div>
          </div>
        </div>
        <div class="flex items-center">
          <!-- <Avatar :label="`${user?.full_name?.substr(0,1)}`" class="mr-2" size="medium" shape="circle" />
          <div>
            <p class="text-sm">{{ user.full_name }}</p>
            <p class="text-xs">{{ user.role }}</p>
          </div> -->

          <!-- <div
            id="dropdownDefaultButton"
            class="flex items-center gap-2 cursor-pointer px-3 py-2"
            data-dropdown-toggle="dropdown"
          >
            <div class="overflow-hidden rounded-full h-[32px]">
              <Avatar
                :image="user.photo ? user.photo : emptyProfile"
                size="medium"
                shape="circle"
              />
            </div>
            <div class="flex justify-center items-center flex-col">
              <p class="max-md:text-sm">{{ user?.full_name }}</p>
            </div>
            <Icon name="ic:baseline-keyboard-arrow-down" size="18px" />
          </div> -->

          <!-- Dropdown menu -->
          <div
            id="dropdown"
            class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 custom-dropdown"
          >
            <ul
              class="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownDefaultButton"
            >
              <li @click="_hide">
                <nuxt-link
                  to="/profile"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >Profil</nuxt-link
                >
              </li>
              <!-- <li>
                <a
                  href="#"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >Settings</a
                >
              </li> -->
              <!-- <li>
                <a
                  href="#"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >Earnings</a
                >
              </li> -->
              <li @click="signOut">
                <a
                  class="cursor-pointer group relative w-full gap-3 flex justify-start"
                >
                  <div
                    class="flex items-center gap-2 trans-custom text-red-500 text-base rounded-xl px-4 py-2"
                  >
                    <Icon size="18px" name="circum:logout" />
                    <span> Chiqish </span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { initFlowbite } from 'flowbite'
import emptyProfile from "../assets/images/profile.svg";
import Uz from "../assets/images/flags/uz.png"
import Ru from "../assets/images/flags/ru.png"
import En from "../assets/images/flags/en.png"
import { useAuth } from "~/store/auth";
import { Dropdown } from "flowbite";
const toggleNav = useState("toggleNav", () => false);
const {locale,setLocale} = useI18n()
const router = useRouter();
const auth = useAuth();
const { logout,setLocaleStore } = useAuth();
const { user } = storeToRefs(auth);
const value = ref("");
const selectedCountry = ref();
const countries = ref([
  { name: "Australia", code: "AU" },
  { name: "Brazil", code: "BR" },
  { name: "China", code: "CN" },
  { name: "Egypt", code: "EG" },
  { name: "France", code: "FR" },
  { name: "Germany", code: "DE" },
  { name: "India", code: "IN" },
  { name: "Japan", code: "JP" },
  { name: "Spain", code: "ES" },
  { name: "United States", code: "US" },
]);
const currentLocale = computed(()=>{
  return locale.value == "uz" ? Uz : locale.value == "ru"? Ru : En;
})
function _hide() {
  const targetEl = document.querySelector(".custom-dropdown");
  targetEl.classList.remove("block");
  targetEl.classList.add("hidden");
}
function _hidLocale() {
  const targetEl = document.querySelector(".dropdown-locale");
  targetEl.classList.remove("block");
  targetEl.classList.add("hidden");
}
function signOut() {
  logout();
  router.push("/login");
}

function setLocal(lang){
  setLocale(lang);
  setLocaleStore(lang);
  _hidLocale();
}
// initialize components based on data attribute selectors
onMounted(() => {
    initFlowbite();
})
</script>

<style lang="scss" scoped></style>
