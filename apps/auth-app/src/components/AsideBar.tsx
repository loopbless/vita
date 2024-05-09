import { Button } from '@vita/components'
import { Link } from 'react-router-dom'

export function AsideBar() {
  return (
    <aside className='w-[210px] h-full p-2 [&_a]:(w-full justify-start px-5 font-normal) b-r'>
      <nav>
        <ul>
          <li>
            <Button asChild size='sm' variant='ghost'>
              <Link to=''> 菜单一</Link>
            </Button>
          </li>
          <li>
            <Button asChild size='sm' variant='ghost'>
              <Link to=''> 菜单一</Link>
            </Button>
          </li>
          <li>
            <Button asChild size='sm' variant='ghost'>
              <Link to=''> 菜单一</Link>
            </Button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
