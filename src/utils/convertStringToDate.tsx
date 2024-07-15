import dayjs from "dayjs"

export function convertStringToDate(date:string){
    const nam = date?.slice(0, 10).split("/")?.[2]
    const thang = date?.slice(0, 10).split("/")?.[1]
    const ngay = date?.slice(0, 10).split("/")?.[0]
    const convertDate = dayjs(`${nam}-${thang}-${ngay}`).valueOf()
    return convertDate
}