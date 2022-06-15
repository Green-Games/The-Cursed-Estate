import * as utils from '@dcl/ecs-scene-utils'

export class GlobalSounds extends Entity
{
    public minute: number = 1000 * 60
    public ambientSound: Entity = new Entity()
    public woodCreak: Entity = new Entity()
    public wolfHowl: Entity = new Entity()
    constructor()
    {
        super()
        engine.addEntity(this)

        this.makeSounds(this.woodCreak, 'sounds/wood creak.mp3', false, 0.5)
        engine.addEntity(this.woodCreak)

        this.makeSounds(this.wolfHowl, 'sounds/external wolf howl.mp3', false, 1)
        engine.addEntity(this.wolfHowl)

        this.makeSounds(this.ambientSound, 'sounds/external atmosphere.mp3', true, 0, 0.15)
        engine.addEntity(this.ambientSound)

        this.woodCreak.setParent(Attachable.AVATAR)
        this.wolfHowl.setParent(Attachable.AVATAR)
        this.ambientSound.setParent(Attachable.AVATAR)
    }
    public makeSounds(e: Entity, clipName: string, loop: boolean = false, minDelay: number = 0.5, volume: number = 1)
    {
        let source: AudioSource = new AudioSource(new AudioClip(clipName))
        source.loop = loop
        source.volume = volume
        e.addComponent(source)
        if (loop)
        {
            source.playing = true
        }
        else
        {
            let n = this.minute * (Math.random() + minDelay)
            e.addComponent(new utils.Interval(n, () => source.playOnce()))
        }
    }
}