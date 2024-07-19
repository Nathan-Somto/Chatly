import { cn } from '@/lib/utils'
import H2 from '../ui/typo/H2'
import P from '../ui/typo/P'
import { Button } from '../ui/button'

function DesktopOnly() {
  return (
    <div className={cn('bg-background lg:hidden flex items-center justify-center fixed h-screen w-full inset-0 z-[99999999999999999999999999999999999999999999999999999]')}>
      <div>

      <div className='mx-auto'>
      <H2 className='mb-2'>Desktop Only</H2>
      <div className='text-sm opacity-80'>
      <P>The web application only supports desktop screens.</P>
      <P>Get the mobile app to continue chatting!</P>
      </div>
      <Button className='mt-1.5'>Download Now</Button>
      </div>
      </div>
    </div>
  )
}

export default DesktopOnly