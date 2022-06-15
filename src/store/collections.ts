import * as f from "./fetch";
export async function getCollections(
    collectionsList?: string[]
)
{
    log(collectionsList);
    // const { mana, store } = await createComponents();
    // const storeContract = getContract(ContractName.CollectionStore, 137);
    let collections: f.Collections = [];
    if (collectionsList)
    {
        for (const collectionURN of collectionsList)
        {
            const collection = await f.collection(collectionURN);
            if (collection !== undefined) collections.push(collection);
        }
    } else collections = await f.storeCollections().then((r) => r.collections);
    // const fromAddress = await getUserAccount();
    log(collections);
    log("number of Collections: " + collections.length);
    for (const collection of collections)
    {
        log("number of items in collection: " + collection.items.length);
        for (let item of collection.items)
        {
            log("Name: " + item.metadata.wearable.name)

        }
    }
    return collections
}