import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/stores/edit/$id')({
  component: EditStores,
})

function EditStores() {
  return <div>Hello /_private/stores/edit!</div>
}
