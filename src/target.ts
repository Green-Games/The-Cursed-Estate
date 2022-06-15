import * as utils from '@dcl/ecs-scene-utils'

@Component("Target")
export class Target
{
  private onHitCallback?;
  public points: float = 1;
  constructor(onHitCallback?: (value: float) => void)
  {
    this.points = 1
    this.onHitCallback = onHitCallback;
  }
  setCallback(onHitCallback?: (value: float) => void)
  {
    this.onHitCallback = onHitCallback;
  }
  public hit()
  {
    this.onHitCallback(this.points)
  }
}

export class TargetPath
{
  public direction: boolean = true
  public index: number = 0

  constructor(public path: number[]) { }
  public next(): number
  {
    //if lenght == 1 or index outside lenght
    if (this.path.length === 1 || this.index >= this.path.length)
    {
      this.index = 0
      return 0
    }
    //modify index based on direction
    (this.direction) ? this.index++ : this.index--
    //change direction if end is reached
    if (this.direction && this.index == this.path.length - 1)
    {
      this.direction = false
    }
    else if (!this.direction && this.index === 0)
    {
      this.direction = true
    }
    return this.index
  }
}

export class TargetObject extends Entity
{
  public path: TargetPath
  public speed: number = 1
  public clip: AnimationState

  public child: Entity
  constructor(
    transform?: TransformConstructorArgs,
    public model?: GLTFShape,
    clip?: AnimationState
  )
  {
    super()
    this.child = new Entity()
    this.addComponent(model)

    let anim: Animator = new Animator()
    this.addComponent(anim)
    this.clip = clip
    anim.addClip(this.clip)
    this.clip.reset()
    this.clip.pause()

    this.addComponent(new Transform(transform))
  }
  public playClip()
  {
    this.clip.play(true)
  }
  public move(start: Vector3, end: Vector3, callback?: () => void): void
  {
    this.addComponentOrReplace(new utils.MoveTransformComponent(start, end, 1 / this.speed, () => callback()))
  }
}