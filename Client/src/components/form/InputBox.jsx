export const InputBox = ({label, placeholder, value, type, onChange})=> {
    return <div className="text-sm font-normal text-left py-2">
        <div className="font-semibold">
            {label}
        </div>
        <input placeholder={placeholder} value={value} type={type} onChange={onChange} className="w-full px-2 py-1 border bg-none outline-none rounded border-slate-200"/>
    </div>
} 