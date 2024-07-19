import React from 'react'

export default function ListContainer({children}: {children: React.ReactNode}) {
  return (
    <section className="mt-8 px-3  space-y-1 lg:h-[calc(100vh-16*0.25rem)] lg:overflow-auto ">
        {children}
    </section>
  )
}
