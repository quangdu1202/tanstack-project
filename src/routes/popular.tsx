import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/popular')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/popular"!</div>
}
