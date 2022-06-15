import * as utils from '@dcl/ecs-scene-utils'
import { getUserData } from '@decentraland/Identity'
export class Coffin extends Entity
{
    public coffinModel: GLTFShape = new GLTFShape('models/coffin.glb')
    public coffinAudioClipClosed = new AudioClip('sounds/closed coffin.mp3')
    public coffinAudioClipOpen = new AudioClip('sounds/open coffin.mp3')

    public coffinClip: AnimationState = new AnimationState("coffin_lid|Take 001|BaseLayer", { looping: false, speed: 2 })
    constructor(public filter: string)
    {
        super()
        engine.addEntity(this)
        this.addComponent(new Transform({
            position: new Vector3(-1, 5.400, 3.340),
            scale: new Vector3(1.000, 1.000, 1.000),
            rotation: new Quaternion().setEuler(0.000, 270.000, 0.000)
        }))

        this.addComponent(this.coffinModel)
        this.addComponent(new Animator())
        this.getComponent(Animator).addClip(this.coffinClip)
        this.coffinClip.reset()
        this.coffinClip.pause()


        let coffinAudioSourceClosed = new AudioSource(this.coffinAudioClipClosed)
        let coffinAudioSourceOpen = new AudioSource(this.coffinAudioClipOpen)

        this.addComponent(coffinAudioSourceClosed)
        this.addComponent(
            new OnPointerDown(() =>
            {
                log('triggered scanner')
                this.addComponentOrReplace(
                    new utils.Delay(100, async () =>
                    {
                        const userData = await getUserData()
                        // log('Currently wearing: ', userData.avatar.wearables)
                        let result = false
                        for (const wearable of userData.avatar.wearables)
                        {
                            if (wearable === filter)
                            {
                                result = true
                                break
                            }
                        }
                        if (result)
                        {
                            this.coffinClip.play(true)
                            this.addComponentOrReplace(coffinAudioSourceOpen).playOnce()
                            // coffinAudioSourceOpen.playOnce()
                            this.removeComponent(OnPointerDown)
                        }
                        else
                        {
                            coffinAudioSourceClosed.playOnce()
                        }
                    })
                )
            })
        )
    }
}