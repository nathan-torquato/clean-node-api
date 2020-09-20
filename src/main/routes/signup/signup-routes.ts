import { Request, Response, Router } from 'express'

export const signUpRoutes = (router: Router): void => {
  router.post('/signup', (req: Request, res: Response) => {
    res.json({ ok: 'ok' })
  })
}
