import { defineStore } from 'pinia'
import { useApi } from '#imports'
import { Centrifuge } from 'centrifuge'
import { useAuth } from '../store/auth'
export const useChatStore = defineStore('chat', {
    state: () => ({
        chatClient: null,
        channle: null,
        SenderList:[],
        unreadChats:[],


        channelsList:[],
        channel_loading:false,
        audio:null
    }),
    actions: {
        createChat() {
            const authStore = useAuth()
            const { user, token } = authStore
            if(token){
                this.chatClient = new Centrifuge("wss://centrifugo.furago.uz/centrifugo/connection/websocket", {
                    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjZW50cmlmdWdvX2NsaWVudCIsIm5hbWUiOiJjZW50cmlmdWdvX2NsaWVudCIsImlhdCI6MTUxNjIzOTAyMn0.cZ18MklqgFvfF0pIF19-8LMdwWS3_RTrM7C3t0BNOUA",
                    resubscribe: true,
                    debug: true, // Enable debug logs
                });
                
                this.chatClient.on('connect', (context) => {
                    console.log('Connected:', context);
                });
                
                this.chatClient.on('disconnect', (context) => {
                    console.error('Disconnected:', context);
                });
                
                this.chatClient.on('error', (error) => {
                    console.error('Error:', error);
                });
                
                this.chatClient.connect();
                
                let tin = null
                if (user.org_id) {
                    tin = user.org_id
                }
                else {
                    tin = user.pinfl
                }
                if (tin) {
                    this.SetChannel('user'+tin)
                }
            }
           
        },
        SetChannel(id) {
            if(this.channel){
                this.channel.unsubscribe()
            }
            this.channel = this.chatClient.newSubscription(id)
            this.channel.on('publication', (ctx)=> {   
                if(!ctx.data.is_read){ 
                    console.log(ctx.data)
                    this.unreadChats.push(ctx.data) 
                    if ("Notification" in window){
                        if(window.Notification.permission === "granted"){
                            let notification=new window.Notification(ctx.data.chat.full_name, {
                                icon:ctx.data&&ctx.data.chat&&ctx.data.chat.photo? `https://api.cabinet.smart-market.uz/uploads/images/${ctx.data.chat.photo}`: 'logo.png',
                                body: ctx.data.text,
                                tag:"chat_notification"
                              }); 
                            setTimeout(notification.close.bind(notification), 3000);

                        }
                        else{
                            window.Notification.requestPermission().then((permission) => { 
                                if (permission === "granted") {
                                    let notification= new window.Notification(ctx.data.chat.full_name, {
                                        icon:ctx.data&&ctx.data.chat&&ctx.data.chat.photo? `https://api.cabinet.smart-market.uz/uploads/images/${ctx.data.chat.photo}`: 'logo.png',
                                        body: ctx.data.text,
                                        tag:"chat_notification"
                                      });  
                                    setTimeout(notification.close.bind(notification), 3000);
                                }
                            })
                        }
                       
                    }
                    this.AoudioPlay()
                    
                }
                let isset=false
                if(this.channelsList && this.channelsList.length){
                    for(let i=0; i<this.channelsList.length; i++){
                        if(this.channelsList[i].id==ctx.data.channel_id){
                            isset=true 
                            this.channelsList[i].unread=this.channelsList[i].unread+1
                        }
                    }
                } 
                if(!isset){
                    try{
                        channelsList.push({
                            id:ctx.data.channel_id,
                            chat:{
                                tin:ctx.data.tin,
                                name:ctx.data.chat.full_name,
                                photo:ctx.data.chat.photo
                            },
                            unread:1
                        }) 
                    }
                    catch{
                        console.log("Chat not found")
                    }
                }
            })  
            this.channel.subscribe()
        },
        getUnreadChats(){
            const authStore = useAuth()
            const {token}=authStore
            if(token){
                useApi('/api/frontend/v1/buyer/main/channel/messages?page=1&page_size=100').then((res)=>{this.unreadChats=res.data.results})
            }
           
        },
        GetChannels(){
            this.channel_loading=true
            useApi(`/api/frontend/v1/buyer/channels?page=1&page_size=10000`)
                .then((res) => {
                    this.channelsList = res.data.results
                    this.channel_loading=false
                })
                .catch(() => {
                    this.channel_loading=false
                })
        },
        // AoudioPlay(){  
        //     this.audio = new Audio(SmsAudio); 
        //     this.audio.play()
            
        // }
        
    },
    getters: { 
        unread_count: (state) => {
            if(state.unreadChats){
                return state.unreadChats.length
            }
        }
    }, 
})
