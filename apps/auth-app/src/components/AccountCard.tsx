import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@vita/components'

export function AccountCard() {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className='h-10 flex items-center px-3 cursor-default hover:color-primary'>
          <Avatar className='mr-1 size-8'>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          admin
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        The React Framework – created and maintained by @vercel.
      </HoverCardContent>
    </HoverCard>
  )
}
