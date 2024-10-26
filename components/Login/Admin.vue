<script setup>
import { useAuth } from "~/store/auth";
import { useToast } from "primevue/usetoast";
import useVuelidate from "@vuelidate/core";
import { required, sameAs } from "@vuelidate/validators";
const toast = useToast();
const auth = useAuth();
const router = useRouter();
const { setLogin, set_token, setUser } = auth;
import AuthImg from "~/assets/images/auth-img.png";
definePageMeta({
  layout: "LoginLayout",
});
const restart = inject('restart');

//data
const formValues = reactive({
  full_name: null,
  password: null,
});
let loginPassError = ref(false);

const rules = computed(() => ({
  full_name: {
    required,
  },
  password: {
    required,
  },
}));

const $v = useVuelidate(rules, formValues);
// methods

function signIn() {
  $v.value.$touch();
  const result = $v.value.$validate();
  result.then((res) => {
    if (res) {
      useApi("/v1/user/login", {
        method: "POST",
        body: {
          password: formValues.password,
          username: formValues.full_name,
        }, // Use the modified 'data' object with the formatted phone
      })
        .then((res) => {
          setLogin(true);
          set_token(res.access);
          setUser(res.user);
          router.push("/");
        })
        .catch((e) => {
          if (e.response.status == 401) {
            loginPassError.value = true;
          } else {
            toast.add({
              severity: "error",
              summary: "Xatolik",
              detail: "Login qilishda xatolik",
              life: 3000,
            });
          }
          setLogin(false);
          set_token(null);
          setUser(null);
        });
    }
  });
}



//watch

</script>

<template>
  <div>
    <div class="grid justify-center max-w-md mx-auto">
      <form
        class="bg-white rounded-2xl p-6 relative z-10 shadow-[0_2px_16px_-3px_rgba(6,81,237,0.3)] min-w-[450px]"
      >
        <div class="mb-12">
          <h3
            class="text-3xl font-extrabold text-blue-600"
          >
            Login
          </h3>
        </div>
        <div class="mt-3">
          <!-- <div class="relative flex items-center">
              <input
                name="text"
                type="text"
                required
                v-model="formValues.full_name"
                class="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Ism familiya"
              />
              <Icon
                name="material-symbols:account-circle-full"
                class="wh-18 absolute right-2 text-[#bbb]"
              />
            </div> -->
          <FloatLabel variant="on" class="w-full">
            <InputText
              class="w-full"
              id="full_name"
              :invalid="!!$v.full_name.$errors.length"
              v-model="formValues.full_name"
              @blur="$v.full_name.$touch()"
            />
            <label for="full_name">Ism familiya</label>
          </FloatLabel>
          <div
            v-if="!!$v.full_name.$errors.length"
            class="text-red-500 text-sm mt-1"
          >
            Ism familiya kiritilmagan
          </div>
        </div>
        <div class="mt-3">
          <div class="relative">
            <FloatLabel variant="on" class="w-full">
              <Password
                v-model="formValues.password"
                toggleMask
                inputId="passwordId"
                class="w-full relative text-sm"
                :invalid="loginPassError || !!$v.password.$errors.length"
                :feedback="false"
              />
              <label for="passwordId">Parol</label>
            </FloatLabel>
            <p v-if="loginPassError" class="text-red-500 text-sm mt-1">
              Parolni tekshiring
            </p>
            <div
              v-if="!!$v.password.$errors.length"
              class="text-red-500 text-sm mt-1"
            >
              Parol kiritilmagan
            </div>
          </div>
        </div>

        <div class="mt-12">
          <button
            type="button"
            :disabled="
              !formValues.full_name  ||  !formValues.password
            "
            @click="signIn"
            class="w-full disabled:cursor-not-allowed disabled:opacity-60 py-2.5 px-4 text-sm font-semibold tracking-wider rounded-md text-white bg-[#4964D8] hover:bg-blue-700 focus:outline-none"
          >
           Login
          </button>

          <p class="text-sm text-center mt-3" @click="restart">
            <a
              href="javascript:void(0);"
              class="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
              >go back</a
            >
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
