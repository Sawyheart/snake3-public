import { twMerge } from "tailwind-merge"
import { clsx, ClassValue } from "clsx"

export const CONTRACT_ADDRESS =  "0x61FffEa7dbbD368E0AdCa4755c39B2fc858A4d2d"  //0xae8f2089bF4e826fD6398161BDE3fc366B9E3d85 - //0x110AC8937C5E5dA4EFc0d79eCBe61726A5c4f446

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const SNAKE_SVG_TEMPLATE = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
    <style>
      .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        height: 100%;
        margin: 0;
      }

      .canvas_border {
        padding: 20px;

        width: 400px;
        height: 400px;
        
        border: 5px dashed #9999;
        border-radius: 5px;

        filter: drop-shadow(5px 5px 0 #0005);

        transition: .25s ease;
      }

    </style>
    <rect width="600" height="600" fill="url(#background-pattern)">
      <animateTransform attributeName="transform" type="translate" from="-100 -100" to="0" dur="5s" repeatCount="indefinite" />
    </rect>

    <foreignObject width="500" height="500">
      <div class="container" xmlns="http://www.w3.org/1999/xhtml">
        <div class="canvas_border"></div>
      </div>
    </foreignObject>

    <rect x="50" y="50" rx="5" width="400" height="400" fill="url(#canvas-pattern)" filter="drop-shadow(5 5 0 #0005)" />

    <g id="canvas" style="clip-path: url(#canvas-clip);">
      ^
    </g>
    <defs>      
      <clipPath id="canvas-clip">
        <rect x="50" y="50" rx="5" width="400" height="400" />
      </clipPath>
      <pattern id="canvas-pattern" x="0" y="0" width="0.08" height="0.08">
        <rect x="0" y="0" width="32" height="32" fill="#eee" />
        <rect x="16" y="0" width="16" height="16" fill="#fff" />
        <rect x="0" y="16" width="16" height="16" fill="#fff" />
      </pattern>
      <pattern id="background-pattern" x="0" y="0" width="0.3333" height="0.3333">
        <rect x="0" y="0" width="200" height="200" fill="#212121" />
        <rect x="100" y="0" width="100" height="100" fill="#242424" />
        <rect x="0" y="100" width="100" height="100" fill="#242424" />
      </pattern>
    </defs>
  </svg>`