'use client'

interface Props {
  doctorId: string
  deleteAction: (formData: FormData) => Promise<void>
}

export function DeleteDoctorButton({ doctorId, deleteAction }: Props) {
  return (
    <form action={deleteAction}>
      <input type="hidden" name="doctorId" value={doctorId} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm('Delete this doctor? Their account will be permanently removed and cannot be undone.')) {
            e.preventDefault()
          }
        }}
        className="text-sm font-medium px-4 py-1.5 rounded-lg border border-red-200 text-red-600 bg-white hover:bg-red-50 transition-all active:scale-95"
      >
        Delete
      </button>
    </form>
  )
}