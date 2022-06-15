import * as utils from '@dcl/ecs-scene-utils'
import * as ui from '@dcl/ui-scene-utils'
import { Gun } from "src/gun";
import { Round } from "src/round";
import { ScoreController } from "src/score";
import { Target, TargetObject, TargetPath } from "src/target";

export class ShootingRange extends Entity
{
    public widht: number = 3
    public height: number = 3
    public delta: number = 3

    public stage: number = 0
    public targetPositions: Vector3[] = []

    public targetPool: TargetObject[] = []
    public targetUsed: number = 0

    //round variables
    public rounds: Round[]
    public roundIndex: number = 0
    // public round: Round
    public targetHitted: number = 0
    public targetHitClip = new AudioClip('sounds/target_hit.mp3')
    public targetHitSource = new AudioSource(this.targetHitClip)

    public scoreController: ScoreController

    public gun: Gun

    public triggerArea: Entity

    public isStarted: boolean = false
    public targetModelZombie: GLTFShape = new GLTFShape('models/target_zombie.glb')
    public targetModelWherewolf: GLTFShape = new GLTFShape('models/target_werewolf.glb') //no, werewolf
    public targetClip: AnimationState = new AnimationState("Standing", { looping: false, speed: 4 })

    public startButton: Entity

    constructor(transform: TranformConstructorArgs, gun: Gun, text: Entity, scoreController: ScoreController, dimensions?: [number, number])
    {
        super()
        this.addComponent(new Transform(transform))
        engine.addEntity(this)
        this.gun = gun
        this.widht = dimensions[0]
        this.height = dimensions[1]

        this.scoreController = scoreController

        //Set array of positions
        for (let i = 0; i < this.widht; i++)
        {
            for (let j = 0; j < this.height; j++)
            {
                this.targetPositions.push(new Vector3(this.toRelativeValue(i - this.widht / 2), 0, this.toRelativeValue(j - this.height / 2)))
            }
        }
        //Create the start button
        this.startButton = new Entity()
        this.startButton.addComponent(new GLTFShape('models/doorbell.glb'))
        this.startButton.addComponent(new Transform({ position: new Vector3(0.000, 0.800, -5.400), scale: new Vector3(1.2, 1.2, 1.2) }))
        engine.addEntity(this.startButton)
        this.startButton.setParent(this)
        text.setParent(this.startButton)

        //sounds
        let soundEntity = new Entity()
        engine.addEntity(soundEntity)
        soundEntity.addComponent(this.targetHitSource)
        this.targetHitSource.volume = .45
        soundEntity.setParent(Attachable.AVATAR)

        //start button glowthing
        let startIcon = new Entity()
        engine.addEntity(startIcon)
        startIcon.addComponent(new Transform())
        startIcon.addComponent(new utils.KeepRotatingComponent(Quaternion.Euler(0, 45, 0)))
        startIcon.setParent(this.startButton)
        startIcon.addComponent(new GLTFShape('models/doorbell icon.glb'))

        //set behaviour of start button
        this.startButton.addComponent(new OnPointerDown((e) =>
        {
            this.startButton.addComponentOrReplace(new AudioSource(new AudioClip('sounds/bell.wav')))

            if (this.isStarted)
                return;

            this.startGame()
            this.startButton?.getComponent(AudioSource)?.playOnce()
        }, { button: ActionButton.PRIMARY, hoverText: "Start Game" }))

        //trigger area for first person camera and hide avatars
        let triggerSize: Vector3 = new Vector3(11.000, 4.000, 15.5)
        this.triggerArea = new Entity()
        engine.addEntity(this.triggerArea)
        this.triggerArea.addComponent(new Transform(
            {
                position: new Vector3(0.000, 2.000, -3.000),
                scale: triggerSize
            }))
        this.triggerArea.setParent(this)
        this.triggerArea.addComponent(
            new CameraModeArea({
                area: { box: triggerSize },
                cameraMode: CameraMode.FirstPerson,
            })
        )
        this.triggerArea.addComponent(
            new AvatarModifierArea({
                area: { box: triggerSize },
                modifiers: [AvatarModifiers.HIDE_AVATARS],
            })
        )
    }
    public startGame(): TargetObject[]
    {
        this.targetUsed = 0
        this.targetPool.forEach((e, i, a) =>
        {
            e.removeComponent(utils.MoveTransformComponent);
        })

        ui.displayAnnouncement("Start Game")

        this.roundIndex = 0
        this.isStarted = true

        this.scoreController.resetScore()
        this.scoreController.startRound()
        this.startRound(this.rounds[this.roundIndex])
        return this.targetPool
    }
    public startRound(round: Round)
    {
        this.targetClip.reset()
        this.targetClip.pause()

        ui.displayAnnouncement("Round " + (this.roundIndex + 1), 1)

        this.targetHitted = 0
        let targets: TargetObject[] = []

        for (let i = 0; i < round.paths.length; i++)
        {
            targets.push(this.createTarget(round.paths[i]))
        }
        utils.setTimeout(1000, () =>
        {
            this.gun.onStartRound()
            targets.forEach((v) => v.clip.play(true))
        })
    }
    public createTarget(targetPath: TargetPath): TargetObject
    {
        let target: TargetObject
        let model = Math.round(Math.random() * 100) < 50 ? this.targetModelZombie : this.targetModelWherewolf
        if (this.targetUsed >= this.targetPool.length)
        {
            this.targetPool.push(new TargetObject(
                {
                    position: this.targetPositions[targetPath.path[0]], scale: new Vector3(.7, 0.7, 0.7), rotation: Quaternion.Euler(0, 180, 0)
                },
                model,
                this.targetClip))
        }

        target = this.targetPool[this.targetUsed]
        engine.addEntity(target)
        this.targetClip.reset()
        this.targetClip.pause()
        this.targetUsed++

        target.setParent(this)
        target.addComponentOrReplace(new Target((v) =>
        {
            // this.targetHitSource.playOnce()
            this.targetHitted++;
            this.endRound();
            this.destroyTarget(target.uuid)
        }))
        target.addComponentOrReplace(new OnPointerDown(() =>
        {
            if (this.gun.canShoot())
            {
                this.targetHitSource.playOnce()
                this.gun.playSound()
                this.targetHitted++;
                this.destroyTarget(target.uuid)
                this.endRound();
            }
        },
            {
                distance: 20,
                showFeedback: false,
                button: ActionButton.POINTER
            }))

        targetPath.index = 0
        targetPath.direction = true

        this.moveTarget(targetPath, target)

        return target
    }
    public endRound()
    {
        if (this.targetHitted < this.rounds[this.roundIndex].paths.length)
        {
            return
        }
        log("round ended")
        this.gun.onEndRound()
        this.roundIndex++
        if (this.roundIndex >= this.rounds.length)
        {
            this.endGame()
            ui.displayAnnouncement("Game Ended", 1)
            return
        }
        // ui.displayAnnouncement("Round " + this.roundIndex + " Ended")
        this.scoreController.endRound()

        this.startRound(this.rounds[this.roundIndex])
    }
    public interruptGame()
    {
        //do nothing if the game is not started
        if (!this.isStarted)
            return
        this.gun.onEndRound()
        this.endGame()
        this.targetPool.forEach((v) => { if (v.alive) engine.removeEntity(v) })
    }
    public endGame()
    {
        log("game ended")
        this.scoreController.end()
        this.isStarted = false
    }
    public moveTarget(targetPath: TargetPath, target: TargetObject)
    {
        target.move(this.targetPositions[targetPath.path[targetPath.index]], this.targetPositions[targetPath.path[targetPath.next()]], () => this.moveTarget(targetPath, target))
    }
    private toRelativeValue(val: number): number
    {
        return Math.round(val) * this.delta
    }
    public destroyTarget(id: string): void
    {
        engine.removeEntity(engine.getEntitiesWithComponent(Target)[id])
    }
}