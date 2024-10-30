<template>
  <div class="border border-gray-400 px-5 py-4 max-md:pt-10 bg-white rounded-xl flex max-md:flex-col max-md:gap-4 relative">
    <div class="flex-1 flex items-center gap-3">
      <div
        class="w-14 h-14 bg-blue-400 rounded-md text-white flex items-center justify-center"
      >
        <Icon name="mdi:truck" size="20px" />
      </div>
      <div>
        <div>
          <span class="font-bold text-lg">Mersedes Benz</span>
          <span class="text-gray-400">01 601 BGA</span>
        </div>
        <p class="text-gray-400">тентованный, 100 м3, 10 т</p>
      </div>
    </div>
    <div class="flex-1 flex items-center gap-3">
      <div
        class="w-14 h-14 bg-blue-400 rounded-md text-white flex items-center justify-center overflow-hidden"
      >
        <img
          src="https://cdn6.f-cdn.com/files/download/38546484/28140e.jpg"
          class="object-cover w-full h-full"
          alt=""
        />
      </div>
      <div>
        <span class="font-semibold text-lg">Jhon doye</span>
        <p class="text-gray-400">+998936554583</p>
      </div>
    </div>
    <div class="flex items-center gap-3 max-md:absolute max-md:top-0 max-md:right-0">
      <Tag severity="success" value="Tasdiqlangan"></Tag>
      <div class="card flex justify-center">
        <Button
          type="button"
          icon="pi pi-ellipsis-v"
          @click="toggle"
          class="!bg-transparent !border-none !text-gray-400"
          aria-haspopup="true"
          aria-controls="overlay_menu"
        />
        <!-- <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" /> -->
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
            <template #item="{ item, props }">
                    <div class="flex items-center justify-start gap-1 px-4 py-1">
                        <Icon :name="item.icon" />
                        <span class="ml-2">{{ item.label }}</span>
                    </div>
            </template>
        </Menu>
      </div>
    </div>
  </div>
</template>

<script setup>
const menu = ref();
const items = ref([
            {
                label: "O'chirish",
                icon: 'material-symbols:delete-outline'
            },
            {
                label:"O'zgartirish",
                icon: 'material-symbols:edit-rounded'
            }
        ]);

const toggle = (event) => {
    menu.value.toggle(event);
};
</script>

<style lang="scss" scoped></style>
