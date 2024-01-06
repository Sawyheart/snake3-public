import { cn } from '@/lib/util'
import React, { HTMLProps, SVGAttributes, SVGProps } from 'react'

type SvgPathProperties = {
  svgProps: SVGProps<SVGSVGElement>,
  pathProps: SVGAttributes<SVGPathElement>;
  children?: React.ReactNode,
  className?: HTMLProps<HTMLElement>["className"],
}

export default function SvgPath({svgProps, pathProps, children, className}: SvgPathProperties) {
  return (
    <svg className={cn(className)} xmlns="http://www.w3.org/2000/svg" {...svgProps}>
      <path {...pathProps} />
    </svg>
  )
}
