export type Res<T>={
    isSuccess:false,
    message:string,
    issues:any[]
} |
{
    isSuccess:true,
    message:string,
    result:T
}