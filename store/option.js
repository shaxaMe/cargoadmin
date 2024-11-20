export const useOption = defineStore('option', () => {
    const options = ref({
        driver_types: null,
        category_type: null,
        vehicle_type: null,
        truck_body_type: null,
        truck_load_type: null,
        truck_type_parametr: null,
        colors: null,
        fuel_type: null,
        currency:null,
        cargoType: null,
    });
    const upiUrls = [{
        url: '/v1/reference/driving-license-categories',
        key: 'driver_types'
    },
    {
        url:'/v1/reference/currencies',
        key: 'currency'
    },
    {
        url: '/v1/reference/category-types',
        key: 'category_type'
    },
    {
        url: '/v1/reference/vehicle-types',
        key: 'vehicle_type'
    },
    {
        url: '/v1/reference/truck-body-types',
        key: 'truck_body_type'
    },
    {
        url: '/v1/reference/truck-load-types',
        key: 'truck_load_type'
    },
    {
        url: '/v1/reference/truck-body-type-parameters',
        key: 'truck_type_parametr'
    },
    {
        url: '/v1/reference/colors',
        key: 'colors'
    },
    {
        url: "/v1/reference/fuel-types",
        key: "fuel_type"
    },
    {
        url: "/v1/reference/cargo-types",
        key: "cargoType"
    }
    ];
    function getDatas() {
        this.upiUrls.forEach(element => {
               useApi(`${element.url}`).then((res)=>{
                if(element.key == 'currency'){
                    this.options[element.key] = res.results.map((d)=>({id:d.id,name:d.code,sort_order:d.sort_order}))
                }
                if(res.results && res.results.length>0){
                    this.options[element.key] = res.results.map((d)=>({id:d.id,name:d.names['uz'],sort_order:d.sort_order}))
                }
                
               })
        });
    }
    return { options,getDatas,upiUrls }
}, {
    persist: {
        storage: window.localStorage
    },
})

// base url
