import * as utils from '@dcl/ecs-scene-utils'
import { _Wearable } from './wearable'
import * as f from './store/fetch'
export class Wardrobe extends Entity
{
    public animator: Animator
    public openClip: AnimationState = new AnimationState("opening", { looping: false })
    public closeClip: AnimationState = new AnimationState("closing", { looping: false })

    public audioClip: AudioClip = new AudioClip('sounds/wardrobe.mp3')
    public audioSource: AudioSource = new AudioSource(this.audioClip)

    public isOpen: boolean = false

    public enabled: boolean = true

    public wearables: _Wearable[] = [];

    constructor(model: GLTFShape, collectionURN: string, transform?: TransformConstructorArgs, public delay: number = 1100)
    {
        super()
        engine.addEntity(this)
        this.addComponent(new Transform(transform))
        this.addComponent(model)

        this.addComponent(this.audioSource)

        this.animator = new Animator()
        this.addComponent(this.animator)

        this.openClip.reset()
        this.openClip.pause()

        this.animator.addClip(this.openClip)
        this.animator.addClip(this.closeClip)

        this.addComponent(new OnPointerDown(() => this.clicked()))

        let collection = this.waitForCollection(collectionURN)
        collection.then((c: f.Collection) =>
        {
            let i = 0
            for (const item of c.items)
            {
                const wearable = new _Wearable(item, c.name, c.id, c.owner)
                this.wearables.push(wearable)
                engine.addEntity(wearable)
                wearable.setParent(this)
                i++
            }
        })
    }
    async waitForCollection(collectionURN: string)
    {
        return await f.collection(collectionURN);
    }
    public clicked()
    {
        if (!this.enabled)
            return
        this.enabled = false
        if (this.isOpen)
        {
            this.close()
        }
        else
        {
            this.open()
        }
        this.isOpen = !this.isOpen
    }
    public open()
    {
        this.audioSource.playOnce()
        this.openClip.play(true)
        this.enableAfterDelay()
        // this.addComponent(new utils.Delay(this.delay, () => this.addComponent(new OnPointerDown(() => this.clicked()))))
    }
    public enableAfterDelay()
    {
        this.addComponent(new utils.Delay(this.delay, () => this.enabled = true))
    }
    public close()
    {
        this.audioSource.playOnce()
        this.closeClip.play(true)
        this.enableAfterDelay()
        // this.addComponent(new utils.Delay(this.delay, () => this.addComponent(new OnPointerDown(() => this.clicked()))))
    }
}