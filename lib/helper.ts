export const changeCSSProperty = (propertyNames: string[], propertyValues: string[]) => {
  if(propertyNames.length !== propertyValues.length) return

  propertyNames.forEach((name, idx) => document.documentElement.style.setProperty(name, propertyValues[idx]))
}


const svgPathResizer = ((d: string, oldViewBox: [number, number], newViewBox: [number, number]) => {

})("s", [1, 1], [1, 1])
