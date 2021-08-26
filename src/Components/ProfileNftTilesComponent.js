import NftTiles from "./NftTilesComponent";

export default function ProfileNftTiles(props) {
    return (
        <div className="grid grid-cols-12 my-2">
            <div className="col-start-2 col-span-10">
                <NftTiles setNfts={props.setNfts} nfts={props.nfts} />
            </div>
        </div>
    );
}