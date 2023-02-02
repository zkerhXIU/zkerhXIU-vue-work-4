import {createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';

import pagination from'./pagination.js';

      const url = 'https://vue3-course-api.hexschool.io/v2/';
      const path = 'tongxiu28';

      let productModal = { };
      let delProductModal = { };

      const app = createApp({
        data( ){
          return {
            products : [ ],
            tempProduct : { 
              imagesUrl : [ ],
            },
            isNew: false, 
            page:{ }
          }
        },
        methods:{
            check( ){
                axios.post(`${url}api/user/check`)
                .then((res) => {
                  this.getProducts()
                })
                .catch((error) =>{
                  alert(`請重新登入`)
                  window.location = './index.html';
                })
              },
          getProducts( page = 1){//參數預設值
            axios.get(`${url}api/${path}/admin/products/?page=${page}`)
            .then((res) => {
              this.products = res.data.products;
              this.page = res.data.pagination;
            })
          },
          openModal( state , product ){
            if (state === 'add') {
                productModal.show( );
                this.isNew = true;
                //帶入初始化資料
                this.tempProduct = {
                    imagesUrl : [ ],
                }
            }else if (state === 'edit') {
                productModal.show( );
                this.isNew = false;
                //帶入要編輯的資料
                this.tempProduct = {...product} ;
                this.imagesUrl = {...tempProduct.imagesUrl};
            }else if (state === 'delete') {
                delProductModal.show( );
                this.tempProduct = {...product} ; //要取id使用
            }
          },
          updateProduct( ){
            let purl = `${url}api/${path}/admin/product`;
            let method = 'post' ; 
            if (!this.isNew){
                purl = `${url}api/${path}/admin/product/${this.tempProduct.id}`;
                method = 'put'; 
            }
            axios[method](purl ,{ data : this.tempProduct })
            .then(res=> {
              this.getProducts( );
              productModal.hide( );
            })
          },
          deleteProduct( ){
            let purl = `${url}api/${path}/admin/product/${this.tempProduct.id}`;
            axios.delete(purl )
            .then(res=> {
              this.getProducts( );
              delProductModal.hide( );
            })
          },
        },
        components:{
          pagination,
        },
        mounted( ){
          const cookieValue = document.cookie
          .split('; ')
          .find((row) => row.startsWith('hexschool='))
          ?.split('=')[1];
          axios.defaults.headers.common['Authorization'] = cookieValue;
          this.getProducts( );
          this.check( );

          //bootstrap 方法
          console.log(bootstrap);
          //1.初始化 new
          //2.呼叫方法 .show .hide
          productModal = new bootstrap.Modal('#productModal');
            //   productModal.show();
        delProductModal = new bootstrap.Modal('#delProductModal');
        }
      });

      app.component('product-modal',{
        props:['tempProduct','updateProduct'],
        template:'#product-modal-teplate',
      });

      app.mount('#app');