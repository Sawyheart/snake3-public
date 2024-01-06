import { useEffect, useReducer, useState } from "react"

type ScrollData = { value: number, direction: "UP" | "DOWN" }
const reducer = (state: ScrollData, action: {type: string, data: Record<string, ScrollData[keyof ScrollData]>}) => {
  const { type, data } = action
  switch (type) {
    case "set":
      return { ...state, ...data }
    default:
      return state
  }
}

export const useScroll = () => {
  const [scrollData, scrollDataDispatcher] = useReducer(reducer, {value: 0, direction: "DOWN"})

  useEffect(() => {
    const scrollEventHandler = (ev: Event) => {
      // console.log(ev, window.scrollY, scrollData.value)
      scrollDataDispatcher({type: "set", data: {value: window.scrollY}})
    }

    window.addEventListener("scroll", scrollEventHandler)
    return () => window.removeEventListener("scroll", scrollEventHandler)
  }, [])

  // useEffect(() => {
  //   const direction = window.screenY > scrollData.value ? "DOWN" : "UP"
  //   scrollDataDispatcher({type: "set", data: { direction }})

  // }, [scrollData.value])
  return scrollData
}