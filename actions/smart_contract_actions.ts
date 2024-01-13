"use server"

// import Snake3 from "../../contract/artifacts/contracts/Snake3.sol/Snake3.json"
import Snake3 from "@/ABI/Snake3.json"
import { ThirdwebSDK } from "@thirdweb-dev/sdk"
import { ThirdwebStorage } from "@thirdweb-dev/storage"
import { BigNumber, ethers } from "ethers"
import React from "react"
import { CONTRACT_ADDRESS, SNAKE_SVG_TEMPLATE } from "@/lib/util"

type PathTagProps = {
  d: string,
  color: string,
  width: number,
}

const fs = require("fs")
const sdk = ThirdwebSDK.fromPrivateKey(process.env.MUMBAI_PRIVATE_KEY as string, "mumbai", {clientId: "b4b761bb07c794e8276be1cb8a89bc82", secretKey: process.env.THIRDWEB_API_SECRET_KEY})
const storage = new ThirdwebStorage({secretKey: process.env.THIRDWEB_API_SECRET_KEY})

// const CONTRACT_ADDRESS = "0x8286aC421BC16aCd3BD5B1fa33cBF58BC017147F"
const BASE_IMAGE_URI = "https://b4b761bb07c794e8276be1cb8a89bc82.ipfscdn.io/"

export const uploadContent = async () => {
  const contentText: string = fs.readFileSync("./public/smart-contract-metadata/animation_uri_content.html", {encoding: "utf8"})
  const contentChunks: string[] = contentText.split("^")
  const contentChunksInBytes: Uint8Array[] = contentChunks.map((chunk: string) => ethers.utils.toUtf8Bytes(chunk))

  // console.log("changing animation uri content with:", contentChunks)
  const contract = await sdk.getContractFromAbi(CONTRACT_ADDRESS, Snake3.abi)
  const reciep = await contract.call("uploadContent", [contentChunksInBytes])
}

export const addSnakeTicket = async (ticketOwner: string | undefined, snakeData: SnakeStepData[]) => {
  const { minifiedData, snakeColorsProperty } = _minifySnakeData(snakeData)
  const snakeGameSVGText = _createSVG(minifiedData)

  const uri = await storage.upload(snakeGameSVGText)
  const cleanURI = uri.replace(":/", "")

  const contract = await sdk.getContractFromAbi(CONTRACT_ADDRESS, Snake3.abi)
  const totalTickets = await contract.call("totalTickets")
  const _allData = [
    _snakeDataToString(minifiedData),
    "#" + (totalTickets.toNumber()+1),
    ticketOwner as string,
    _getDateFromTimestamp(Date.now()/1000),
    snakeColorsProperty
  ]

  const data = await contract.call("addSnakeTicket", [
    ticketOwner,
    _allData.map(v => ethers.utils.toUtf8Bytes(v)),
    ethers.utils.toUtf8Bytes(snakeColorsProperty),
    ethers.utils.toUtf8Bytes(cleanURI)
  ])

  return 200
}

export const burnTicket = async (ticketID: number) => {
  const contract = await sdk.getContractFromAbi(CONTRACT_ADDRESS, Snake3.abi)
  const data = await contract.call("burnTicket", [ticketID])
}

export const mintSnake = async (ticketID: number) => {
  const contract = await sdk.getContractFromAbi(CONTRACT_ADDRESS, Snake3.abi)
  const data = await contract.call("mintSnake", [ticketID])
}

export const burnSnake = async (ticketID: number) => {
  const contract = await sdk.getContractFromAbi(CONTRACT_ADDRESS, Snake3.abi)
  const data = await contract.call("_burn", [ticketID])
}

export const getTotalSnakeTickets = async () => {
  const contract = await sdk.getContractFromAbi(CONTRACT_ADDRESS, Snake3.abi)
  const data = await contract.call("totalTickets", [])

  const totalTickets: number = data.toNumber()
  
  return totalTickets
} 

export const getOwnedTicketsID = async (ownerAddress: string |  undefined) => {
  if(!ownerAddress) return 
  const contract = await sdk.getContractFromAbi(CONTRACT_ADDRESS, Snake3.abi)

  const draftsBN: BigNumber[] = await contract.call("getTicketsByAddress", [ownerAddress, false])
  const mintedBN: BigNumber[] = await contract.call("getTicketsByAddress", [ownerAddress, true])

  const drafts = draftsBN.map(value => value.toNumber())
  const minted = mintedBN.map(value => value.toNumber())

  return { drafts, minted }
}


const CROSS_SVG_PATH = [React.createElement("path", {d: "M2,2L8,8M2,8L8,2", fill:"none", stroke: "#999", strokeWidth: 2})]
export const getSnakePathTags = async (ticketID: number, mintedOnly: boolean = false) => {
  const contract = await sdk.getContractFromAbi(CONTRACT_ADDRESS, Snake3.abi)

  if(mintedOnly) {
    const data = await contract.call("snakeTickets", [ticketID])
    console.log(data.ticketStatus)
    // if(data.ticketStatus.toNumber() !== 2) return {
    //   res: 404,
    //   data: {pathElements: undefined, snakeDataString: ""}
    // }
  }
  const data = await contract.call("getTicketSnakeData", [ticketID])
  const snakeDataString = data.length ? "[" + Buffer.from(ethers.utils.arrayify(data[0])).toString() + "]" : "[]"
  
  try{
    var snakeData = JSON.parse(snakeDataString)
  } catch(e) {
    console.error("Impossible to PARSE. Wrong SnakeData Format")
    return {
      res: 204,
      data: {
        pathElements: CROSS_SVG_PATH,
        snakeDataString: snakeDataString
      }
    }
  }
  const { tags: pathTags, error } = _createPathTags(snakeData, 1, 0)

  if(error) {
    console.error(error)
    return {
      res: 204,
      data: {
        pathElements: CROSS_SVG_PATH,
        snakeDataString: snakeDataString,
      }
    }
  }

  const snakeInfoData = await contract.call("snakeTickets", [ticketID])
  const colors = Buffer.from(ethers.utils.arrayify(snakeInfoData.snakeColors)).toString()
  const timestamp = _getDateFromTimestamp(snakeInfoData.creationTimestamp.toNumber())
  const creatorAddress = snakeInfoData.creatorAddress
  const ownerAddress = snakeInfoData.ownerAddress

  // console.log(colors, timestamp)

  return {
    res: 200,
    data: {
      pathElements: pathTags?.map(value => React.createElement("path", {d: value.d, fill:"none", stroke: value.color, strokeWidth: value.width})),
      snakeDataString: snakeDataString,
      snakeInfo: { colors, timestamp, creatorAddress, ownerAddress }
    }
  }
}

export const getSnakeData = async (ticketID: number) => {
  const contract = await sdk.getContractFromAbi(CONTRACT_ADDRESS, Snake3.abi)
  const data = await contract.call("getTicketSnakeData", [ticketID])
  return data.length ? "[" + Buffer.from(ethers.utils.arrayify(data[0])).toString() + "]" : "[]"
}


/// ### PRIVATE FUNCTIONS ###

//Get the minified version of the snakeData gotten from the Game (direction and color change)
const _minifySnakeData = (data: SnakeStepData[]) => {
  let minifiedData: SnakeStepData[] = []
  
  let snakeColors: Set<string> = new Set<string>()

  data.forEach((step, idx) => {
    snakeColors.add(step.color)
    
    if(idx === 0) {
      minifiedData.push(step)
      return
    }

    const lastAddedStep = minifiedData[minifiedData.length-1]
    if(step.x !== lastAddedStep.x && step.y !== lastAddedStep.y || step.color !== lastAddedStep.color) minifiedData.push({ ...data[idx-1], color: step.color })

    if(idx === data.length-1) minifiedData.push(step)
  })

  return {minifiedData, snakeColorsProperty: Array.from(snakeColors.values()).join("-")}
}

//Create the SVG file in order to upload it to Thirdweb IPFS Storage
const _createSVG = (minifiedData: SnakeStepData[]): string =>  {
  const templateSVGText: string = SNAKE_SVG_TEMPLATE//fs.readFileSync("./public/smart-contract-metadata/snake_image_template.svg", {encoding: "utf8"})
  const splittedSVGText: string[] = templateSVGText.split("^")
  const { finalString: pathTagsInString } = _createPathTags(minifiedData, 8, 50)

  return splittedSVGText[0] + pathTagsInString + splittedSVGText[1]
  // fs.writeFileSync("./public/smart-contract-metadata/blob_snake_svg.svg", actualSVG)
}

//Create the <path> tags to complete the SVG with the actual Snake Game Data
const _createPathTags = (data: SnakeStepData[], unitSize: number, originOffset: number) => {
  if(data.length === 0) return {error: "Empty data: given ticket is probably nonexistent"}
  const pathTag = {
    dAttr: "<path d='",
    strokeAttr: "' stroke='",
    closure: "' fill='none' stroke-width='" + unitSize + "'/>"
  }

  let finalString = ""
  let tags: PathTagProps[] = []

  let startingPoint = {x: data[0].x * unitSize + originOffset, y: data[0].y * unitSize + originOffset}
  let newTag = true

  data.forEach((step, idx) => {
    const nextStep = data[Math.min(idx+1, data.length-1)]
    const direction = {x: Math.sign(nextStep.x - step.x), y: Math.sign(nextStep.y - step.y)}

    const lineCommand = direction.x === 0 ? "V" : "H"
    let linePoint = ((nextStep.x * unitSize) * Math.abs(direction.x)) + ((nextStep.y * unitSize) * Math.abs(direction.y)) + originOffset
    
    if(newTag) {
      const mValue = {
        x: (Math.abs((-1 + direction.x) * (unitSize/2)) + (step.x * unitSize + originOffset)) + direction.x * unitSize * Math.sign(idx),
        y: (Math.abs((-1 + direction.y) * (unitSize/2)) + (step.y * unitSize + originOffset)) + direction.y * unitSize * Math.sign(idx),
      }

      finalString += pathTag.dAttr + "M" + mValue.x + "," + mValue.y
      tags.push({d: "M" + mValue.x + "," + mValue.y, color: step.color, width: unitSize})
      linePoint += (unitSize/2) * Math.sign(data.length-2-idx)
    }

    if(step.color !== nextStep.color) {
      linePoint += ((newTag ? (unitSize/2) : unitSize * Math.sign((direction.x + direction.y) + 1)) * (direction.x + direction.y)) * Math.sign(data.length-2-idx)
      newTag = true
      startingPoint = {x: startingPoint.x + linePoint * direction.x, y: startingPoint.y + linePoint * direction.y}
      finalString += lineCommand + linePoint + pathTag.strokeAttr + step.color + pathTag.closure
      tags[tags.length-1].d += lineCommand + linePoint
    }
    else {
      if(!newTag) linePoint += (idx === data.length-2 ? 0 : (unitSize/2))
      if(idx === data.length-2 && Math.sign(direction.x + direction.y) === 1) linePoint += unitSize
      
      newTag = false

      if(idx === data.length-1) finalString += pathTag.strokeAttr + step.color + pathTag.closure
      else {
        finalString += lineCommand + linePoint
        tags[tags.length-1].d += lineCommand + linePoint
      }
    }
  })
  // console.log(data, finalString)
  return {finalString, tags}
}

//Convert the data from the game to a string
const _snakeDataToString = (data: SnakeStepData[]): string => {
  // return data.map((step: SnakeStepData) => "{x:" + step.x + ",y:" + step.y + ",color:'" + step.color + "'}").join(", ")
  return data.map((step: SnakeStepData) => '{"x":' + step.x + ',"y":' + step.y + ',"color":"' + step.color + '"}').join(", ")
}

const _getDateFromTimestamp = (timestamp: number) => {
  const dateInSecs = new Date(timestamp*1000)
  let month: number | string = dateInSecs.getMonth()+1
  let day: number | string = dateInSecs.getDate()
  
  month = month.toString().length === 1 ? "0" + month : month
  day = day.toString().length === 1 ? "0" + day : day
  
  return month + "/" + day + "/" + dateInSecs.getFullYear()
}



