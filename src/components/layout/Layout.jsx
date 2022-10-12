import { Header } from '@components/header';
import { ToastContainer, toast } from 'react-toastify';
import TrendingTags from '@components/ui/TrendingTags';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
    const router = useRouter();
    return (
        <>
            <div>
                <div className='flex flex-col w-full max-w-full justify-center'>
                    <Header/>
                    <div className='flex-nowrap flex flex-col flex-none w-full max-w-full py-[20px] lg:py-[90px] px-4'>
                        {/* <div className='trending-tags mx-auto'>
                            {router.pathname !== '/pin/[slug]' && <TrendingTags isSingle={false} />}
                        </div> */}
                        {children}
                    </div>
                    {/* <Footer/> */}
                    <ToastContainer/>
                </div>
            </div>
        </>
  )
  
}

export default Layout