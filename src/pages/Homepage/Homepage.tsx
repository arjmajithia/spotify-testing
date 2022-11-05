import React from 'react';
import { Authorization } from '../../components/authorization/Authorization'
import { UserInfo } from '../../components/userinfo/UserInfo';

export default function Homepage() {
	return (
	<div>
	<h1>Homepage</h1>
	  <Authorization />
	  <UserInfo />
	</div>
	);
}
