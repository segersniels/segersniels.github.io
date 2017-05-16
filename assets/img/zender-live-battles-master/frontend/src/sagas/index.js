import AuthBattle from './authBattle';
import Battle from './battle';
import PusherChannel from './pusher';
import Session from './session';
import Sticker from './sticker';
import UI from './ui';

const initSagas = (config) => {
	const modules = {};
	
	modules.authBattle = new AuthBattle(config);
	modules.battle = new Battle(config);
	modules.session = new Session(config);
	modules.sticker = new Sticker(config);
	modules.ui = new UI(config);

	if (config.pusher) {
		modules.pusher = new PusherChannel(config);
	}
	
	return modules;
};

export default initSagas;
