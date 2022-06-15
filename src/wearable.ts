import { ItemOfCollection } from './store/fetch'
import * as ui from "@dcl/ui-scene-utils"
import { Canvas } from './canvas/canvas'
import * as crypto from '@dcl/crypto-scene-utils'
import { Wearable } from 'node_modules/@dcl/crypto-scene-utils/dist/wearable/types'
export class _Wearable extends Entity
{
    public enabled: boolean = true
    public wearableFromList: Wearable
    constructor(public item: ItemOfCollection, public collection: string, public collectionId: string, public owner: string)
    {
        super()
        //change model
        this.addComponent(new GLTFShape('models/pumpkin_helmet.glb'))
        this.addComponent(new Transform({ position: new Vector3(0, 1.5, 0.42), scale: new Vector3(1.2, 1.2, 1.2) }))
        log("fetched item")
        // log(item)
        executeTask(async () => 
        {
            // crypto.wearable.getListOfWearables({ wearableIds: [item.urn] }).then((value) =>
            // {
            //     this.wearableFromList = value[0]
            //     log("fetched info")
            //     log(this.wearableFromList)
            // }
            // )
            this.updateWearable()
        })
        // this.updateWearable()
        Canvas.instance.prompt.closeIcon.onChange(() => this.enabled = true)
        this.addComponent(new OnPointerDown((e) =>
        {
            if (!this.enabled)
                return
            this.enabled = false
            this.showPanel()
        }, { button: ActionButton.POINTER }))
    }
    public showPanel()
    {
        Canvas.instance.prompt.show()
    }
    public updateWearable()
    {
        log("updating wearable")
        Canvas.instance.rarityText.text.value = this.item.rarity.toLocaleUpperCase()
        Canvas.instance.nameText.text.value = this.item.metadata.wearable.name

        let pathToImage: string = this.item.image
        var img = new ui.CenterImage(pathToImage, 0.001, true)
        Canvas.instance.icon.image.source = new Texture(pathToImage, { wrap: 0 })
        Canvas.instance.icon.image.sourceHeight = img.image.sourceHeight
        Canvas.instance.icon.image.sourceWidth = img.image.sourceWidth

        Canvas.instance.ownerTextToModify.text.value = this.owner.substring(0, 5) + '...' + this.owner.substring(this.owner.length - 4, this.owner.length)
        Canvas.instance.collectionTextToModify.text.value = this.collection

        Canvas.instance.descriptionTextToModify.text.value = this.item.metadata.wearable.description
        Canvas.instance.descriptionTextToModify.text.textWrapping = true
        Canvas.instance.descriptionTextToModify.text.width = 150
        Canvas.instance.descriptionTextToModify.text.adaptHeight = true
        Canvas.instance.descriptionTextToModify.text.paddingLeft = 0
        Canvas.instance.descriptionTextToModify.text.paddingRight = 0

        Canvas.instance.categoryTextToModify.text.value = this.item.metadata.wearable.category
        Canvas.instance.categoryTextToModify.text.textWrapping = true
        Canvas.instance.categoryTextToModify.text.width = 150
        Canvas.instance.categoryTextToModify.text.adaptHeight = true
        Canvas.instance.categoryTextToModify.text.paddingLeft = 0
        Canvas.instance.categoryTextToModify.text.paddingRight = 0

        // buy label
        let price: Number = Number(this.item.price) / Number(1000000000000000000)

        let buyLabel = 'BUY ' + price.toString()
        let available = true
        if (Number(this.item.available) == 0)
        {
            buyLabel = "Unavailable"
            available = false
        }
        Canvas.instance.buyButton = Canvas.instance.prompt.addButton(
            buyLabel,
            0,
            -250,
            () =>
            {
                Canvas.instance.buyButton.alive = false
                Canvas.instance.prompt.hide()
                this.enabled = true
                if (available)
                {
                    executeTask(async () =>
                    {
                        await crypto.marketplace.executeOrder(
                            this.collectionId,
                            Number(this.item.blockchainId),
                            Number(this.item.price)
                        )
                    })
                }
            }, ui.ButtonStyles.RED
        )
    }
}