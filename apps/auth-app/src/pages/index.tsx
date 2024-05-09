import { AccountCard } from '@/components/AccountCard'
import { AsideBar } from '@/components/AsideBar'
import { Footer } from '@/components/Footer'
import { Logo } from '@/components/Logo'
import {
  Button,
  ChevronRightIcon,
  ScrollArea
} from '@vita/components'
import { Outlet } from 'react-router'

export default function LayoutPage() {
  return (
    <>
      <header className='shadow h-12 flex items-center justify-between pl-6 pr-1 relative z-1'>
        <div className='flex'>
          <Logo />
        </div>
        <div className='flex h-full items-center'>
          <Button variant='ghost' className='font-normal'>
            管理后台
            <ChevronRightIcon />
          </Button>
          <AccountCard />
        </div>
      </header>
      <div className='h-[calc(100vh_-_48px)] flex'>
        <AsideBar />
        <main className='flex-1'>
          <ScrollArea className='h-full'>
            <div className='flex-1 min-h-[calc(100vh_-_84px)]'>
              <Outlet />
            </div>
            <Footer />
          </ScrollArea>
        </main>
      </div>
    </>
  )
}
