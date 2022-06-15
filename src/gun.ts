@Component("Gun")
export class Gun
{
    public gunShot: Entity
    public enabled: boolean
    public gameStarted: boolean = false
    public audioSource: AudioSource = new AudioSource(new AudioClip('sounds/shot.mp3'))
    constructor()
    {
        // Sounds
        const gunShot = new Entity()
        gunShot.addComponent(this.audioSource)
        gunShot.addComponent(new Transform())
        engine.addEntity(gunShot)
        gunShot.setParent(Attachable.AVATAR)
        this.gunShot = gunShot
        this.enabled = false
    }
    public enableGun()
    {
        // Input.instance.subscribe('BUTTON_DOWN', ActionButton.POINTER, true, (e) => this.use(e))
        this.enabled = true
    }
    public disableGun()
    {
        // Input.instance.unsubscribe('BUTTON_DOWN', ActionButton.POINTER, (e) => this.use(e))
        this.enabled = false
    }
    public onStartRound()
    {
        Input.instance.subscribe('BUTTON_DOWN', ActionButton.POINTER, true, () => this.use())
        this.gameStarted = true
    }
    public onEndRound()
    {
        Input.instance.unsubscribe('BUTTON_DOWN', ActionButton.POINTER, () => this.use())
        this.gameStarted = false
    }
    public use(): void
    {
        if (this.canShoot())
        {
            this.playSound()
        }
    }
    public playSound()
    {
        this.audioSource.playOnce()
    }
    public canShoot(): boolean
    {
        return this.enabled && this.gameStarted
    }
}
