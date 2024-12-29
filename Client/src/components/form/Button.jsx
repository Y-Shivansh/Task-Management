export const Button = ({label, onClick}) =>{
    return <div>
        <button onClick={onClick} type="button" className="w-full text-white bg-[#00baf2] hover:bg-[#154473] focus:outline-none ont-medium rounded-lg text-sm px-5 py-2.5">
            {label}
            </button>
    </div>
}