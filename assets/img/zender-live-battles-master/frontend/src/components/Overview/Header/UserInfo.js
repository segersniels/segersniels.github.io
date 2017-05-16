import React from 'react';

const UserInfo = ({ user }) => (
	<div className="userInfo">
		<table className="userInfo__container">
			<tbody>
				<tr>
					<td><img className="userInfo__img" src={user.avatar} alt={'Profile img ' + user.name} /></td>
					<td className="userInfo__name">{user.name}</td>
				</tr>
			</tbody>
		</table>
	</div>
);

export default UserInfo;