import { getOwnedTicketsID } from '@/actions/smart_contract_actions'
import GalleryCard from '@/components/gallery/gallery-card'
import WalletAddress from '@/components/general/wallet-address'
import { cn } from '@/lib/util'

export default async function GalleryPage({ searchParams, }: {searchParams: { [key: string]: string | string[] | undefined }}) {
  const address: string = searchParams.address as string
  const ownedTickets = await getOwnedTicketsID(address/*"0x31389e8115AebcBC5Ae1d5CfDac45D1CDec652aF"*/)

  return(
    <section className="w-full px-10 pb-28 pt-48 flex flex-col items-stretch gap-10">
      <WalletAddress />
      <section className="section_gallery" data-title="drafts" tabIndex={-1}>
        <span className={cn("section_gallery_title", " flex items-center py-0 left-7 text-zinc-700 shadow-[4px_4px_0_#000a]")}>
          <div className="py-2 px-3 mr-[10px] border-r-2 border-black rounded-xl rounded-r-none bg-zinc-800 sm_text_format text-white">
            {ownedTickets?.drafts.length}/10
          </div>
          drafts
        </span>
        <section className="px-10 py-8 mt-12 flex flex-wrap justify-center gap-10 default_transition">
          {
            ownedTickets?.drafts.map((value, index) => <GalleryCard key={index} ownerAddress={address} ticketID={value} ticketType="draft" route="/gallery" />)
          }
        </section>
      </section>
      <section className="section_gallery" data-title="minted">
        <span className={cn("section_gallery_title", "left-7 px-3 bg-[0px] text-zinc-700 shadow-[4px_4px_0_#000a]")}>
          {/* <span className="py-2 px-3 mr-[10px] border-r-2 border-black rounded-xl rounded-r-none bg-zinc-800 text-white">-</span> */}
          minted
        </span>
        <section className="px-10 py-8 mt-12 flex flex-wrap justify-center gap-10 default_transition">
          {
            ownedTickets?.minted.slice(0, 10).map((value, index) => <GalleryCard key={index} ownerAddress={address} ticketID={value} ticketType="minted" route="/gallery" />)
          }
        </section>
        {/* {
          ownedTickets && ownedTickets.minted.length > mintedLimit ? 
          <button className="button px-2 py-2 mt-4 sm_text_format" onClick={() => setMintedLimit(value => value + 2)}>
            VIEW MORE
          </button> : null
        } */}
        
      </section>
    </section>
  )
}
