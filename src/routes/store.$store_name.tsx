import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/store/$store_name')({
  component: () => <div>Hello /store/$store_name!</div>,
})
