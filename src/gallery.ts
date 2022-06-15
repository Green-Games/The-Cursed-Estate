export class Gallery extends Entity
{
    public nftsEntity: Entity[] = []
    public transforms: Transform[] = [
        new Transform({
            position: new Vector3(15.300, 7.400, 3.250),
            scale: new Vector3(2.500, 2.500, 1.000),
            rotation: new Quaternion().setEuler(0.000, 0.000, 0.000),
        }),
        new Transform({
            position: new Vector3(9.300, 7.400, 3.250),
            scale: new Vector3(2.500, 2.500, 1.000),
            rotation: new Quaternion().setEuler(0.000, 0.000, 0.000),
        }),
        new Transform({
            position: new Vector3(12.300, 7.400, .003),
            scale: new Vector3(2.500, 2.500, 1.000),
            rotation: new Quaternion().setEuler(0.000, 180, 0.000),
        }),
        new Transform({
            position: new Vector3(10.800, 7.400, -0.400),
            scale: new Vector3(2.500, 2.500, 1.000),
            rotation: new Quaternion().setEuler(0.000, 0.000, 0.000),
        }),
        new Transform({
            position: new Vector3(13.880, 7.400, -4.5),
            scale: new Vector3(2.500, 2.500, 1.000),
            rotation: new Quaternion().setEuler(0.000, 90.000, 360.000),
        }),
        new Transform({
            position: new Vector3(10.500, 7.400, -8.280),
            scale: new Vector3(2.500, 2.500, 1.000),
            rotation: new Quaternion().setEuler(0.000, 180.000, 0.000),
        }),
        new Transform({
            position: new Vector3(6, 7.400, -8.280),
            scale: new Vector3(2.500, 2.500, 1.000),
            rotation: new Quaternion().setEuler(0.000, 180.000, 0.000),
        })
    ]
    constructor(nfts?: string[])
    {
        super()
        engine.addEntity(this)
        if (nfts.length == 0)
            return
        this.transforms.forEach((v, i) =>
        {
            let e = new Entity()
            e.addComponent(v)
            e.addComponent(new NFTShape(nfts[i % nfts.length], { style: PictureFrameStyle.Gold_Carved }))
            engine.addEntity(e)
            e.setParent(this)
            e.addComponent(new OnPointerDown(() => { openNFTDialog(nfts[i % nfts.length]) }))
            this.nftsEntity.push(e)
        })
    }
}