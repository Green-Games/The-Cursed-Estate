import * as ui from "@dcl/ui-scene-utils"
export class Canvas
{
    public static instance: Canvas = new Canvas()
    public prompt = new ui.CustomPrompt(ui.PromptStyles.DARK, 400, 600, true)
    public rarityText: ui.CustomPromptText = new ui.CustomPromptText(this.prompt, "rarity", 0, 290, true, Color4.Yellow())
    public nameText: ui.CustomPromptText = new ui.CustomPromptText(this.prompt, "name", 0, 270, true)
    public icon: ui.CustomPromptIcon = new ui.CustomPromptIcon(this.prompt, new Texture(""), 0, 100, 250, 250, { sourceHeight: 1024, sourceWidth: 1024 })

    private ownerText: ui.CustomPromptText = new ui.CustomPromptText(this.prompt, "Owner", -100, -50, true)
    public ownerTextToModify: ui.CustomPromptText = new ui.CustomPromptText(this.prompt, "wner", -100, -70, true)
    private collectionText: ui.CustomPromptText = new ui.CustomPromptText(this.prompt, "Collection", 100, -50, true)
    public collectionTextToModify: ui.CustomPromptText = new ui.CustomPromptText(this.prompt, "asd", 100, -70, true)
    private descriptionText: ui.CustomPromptText = new ui.CustomPromptText(this.prompt, "Description", -100, -110, true)
    public descriptionTextToModify: ui.CustomPromptText = new ui.CustomPromptText(this.prompt, "asd", -100, -170, true)
    private categoryText: ui.CustomPromptText = new ui.CustomPromptText(this.prompt, "Category", 100, -110, true)
    public categoryTextToModify: ui.CustomPromptText = new ui.CustomPromptText(this.prompt, "asd", 100, -150, true)
    public buyButton: ui.CustomPromptButton
}