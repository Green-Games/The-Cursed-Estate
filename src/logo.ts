export class Logo extends Entity
{
    constructor(transform: Transform, model: GLTFShape, link: string)
    {
        super()
        this.addComponent(transform)
        this.addComponent(model)
        this.addComponent(new OnPointerDown(() => openExternalURL(link)))
    }
}