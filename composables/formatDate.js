import { format } from "date-fns";
export const formatDate =(date)=>{
    if(date){
      return format(new Date(date), "yyyy-MM-dd");
    }
}