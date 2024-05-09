import { trpc } from '@/utils/trpc'
import {
  Button,
  Input,
  Separator,
  useToast,
  ChevronRightIcon,
} from '@vita/components'
import { MouseEvent as RCMouseEvent } from 'react'
import {
  GithubIcon,
  GitlabIcon,
  TiktokIcon,
  UserIcon,
  SquareLockIcon,
} from '@/components/icons'
import { LoginBg } from '@/components/LoginBg'

export default function Login() {
  const toast = useToast()
  const mutation = trpc.oauth.token.useMutation()
  const [username, setUserName] = useState<string>()
  const [password, setPassword] = useState<string>()

  const handleLogin = (e: RCMouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (!username || !password) {
      toast.toast({ title: '提示', description: '请输入用户名或密码' })
      return
    }
    mutation.mutateAsync({
      client_id: 'e53d1b2989cb414d86f76f9e2c1bc0ac',
      client_secret:
        '4PYkF5LRiXqvHWco1g23JZk4_liNptUD20y7l-T4tI0G-9EVSxTfPPmA0z8uqybdRNdNa-SnTSf84_FY7ux1kA',
      grant_type: 'password',
      username: username,
      password: password,
    })
  }

  console.log(mutation.data)

  return (
    <div className='container mx-auto relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='lg:text-background text-2xl absolute top-6 left-6 z-10 lg:bg-foreground/70 rounded-lg px-2 py-.5'>
        VITA
      </div>
      <div className='bg-foreground h-full hidden lg:block'>
        <LoginBg />
      </div>
      <div className='p-6 flex flex-col items-center'>
        <Button variant='ghost' className='absolute top-6 right-6'>
          注册
          <ChevronRightIcon />
        </Button>
        <form className='w-[380px] h-full flex flex-col items-center gap-8'>
          <h1 className='text-2xl'>Superstar 登录</h1>
          <Input
            value={username}
            placeholder='请输入用户名'
            prefix={<UserIcon height={20} />}
            onChange={(val) => setUserName(val.target.value)}
          />
          <Input
            value={password}
            placeholder='请输入密码'
            prefix={<SquareLockIcon height={20} />}
            onChange={(val) => setPassword(val.target.value)}
          />
          <Button
            className='w-full'
            onClick={handleLogin}
            loading={mutation.isPending}
          >
            登录
          </Button>
          <div className='text-muted-foreground w-full flex items-center'>
            <Separator className='flex-1' />
            <span className='inline-block px-4 text-sm'>其他登录方式</span>
            <Separator className='flex-1' />
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <Button variant='ghost'>
              <GithubIcon />
            </Button>
            <Button variant='ghost'>
              <GitlabIcon />
            </Button>
            <Button variant='ghost'>
              <TiktokIcon />
            </Button>
          </div>
          <div className='text-muted-foreground text-sm text-center'>
            <Button className='px-1' variant='link'>
              服务条款
            </Button>
            和
            <Button className='px-1' variant='link'>
              隐私协议
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
