<script setup>
import { useAuth } from "~/store/auth";
import { useToast } from "primevue/usetoast";
import useVuelidate from "@vuelidate/core";
import { required, sameAs } from "@vuelidate/validators";
const toast = useToast();
const { t } = useI18n();
const auth = useAuth();
const router = useRouter();
const { setLogin, set_token, setUser,setRefreshToken } = auth;
definePageMeta({
  layout: "LoginLayout",
});

//data
const type = ref("");
const formValues = reactive({
  secret_code: null,
  full_name: null,
  phone: null,
  password: null,
  repeat_password: null,
  role: null,
});
let loginPassError = ref(false);
const cities = ref([
  { name: "DRIVER", code: "DRIVER" },
  { name: "USER", code: "USER" },
  { name: "OPERATOR", code: "OPERATOR" },
]);

const rules = computed(() => ({
  full_name: type.value == "new" ? { required } : {},
  password: {
    required,
    skipIfEmpty: true,
  },
  repeat_password: type.value == "new" ? { required } : {},
  role: type.value == "new" ? { required } : {},
}));

const $v = useVuelidate(rules, formValues);
// methods
function format(payload) {
  let str = formatNum(formValues.phone);
  return payload ? str.substr(1) : payload;
}
function _focus() {
  if (!formValues.phone) {
    formValues.phone = "+998 ";
  }
}
const restart = ()=>{
  type.value = "";
  formValues.phone = "+998 ";
}

function signIn() {
  let phone = formValues.phone
    ? formatNum(formValues.phone, " ").substr(1)
    : "";
  $v.value.$touch();
  const result = $v.value.$validate();
  result.then((res) => {
    if (res) {
      if (type.value == "new") {
    
        useApi("/v1/sms/phone/register", {
              method: "POST",
              body: {
                phone: phone,
              },
            }).then((res) => {
              formValues.secret_key = res.secret_key;
              type.value = "sms";
            });
        setTimeout(() => {
          const inputs = document.querySelectorAll(
            ".p-inputotp.p-component input"
          );
          inputs.forEach((input) => {
            input.setAttribute("type", "tel");
            input.addEventListener("keyup", (evt) => {
              if (evt.code === "Enter" && formValues.secret_code.length === 6) {
                loggin();
              }
            });
          }, 200);
        });
      } else {
        useApi("/v1/user/login", {
          method: "POST",
          body: {
            password: formValues.password,
            username: phone,
          }, // Use the modified 'data' object with the formatted phone
        })
          .then((res) => {
            set_token(res.access);
            setRefreshToken(res.refresh);
            setUser(res.user);
            setLogin(true);
            router.push("/");
          })
          .catch((e) => {
              if(e && e.response.status == 401) {
                loginPassError.value = true;
                toast.add({
                severity: "error",
                summary: "Xatolik",
                detail: "Login qilishda xatolik",
                life: 3000,
              });
            setLogin(false);
            set_token(null);
            setUser(null);
              }
          });
      }
    }
  });
}

function loggin() {
  let phone = formValues.phone
    ? formatNum(formValues.phone, " ").substr(1)
    : "";
  if (
    type.value == "sms" &&
    formValues.secret_code &&
    formValues.secret_code.length == 6
  ) {
    let data = { ...formValues }; // Copy the form values to avoid mutating the original object
    delete data.phone; // Remove the original phone
    delete data.role;
    data.role = formValues.role.code;
    data.phone = phone; // Set the formatted phone number

    useApi("/v1/sms/phone/register/verify", {
      method: "POST",
      body: { phone: phone, ...data }, // Use the modified 'data' object with the formatted phone
    })
      .then((res) => {
        set_token(res.access);
        setRefreshToken(res.refresh);
        setUser(res.user);
        setLogin(true);
        router.push("/");
      })
      .catch((e) => {
        setLogin(false);
        set_token(null);
        setUser(null);
      });
  }
}

function setAuthentication() {
  if (type != "sms") {
    signIn();
  } else {
    loggin();
  }
}

//watch

watch(
  () => formValues.phone,
  (newVal) => {
    let str = formatNum(newVal, " ").substr(1);
    if (str && str.length >= 12 && !type.value) {
      useApi("/v1/user/phone", {
        method: "POST",
        body: {
          phone: str,
        },
      })
        .then((res) => {
          if (res.is_has) {
            type.value = "login";
          } else {
            type.value = "new";
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      type.value = null;
    }
  }
);
</script>

<template>
  <div>
    <form class="w-full">
      <div class="mb-12">
        <h3
          class="text-3xl font-extrabold text-blue-600"
          v-if="!type || type == 'login'"
        >
          Login
        </h3>
        <h3 class="text-3xl font-extrabold text-blue-600" v-if="type == 'new'">
          {{ t("login.sign_up") }}
        </h3>
      </div>

      <div class="relative flex items-center">
        <!-- <input
              @focus="_focus"
              name="email"
              type="text"
              v-model="formValues.phone"
              v-mask="'+998 ## ### ## ##'"
              required
              class="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
              placeholder="Telefon raqam"
            />
            <Icon
              name="material-symbols:call"
              class="w-[18px] h-[18px] absolute right-2 text-[#bbb]"
            /> -->
        <FloatLabel variant="on" class="w-full">
          <InputText
            type="tel"
            class="w-full"
            @focus="_focus"
            v-mask="'+998 ## ### ## ##'"
            id="phone_num"
            pattern="[0-9]*"
            v-model="formValues.phone"
          />
          <label for="phone_num">{{ t("login.phone") }}</label>
        </FloatLabel>
      </div>
      <div class="mt-3" v-if="type == 'sms'">
        <div class="relative flex items-start flex-col gap-1">
          <!-- <input
                name="text"
                type="number"
                required
                v-model="formValues.secret_code"
                class="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Tasdiqlash kodi"
              />
              <Icon
                name="fa6-solid:comment-sms"
                class="wh-18 absolute right-2 text-[#bbb]"
              /> -->
          <div class="text-[#bbb] text-sm">{{ t("login.otp") }}</div>
          <InputOtp
            v-model="formValues.secret_code"
            integerOnly
            :invalid="
              !formValues.secret_code ||
              (formValues.secret_code && formValues.secret_code.length < 6)
            "
            :length="6"
          />
        </div>
      </div>
      <div class="mt-3" v-if="type == 'new'">
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
          <label for="full_name">{{ t("login.full_name") }}</label>
        </FloatLabel>
        <div
          v-if="!!$v.full_name.$errors.length"
          class="text-red-500 text-sm mt-1"
        >
          {{ t("login_valid.full_name") }}
        </div>
      </div>
      <div class="mt-3" v-if="type == 'new'">
        <div class="relative">
          <FloatLabel variant="on" class="w-full">
            <Select
              v-model="formValues.role"
              :options="cities"
              inputId="roleId"
              :invalid="!!$v.role.$errors.length"
              optionLabel="name"
              class="w-full text-sm"
            />
            <label for="roleId">{{ t("login.user_role") }}</label>
          </FloatLabel>
          <div
            v-if="!!$v.role.$errors.length"
            class="text-red-500 text-sm mt-1"
          >
            {{ t("login_valid.user_role") }}
          </div>
        </div>
      </div>
      <div class="mt-3" v-if="!!type && type != 'sms'">
        <div class="relative">
          <FloatLabel variant="on" class="w-full">
            <Password
              v-model="formValues.password"
              toggleMask
              @keyup.enter.native="setAuthentication"
              inputId="passwordId"
              class="w-full relative text-sm"
              :invalid="loginPassError || !!$v.password.$errors.length"
              :feedback="false"
            />
            <label for="passwordId">{{ t("login.password") }}</label>
          </FloatLabel>
          <p v-if="loginPassError" class="text-red-500 text-sm mt-1">
            {{ t("login_valid.check_password") }}
          </p>
          <div
            v-if="!!$v.password.$errors.length"
            class="text-red-500 text-sm mt-1"
          >
            {{ t("login_valid.password") }}
          </div>
        </div>
      </div>
      <div class="mt-3" v-if="type == 'new'">
        <div class="relative">
          <FloatLabel variant="on" class="w-full">
            <Password
              v-model="formValues.repeat_password"
              toggleMask
              @keyup.enter.native="signIn"
              inputId="rePassword"
              class="w-full relative text-sm"
              :invalid="
                !!$v.repeat_password.$errors.length ||
                formValues.password !== formValues.repeat_password
              "
              :feedback="false"
            />
            <label for="rePassword">{{ t("login.re_password") }}</label>
          </FloatLabel>
          <div
            v-if="!!$v.password.$errors.length"
            class="text-red-500 text-sm mt-1"
          >
            {{ t("login_valid.re_password") }}
          </div>
          <div
            v-if="formValues.password !== formValues.repeat_password"
            class="text-red-500 text-sm mt-1"
          >
            {{ t("login_valid.incorrect_password") }}
          </div>
          <!-- <div class="text-red-500 text-xs self-start">Parolda o'xshashlik mavjud emas</div> :invalid="!value" variant="filled" -->
        </div>
      </div>

      <div class="mt-12">
        <button
          type="button"
          v-if="type != 'sms'"
          :disabled="
            formValues?.phone?.length < 11 || (!type && !formValues.password)
          "
          @click="signIn"
          class="w-full disabled:cursor-not-allowed disabled:opacity-60 py-2.5 px-4 text-sm font-semibold tracking-wider rounded-md text-white bg-[#4964D8] hover:bg-blue-700 focus:outline-none"
        >
          {{ t('login.sign') }}
        </button>
        <button
          v-else
          type="button"
          :disabled="
            formValues?.phone?.length < 11 || (!type && !formValues.password)
          "
          @click="loggin"
          class="w-full disabled:cursor-not-allowed disabled:opacity-60 py-2.5 px-4 text-sm font-semibold tracking-wider rounded-md text-white bg-[#4964D8] hover:bg-blue-700 focus:outline-none"
        >
        {{ t('login.sign') }}
        </button>

        <p class="text-sm text-center mt-3" @click="restart" v-if="!!type">
          <a
            href="javascript:void(0);"
            class="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
            >{{ t('login.back') }}</a
          >
        </p>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>
