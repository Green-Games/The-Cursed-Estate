import { Gun } from './gun'
import { Round } from './round'
import { ShootingArea } from './shootingRange/shootingArea'
import { ShootingRange } from './shootingRange/shootingRange'
import { ScoreController } from './score'
import { TargetObject, TargetPath } from './target'
import { Wardrobe } from './wardrobe'
import * as utils from '@dcl/ecs-scene-utils'
import { getUserData } from '@decentraland/Identity'
import { VideoPlayer } from './videoPlayer/videoPlayer'
import { DanceFloor } from './danceAreas'
import { createDispenser } from './booth/dispenser'
import { Gallery } from './gallery'
import { Door } from './door/door'
import { ButlerNPC } from './npc'
import { GlobalSounds } from './globalSound'
import { GhostRandomPoints, GhostWithPath, NotMovingGhost } from './ghost'
import { Logo } from './logo'
import { Dash_Tweaker } from 'dcldash'
import { Coffin } from './coffin/coffin'

let globalSounds = new GlobalSounds()

//#region house
let house = new Entity()
engine.addEntity(house)
house.addComponent(new Transform({ position: new Vector3(16, 0, 24), rotation: Quaternion.Euler(0, -90, 0) }))
house.addComponent(new GLTFShape('models/house.glb'))
log("house")

let terrain = new Entity()
engine.addEntity(terrain)
terrain.addComponent(new GLTFShape('models/ground.glb'))
terrain.addComponent(new Transform({ position: new Vector3(0, 0, 0) }))
log("terrain")
terrain.setParent(house)

let assets = new Entity()
engine.addEntity(assets)
assets.setParent(house)
assets.addComponent(new Transform({ position: new Vector3(0, 0, 0) }))
let assetsModel = new GLTFShape('models/assets.glb')
assetsModel.withCollisions = true
assets.addComponent(assetsModel)
log("assets")

let veg = new Entity()
engine.addEntity(veg)
veg.setParent(house)
veg.addComponent(new Transform({ position: new Vector3(0, 0, 0) }))
let vega = new GLTFShape('models/vegetation.glb')
veg.addComponent(vega)
log("vegetation")
//#endregion

//#region coffin
const filter: string = 'urn:decentraland:off-chain:base-avatars:black_sun_glasses'
let coffin = new Coffin(filter)
coffin.setParent(house)
log("coffin")
//#endregion

//#region danceFloor
let danceFloor = new DanceFloor(
    new Transform({
        position: new Vector3(-5.900, 0.560, -1.500),
        scale: new Vector3(1.000, 1.000, 1.000),
        rotation: new Quaternion().setEuler(0.000, 190.000, 0.000)
    }),
    new GLTFShape('models/area_dance_carpet.glb'))
engine.addEntity(danceFloor)
danceFloor.setParent(house)
log("dance floor")
//#endregion

//#region wardrobe
let wardrobe = new Wardrobe(new GLTFShape('models/wardrobe.glb'), "urn:decentraland:matic:collections-v2:0x499b228e842685fe09067490eca0c177326fba92", {
    position: new Vector3(0.630, 5.440, -7.000),
    scale: new Vector3(1.000, 1.000, 1.000),
    rotation: new Quaternion().setEuler(0.000, 31.000, 0.000)
})
wardrobe.setParent(house)
log("wardrobe")
//#endregion

//#region mainDoor
export let door = new Door(new Transform({ position: new Vector3(-7.25, .61, 5.6) }), new GLTFShape('models/door.glb'))
engine.addEntity(door)
door.setParent(house)
log("mainDoor")
//#endregion

//#region video
const videoPlayer = new VideoPlayer('https://player.vimeo.com/external/715281872.m3u8?s=dc804141c237fd827eeeeb29c3164f4e268170c2')
videoPlayer.setParent(house)
log("video")
//#endregion

//#region Shooting
// Cache target models on load otherwise the first target model won't appear instantly when instantiated
const zombieShape = new GLTFShape('models/target_zombie.glb')
const wShape = new GLTFShape('models/target_werewolf.glb')
const anim = new AnimationState("Standing", { looping: false, speed: 4 })
const zMC = new TargetObject({}, zombieShape, anim)
const wMC = new TargetObject({}, wShape, anim)
engine.addEntity(zMC)
engine.addEntity(wMC)
zMC.getComponent(Transform).scale.setAll(0)
wMC.getComponent(Transform).scale.setAll(0)

//Settings
const widht = 3
const height = 3

//Rounds
let rounds: Round[] = []
let paths: TargetPath[] = []
//round 1
paths.push(new TargetPath([0, 1, 2]))
paths.push(new TargetPath([5, 4, 3]))
paths.push(new TargetPath([7, 8, 7, 6]))
rounds.push(new Round(paths))
//round 2
paths = []
paths.push(new TargetPath([0, 4, 8]))
paths.push(new TargetPath([1, 7, 8]))
paths.push(new TargetPath([2, 1, 5, 7]))
rounds.push(new Round(paths))
//round 3
paths = []
paths.push(new TargetPath([1, 5, 7, 3]))
paths.push(new TargetPath([0, 2, 8, 6]))
paths.push(new TargetPath([0, 4, 8]))
paths.push(new TargetPath([6, 4, 2]))
rounds.push(new Round(paths))
//round 4
paths = []
paths.push(new TargetPath([0, 1, 5, 7, 3, 2, 8, 6, 4]))
paths.push(new TargetPath([0, 1, 5, 7, 3, 2, 8, 6, 4]))
paths.push(new TargetPath([0, 1, 5, 7, 3, 2, 8, 6, 4]))
paths.push(new TargetPath([0, 1, 5, 7, 3, 2, 8, 6, 4]))
rounds.push(new Round(paths))

const text = new Entity()
engine.addEntity(text)
text.addComponent(new Transform({ position: new Vector3(0.000, 2.300, 8.800) }))
let t = new TextShape("0")
t.font = new Font(Fonts.SansSerif_Bold)
text.addComponent(t)

const player = new Entity()
engine.addEntity(player)
player.addComponent(new Gun())
player.addComponent(new ScoreController(t))

const shootingArea = new ShootingArea(
    {
        position: new Vector3(-7.000, 5.450, 2.900),
        scale: new Vector3(11, 0.050, 5.000),
        rotation: new Quaternion().setEuler(0.000, 0.000, 0.000),
    },
    new Vector3(5, 2, 11), new Color3(1, 0, 0))
shootingArea.setParent(house)

const shootingRange = new ShootingRange(
    {
        position: new Vector3(-7, 5.5, -5),
        rotation: Quaternion.Euler(0, 180, 0)
    },
    player.getComponent(Gun),
    text,
    player.getComponent(ScoreController),
    [widht, height])
shootingRange.rounds = rounds
shootingRange.setParent(house)

shootingArea.setEnterCallback(() => player.getComponent(Gun).enableGun())
shootingArea.setExitCallback(() =>
{
    player.getComponent(Gun).disableGun();
    shootingRange.interruptGame()
})
//#endregion

//#region NPC
const butlerNPC = new ButlerNPC(
    {
        position: new Vector3(7, 0.000, 18),
        scale: new Vector3(1.3, 1.3, 1.3)
    },
    "models/NPC.glb",
    {
        idleAnim: `Idle`,
        hoverText: "Talk to the cute NPC",
        faceUser: true,
        coolDownDuration: 1,
        reactDistance: 5.5,
        portrait: {
            path: 'images/portraits/buttler.png',
            height: 256,
            width: 256,
            section: {
                sourceHeight: 512,
                sourceWidth: 512,
            },
        }
    },
    () => { door.openDoor(); butlerNPC.answered = true })
//#endregion

//#region POAP
let dispenser = createDispenser(
    {
        position: new Vector3(12.940 - 24, 1.400, 11.540 - 16),
        scale: new Vector3(1.000, 1.000, 1.000),
        rotation: new Quaternion().setEuler(0.000, 0.000, 0.000),
    },
    'acd27e4b-24bd-4040-b715-c0e11e863fb0'
)
dispenser.setParent(house)
//#endregion

//#region NFT Gallery
const gallery = new Gallery(["ethereum://0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/558536", "ethereum://0x6b00de202e3cd03c523ca05d8b47231dbdd9142b/509", "ethereum://0x6b00de202e3cd03c523ca05d8b47231dbdd9142b/257", "ethereum://0x06012c8cf97bead5deae237070f9587f8e7a266d/204635"])
gallery.setParent(house)
//#endregion

//#region ghost
let ghostRandomPoints = new GhostRandomPoints(new Vector3(5, 0, 5), new Vector3(27.5, 7, 42), 'Idle_a')
let ghostWithPath = new GhostWithPath(
    [
        new Vector3(14.2, 5.5, 39.5),
        new Vector3(14.2, 5.5, 10),
        new Vector3(17.5, 0.8, 10),
        new Vector3(17.5, 0.8, 34.5),
        new Vector3(23.25, 0.8, 34.5),
        new Vector3(23.25, 3.2, 39.5),
        new Vector3(14.2, 5.5, 39.5)
    ],
    'Idle_a')
let notMovingGhost = new NotMovingGhost('Idle_a')
notMovingGhost.getComponent(Transform).position = new Vector3(12.500, 0.800, 38.000)
notMovingGhost.getComponent(Transform).rotation = new Quaternion().setEuler(0.000, 275.000, 0.000)
notMovingGhost.addComponentOrReplace(new GLTFShape('models/ghost_sit.glb'))
// Dash_Tweaker(notMovingGhost)
//#endregion

//#region wonderbox labs logo
let logo1 = new Logo(new Transform(
    {
        position: new Vector3(8.930, 0.000, -6.600),
        scale: new Vector3(1.000, 1.000, 1.000),
        rotation: new Quaternion().setEuler(45.000, 55.000, 0.000),
    }),
    new GLTFShape('models/logo.glb'), 'https://www.wonderboxlabs.com/')
engine.addEntity(logo1)
logo1.setParent(house)
let logo2 = new Logo(new Transform(
    {
        position: new Vector3(-0.37, 5.430, -7.93),
        scale: new Vector3(1.000, 1.000, 1.000),
        rotation: new Quaternion().setEuler(325.000, 360.000, 330.000),
    }),
    new GLTFShape('models/logo.glb'), 'https://www.wonderboxlabs.com/')
engine.addEntity(logo2)
logo2.setParent(house)
//#endregion