import Image from "next/future/image"
const Logo = () => {
    return (
        <div className="flex flex-row justify-center items-center">
            <div className="flex-auto max-w-[36px]">
                <Image
                    src='/logo.png'
                    width={48}
                    height={70}
                    alt='Pineso'
                    style={{ height: 'auto' }}
                />
            </div>
            <span className="ml-2 text-3xl uppercase font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ec05ad] to-[#5634ee]">Pineso</span>
        </div>
    )
}

export default Logo