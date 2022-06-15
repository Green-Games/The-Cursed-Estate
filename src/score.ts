@Component('scoreController')
export class ScoreController
{
  public playerScore = 0;
  public playerTimeSystem: PlayerTimeSystem
  constructor(public text?: TextShape)
  {
    this.playerTimeSystem = new PlayerTimeSystem(text)
  }
  public startRound()
  {
    // this.playerTimeSystem.reset()
    engine.addSystem(this.playerTimeSystem)
  }
  public end()
  {
    this.endRound()
    engine.removeSystem(this.playerTimeSystem)
  }
  public endRound()
  {
    this.playerScore = Number((Math.round(this.playerTimeSystem.getTime() * 100) / 100).toFixed(2))
    this.text.value = this.playerScore.toString()
    // engine.removeSystem(this.playerTimeSystem)
  }
  public resetScore()
  {
    this.end()
    this.playerScore = 0
    this.text.value = this.playerScore.toString()
    this.playerTimeSystem.reset()
  }
}
export class PlayerTimeSystem implements ISystem
{
  public time: number = 0
  constructor(public text?: TextShape)
  {

  }
  reset()
  {
    this.time = 0
  }
  update(dt: number)
  {
    this.time += dt
    this.text.value = this.getTime().toString()
  }
  public getTime(): number
  {
    return Number((Math.round(this.time * 100) / 100).toFixed(2))
  }
}