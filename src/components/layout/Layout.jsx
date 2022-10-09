import { Header } from '@components/header';
import { ToastContainer, toast } from 'react-toastify';
import TrendingTags from '@components/ui/TrendingTags';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
    const router = useRouter();
    return (
        <div className='flex flex-col justify-center'>
            <Header/>
            <div className='container-fluid py-[70px]'>
                <div className='trending-tags mx-auto'>
                    {router.pathname !== '/pin/[slug]' && <TrendingTags isSingle={false} />}
                </div>
                <div className='content px-4 pt-2'>{children}</div>          
            </div>
            <ToastContainer/>
        </div>
  )
}

export default Layout