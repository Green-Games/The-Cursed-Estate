import * as utils from '@dcl/ecs-scene-utils'
export abstract class Ghost extends Entity
{
    public model: GLTFShape = new GLTFShape('models/ghost.glb')

    public audioClip: AudioClip = new AudioClip('sounds/ghost.mp3')
    public audioSource: AudioSource = new AudioSource(this.audioClip)

    public animator: Animator = new Animator()
    public animationClip: AnimationState

    constructor(animationName?: string)
    {
        super()

        this.addComponent(new Transform({ position: new Vector3(2, 0, 2) }))

        this.model.withCollisions = false
        this.addComponent(this.model)

        this.animationClip = new AnimationState(animationName, { looping: true })
        this.animator.addClip(this.animationClip)
        this.addComponent(this.animator)
        this.animationClip.playing = true

        this.addComponent(this.audioSource)
        this.audioSource.playing = true
        this.audioSource.volume = 0.7

        engine.addEntity(this)
    }

    public abstract move()

    public faceDirection(current: Vector3, next: Vector3)
    {
        let transform = this.getComponent(Transform)
        transform.lookAt(next)
    }
}
export class GhostRandomPoints extends Ghost
{
    public delta: Vector3
    constructor(public minPos: Vector3, maxPos: Vector3, animationName?: string)
    {
        super(animationName)
        this.delta = maxPos.subtract(minPos)
        this.move()
    }
    public move()
    {
        let oldPosition: Vector3 = this.getComponent(Transform).position
        let newPosition: Vector3 = this.minPos.add(new Vector3(Math.random() * this.delta.x, Math.random() * this.delta.y, Math.random() * this.delta.z))

        //move always at the same speed
        let timeToReach: float = Vector3.Distance(oldPosition, newPosition) / 2.5

        this.addComponentOrReplace(new utils.MoveTransformComponent(oldPosition, newPosition, timeToReach, () => { this.move() }))
        this.faceDirection(oldPosition, newPosition)
    }
}
export class GhostWithPath extends Ghost
{
    constructor(public points: Vector3[], animationName?: string)
    {
        super(animationName)
        this.move()
    }
    public move()
    {
        this.addComponent(this.createPath())
    }
    public createPath(): utils.FollowPathComponent
    {
        return new utils.FollowPathComponent(this.points, 20,
            () =>
            {
                this.addComponentOrReplace(this.createPath());
                this.faceDirection(this.points[0], this.points[1])
            },
            (current, next) => this.faceDirection(current, next))
    }
}
export class NotMovingGhost extends Ghost
{
    constructor(animationName?: string)
    {
        super(animationName)
        this.move()
    }
    public move()
    {
    }
}