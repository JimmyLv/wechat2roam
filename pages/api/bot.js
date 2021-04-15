import start from '../../bot/main'

export default async (req, res) => {
  res.statusCode = 200
  await start()
  res.json({ name: process.env.ROAM_API_GRAPH })
}
