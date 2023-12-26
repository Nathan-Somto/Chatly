import  { useEffect, useRef } from 'react'

type Props = {
    value: unknown
}

function useAutoGrowTextarea({value}: Props) {
    const textAreaRef = useRef<HTMLTextAreaElement | null> (null);
    useEffect(() => {
      if(textAreaRef.current !== null){
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
      }
    }, [value])
  return {textAreaRef}
}

export  {useAutoGrowTextarea}