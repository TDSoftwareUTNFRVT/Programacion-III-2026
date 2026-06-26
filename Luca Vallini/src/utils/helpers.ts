export function truncate (text:string, maxLength:number =100):string{
    if (text.length<=maxLength) return text;
    return text.slice(0, maxLength).trimEnd()+"...";
}

export function joinList (items:string[], max:number =3):string {
    if (items.length ===0)return "Sin Informacion";
    const visible =items.slice(0, max);
    const remaining =items.length - max;
    const base = visible.join(". ");
    return remaining> 0 ? `${base} y ${remaining} más`:base;
}

export async function tryCatch<T>(fn:()=> Promise<T>): Promise<[T | null, Error | null]> {
    try{
        const data = await fn();
        return [data, null];
    } catch(err){
        const error = err instanceof Error ? err :new Error(String(err));
        return [null, error];
    }
    
}

export function getCoverUrl(coverId:number | undefined): string{
    if (!coverId) return "/public/no-cover.png";
    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
}