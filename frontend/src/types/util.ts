export type GenericRes<T,>={
    isSuccess:true,
    message:string
    result:T
} | {
    isSuccess:false,
    message:string
    issues:Array<Record<string,unknown>>
}