import { Request, Response, Router} from 'express';

const router = Router();

router.get('/:locale', (req: Request, res: Response) => {
  if (req.params.locale == null) {
    return res.render('error');
  }
  let locale = 'en_US'
  switch (req.params.locale) {
    case 'ko':
      locale = 'ko_KR';
      break;
    case 'ja':
      locale = 'ja_JP';
      break;
    default:
      break;
  }
  res.cookie('locale', locale);
  res.redirect('back');
});
export default router;