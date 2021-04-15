import start from '../../bot/main'

export default (req, res) => {
  res.statusCode = 200
  start()
  res.json({ name: process.env.ROAM_API_GRAPH })
}
