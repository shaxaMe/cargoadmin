<template>
  <div>
    <nav class="w-full relative bg-white px-5 py-6 flex justify-between">
      <div
        class="max-w-[350px] relative w-full flex items-center justify-start"
      >
        <Icon name="ic:twotone-search" class="absolute left-3 text-black" />
        <InputText
          class="w-full bg-[#D5D5D5] !pl-8 text-black"
          type="text"
          size="small"
          v-model="value"
          placeholder="Search..."
        />
      </div>
      <div class="flex items-center gap-8">
        <div class="relative cursor-pointer">
          <div
            class="bg-[#F93C65] p-1 text-white text-sm text-center flex justify-center items-center rounded-full w-4 h-4 absolute -right-1 -top-2"
          >
            6
          </div>
          <svg
            width="24"
            height="26"
            viewBox="0 0 24 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.0277 0C7.73472 0 5.80843 1.72411 5.55522 4.00306L4.5 13.5H1.5C0.671573 13.5 0 14.1716 0 15V16.5C0 17.3284 0.671573 18 1.5 18H22.5C23.3284 18 24 17.3284 24 16.5V15C24 14.1716 23.3284 13.5 22.5 13.5H19.5L18.4448 4.00306C18.1916 1.72411 16.2653 0 13.9723 0H10.0277Z"
              fill="#4880FF"
            />
            <rect
              opacity="0.3"
              x="9"
              y="19.5"
              width="6"
              height="6"
              rx="2.25"
              fill="#FF0000"
            />
          </svg>
        </div>
        <div>
          <div class="card flex justify-content-center">
            <Dropdown
              v-model="selectedCountry"
              :options="countries"
              optionLabel="name"
              placeholder="Select a Country"
              class="w-full md:w-14rem h-[35px] text-sm"
              size="small"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center">
                  <img
                    :alt="slotProps.value.label"
                    src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                    :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`"
                    style="width: 18px"
                  />
                  <div>{{ slotProps.value.name }}</div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="flex align-items-center">
                  <img
                    :alt="slotProps.option.label"
                    src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                    :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`"
                    style="width: 18px"
                  />
                  <div>{{ slotProps.option.name }}</div>
                </div>
              </template>
            </Dropdown>
          </div>
        </div>
        <div class="flex items-center">
          <!-- <Avatar :label="`${user?.full_name?.substr(0,1)}`" class="mr-2" size="medium" shape="circle" />
          <div>
            <p class="text-sm">{{ user.full_name }}</p>
            <p class="text-xs">{{ user.role }}</p>
          </div> -->

          <div
            id="dropdownDefaultButton"
            class="flex items-center gap-2 cursor-pointer px-3 py-2"
            data-dropdown-toggle="dropdown"
          >
            <div class="overflow-hidden rounded-full">
              <!-- <img
                class="w-full h-full object-cover"
                src="https://wallpapercave.com/wp/wp6115931.jpg"
                alt=""
              /> -->
              <Avatar :label="`${user?.full_name?.substr(0,1)}`" size="medium" shape="circle" />
            </div>
            <p>{{ user?.full_name }}</p>
            <Icon name="ic:baseline-keyboard-arrow-down" size="18px" />
          </div>

          <!-- Dropdown menu -->
          <div
            id="dropdown"
            class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
          >
            <ul
              class="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownDefaultButton"
            >
              <li>
                <a
                  href="#"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >Dashboard</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >Settings</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >Earnings</a
                >
              </li>
              <li @click="signOut">
                <a
                  class="cursor-pointer group relative w-full gap-3 flex justify-start"
                >
                  <div
                    class="flex items-center gap-2 trans-custom text-red-500 text-base rounded-xl px-4 py-2"
                  >
                    <Icon size="18px" name="circum:logout" />
                    <span> Log out </span>
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
import { useAuth } from "~/store/auth";
const router = useRouter();
const { user,logout } = useAuth();
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

function signOut() {
  logout();
  router.push("/login");
}
</script>

<style lang="scss" scoped></style>
