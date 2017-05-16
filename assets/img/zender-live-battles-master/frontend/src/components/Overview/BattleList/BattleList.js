import React from 'react';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';

import BattleItem from './BattleItem';

const BattleList = ({ battles }) => (	
	<div className="battleList">
		<div className="container">
			<h2 className="battleList__title">Matchen die op dit moment gespeeld worden</h2>		
			{
				isEmpty(battles) ?
					<p>Geen battles gevonden :'(</p>
						:
					<div>
						{ 
							keys(battles).map(battleId => <BattleItem key={battleId} battle={battles[battleId]} />)
						}
					</div>
			}
		</div>
	</div>
);

export default BattleList;