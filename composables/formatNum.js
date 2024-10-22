export const formatNum =(num,path)=>{
      if(num){
        return num.toString().replaceAll(path?path:" ","")
      }
}