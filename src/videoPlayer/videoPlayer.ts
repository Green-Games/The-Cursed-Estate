export class VideoPlayer extends Entity
{
    public audioClip: AudioClip = new AudioClip('sounds/TV noise.mp3')
    public audioSource: AudioSource = new AudioSource(this.audioClip)
    constructor(video: string)
    {
        super()
        const myVideoClip = new VideoClip(video)
        // #2
        const myVideoTexture = new VideoTexture(myVideoClip)
        myVideoTexture.loop = true
        myVideoTexture.volume = .0
        // #3
        const myMaterial = new Material()
        myMaterial.albedoTexture = myVideoTexture
        myMaterial.roughness = 1
        myMaterial.specularIntensity = 0
        myMaterial.metallic = 0
        // #4
        this.addComponent(new PlaneShape())
        this.addComponent(
            new Transform({
                position: new Vector3(12.830, 2.195, 6.9),
                rotation: Quaternion.Euler(0, 180, 0),
                scale: new Vector3(.91, 0.75, 1)
            })
        )
        this.addComponent(myMaterial)
        this.addComponent(
            new OnPointerDown(() =>
            {
                myVideoTexture.playing = !myVideoTexture.playing
                this.audioSource.playing = !this.audioSource.playing
            })
        )
        engine.addEntity(this)
        // #5
        myVideoTexture.play()
        this.addComponent(this.audioSource)
        this.audioSource.volume = .3
        this.audioSource.loop = true
        this.audioSource.playing = true
    }
}