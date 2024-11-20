<template>
    <div class="px-5 py-6 max-lg:max-w-[100dvw]">
        <div class="card overflow-hidden w-full rounded-lg">
      <DataTable
        :value="customers"
        stripedRows
        paginator
        scrollable scrollHeight="400px"
        :rows="10" :rowsPerPageOptions="false"
      >
        <Column
          field="first_name"
          header="Haydovchi ismi"
          sortable
          style="width: 25%"
        ></Column>
        <Column
          field="car_name"
          header="Moshina turi"
          sortable
          style="width: 25%"
        ></Column>
        <Column
          field="car_num"
          header="Sanasi"
          sortable
          style="width: 25%"
        ></Column>
        <Column
          field="expired_date"
          header="Representative"
          sortable
          style="width: 25%"
        ></Column>
      </DataTable>
    </div>
    </div>
</template>

<script setup>
const customers = ref([
  {
    id: 1,
    first_name: "Isa",
    car_name: "Sienna",
    car_num: 1999,
    expired_date: "3/18/2024",
  },
  {
    id: 2,
    first_name: "Albina",
    car_name: "Miata MX-5",
    car_num: 2002,
    expired_date: "2/15/2024",
  },
  {
    id: 3,
    first_name: "Joyann",
    car_name: "1500",
    car_num: 1994,
    expired_date: "7/22/2024",
  },
  {
    id: 4,
    first_name: "Colman",
    car_name: "G35",
    car_num: 2007,
    expired_date: "6/20/2024",
  },
  {
    id: 5,
    first_name: "Phoebe",
    car_name: "Aerostar",
    car_num: 1988,
    expired_date: "2/15/2024",
  },
  {
    id: 6,
    first_name: "Trula",
    car_name: "Ram 1500 Club",
    car_num: 1997,
    expired_date: "2/19/2024",
  },
  {
    id: 7,
    first_name: "Ketti",
    car_name: "F350",
    car_num: 2007,
    expired_date: "1/22/2024",
  },
  {
    id: 8,
    first_name: "Madelon",
    car_name: "Sierra 3500",
    car_num: 2004,
    expired_date: "12/3/2023",
  },
  {
    id: 9,
    first_name: "Matthias",
    car_name: "Suburban 1500",
    car_num: 1995,
    expired_date: "1/12/2024",
  },
  {
    id: 10,
    first_name: "Donica",
    car_name: "Land Cruiser",
    car_num: 2009,
    expired_date: "12/31/2023",
  },
]);
</script>

<style lang="scss" scoped>

</style>