import React from 'react'

type Props = {
    action : () => Promise<unknown>
}

function DeleteModal({}: Props) {
  return (
    <div>DeleteModal</div>
  )
}

export default DeleteModal