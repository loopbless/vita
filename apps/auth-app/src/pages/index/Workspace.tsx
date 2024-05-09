import { trpc } from '@/utils/trpc'

export default function WorkspacePage() {
  const mutation = trpc.users.page.useQuery({pageNumber: 1, pageSize: 10})
  console.log(mutation.status)
  return (
    <>
      <h1>Workspace</h1>
    </>
  )
}
