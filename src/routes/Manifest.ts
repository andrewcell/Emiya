import { Request, Response, Router} from 'express';


const router = Router();

const villagers = {
    'background_color': 'white',
    'description': 'Unofficial Villagers management app',
    'display': 'fullscreen',
    'icons': [
      {
        'src': '/images/128x128.png',
        'sizes': '128x128',
        'type': 'image/png'
      },{
        'src': '/images/128x128.png',
        'sizes': '512x512',
        'type': 'image/png'
      }
    ],
    'name': 'Emiya Villagers',
    'short_name': 'Villagers',
    'start_url': '/villagers'
}

router.get('/villagers.json', (req: Request, res: Response) => {
    const custom = villagers;
    custom.name = res.__('manifest.villagers.name');
    custom.short_name = res.__('manifest.villagers.shortname');
    custom.description = res.__('manifest.villagers.description');
    // custom.icons[0].src = `/images/${code.png}`;
    return res.json(villagers);
});

export default router;

