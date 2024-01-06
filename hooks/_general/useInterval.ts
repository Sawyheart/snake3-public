import { useEffect, useRef, useState } from "react"

const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef<() => void>(() => {})
  const [resetIntervalTrigger, setResetIntervalTrigger] = useState(false)
  const [stop, setStop] = useState(true)

  const resetInterval = () => {
    setResetIntervalTrigger(!resetIntervalTrigger)
  }

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback])

  useEffect(() => {
    if(stop) return

    const interval = setInterval(() => savedCallback.current(), delay)
      
    return () => clearInterval(interval)
  }, [delay, resetIntervalTrigger, stop])

  return { resetInterval, stop, setStop }

}

export default useInterval