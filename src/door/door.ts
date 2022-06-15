export class Door extends Entity
{
    public doorSound: AudioClip = new AudioClip('sounds/doorSqueak.mp3')
    public doorAudio: AudioSource = new AudioSource(this.doorSound)
    public anim: Animator = new Animator()
    public clip: AnimationState = new AnimationState("Ctrl_door|Take 001|BaseLayer", { looping: false, speed: 4 })
    public alreadyOpen: boolean = false
    constructor(transform?: Transform, model?: GLTFShape)
    {
        super()

        // engine.addEntity(this)
        this.addComponent(transform)
        this.addComponent(model)

        this.addComponent(this.anim)
        this.anim.addClip(this.clip)
        this.clip.reset()

        this.addComponent(this.doorAudio)
        this.addComponent(new OnPointerDown(() =>
        {
            this.openDoor()
        }))
    }
    public openDoor()
    {
        if (this.alreadyOpen)
            return

        this.alreadyOpen = true
        this.doorAudio.playOnce();
        this.clip.play(true)
        this.removeComponent(OnPointerDown)
    }
}